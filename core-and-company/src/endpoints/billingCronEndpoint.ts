import { Payload } from 'payload';
import { Endpoint } from 'payload/config';
import { addDays, addMonths, addQuarters, isToday } from 'date-fns';

const billingCronEndpoint: Endpoint = {
  path: '/billing-cron',
  method: 'get',
  handler: async (req, res) => {
    const payload: Payload = req.payload;

    try {
      // --- 1. Handle "Trial Ending Soon" Notifications ---
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const trialsEndingSoon = await payload.find({
        collection: 'subscribers',
        where: {
          trialEndDate: {
            equals: threeDaysFromNow.toISOString().split('T')[0], // Compare date part only
          },
        },
      });

      for (const subscriber of trialsEndingSoon.docs) {
        payload.logger.info({
          event: 'subscriber.trial.ending_soon',
          subscriberId: subscriber.id,
          message: `Event: Subscriber ${subscriber.accountNumber}'s trial is ending soon.`,
        });
        // TODO: Integrate with a real notification service
      }

      // --- 2. Handle Trial Expiry and First Recurring Invoice ---
      const trialsEndingToday = await payload.find({
        collection: 'subscribers',
        where: {
          and: [
            {
              nextDueDate: {
                less_than_equal: new Date().toISOString(),
              },
            },
            {
              trialEndDate: {
                exists: true,
              },
            },
          ],
        },
        depth: 1,
      });

      for (const subscriber of trialsEndingToday.docs) {
        const servicePlan = subscriber.servicePlan;
        if (!servicePlan || typeof servicePlan !== 'object') continue;

        // Generate their first recurring invoice
        await payload.create({
          collection: 'invoices',
          data: {
            invoiceNumber: `INV-${Date.now()}-${subscriber.accountNumber}`,
            subscriber: subscriber.id,
            amountDue: servicePlan.price,
            dueDate: new Date().toISOString(),
            status: 'unpaid',
            lineItems: [{
              description: `Service Plan: ${servicePlan.name} (${servicePlan.billingCycle})`,
              quantity: 1,
              price: servicePlan.price,
            }],
            ispOwner: subscriber.ispOwner, // Assign ispOwner from the Subscriber
          },
        });

        // Calculate next due date
        let newNextDueDate = new Date(subscriber.nextDueDate);
        if (servicePlan.billingCycle === 'monthly') {
          newNextDueDate = addMonths(newNextDueDate, 1);
        } else if (servicePlan.billingCycle === 'quarterly') {
          newNextDueDate = addQuarters(newNextDueDate, 1);
        }

        // Transition user from trial to standard by removing trialEndDate and setting next due date
        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            trialEndDate: null,
            nextDueDate: newNextDueDate.toISOString(),
          },
        });

        payload.logger.info({
          event: 'invoice.created',
          subscriberId: subscriber.id,
          message: `Event: First recurring invoice created for subscriber ${subscriber.accountNumber} after trial.`,
        });
      }
      // 1. Find all Subscribers whose nextDueDate is today and are not on an active trial.
      const subscribers = await payload.find({
        collection: 'subscribers',
        where: {
          and: [
            {
              nextDueDate: {
                less_than_equal: new Date().toISOString(), // Check if due date is today or in the past
              },
            },
            {
              trialEndDate: {
                exists: false, // No trial end date
              },
            },
          ],
        },
        depth: 1, // Fetch servicePlan details
      });

      for (const subscriber of subscribers.docs) {
        // Ensure nextDueDate is actually today (or past, for robustness)
        if (!subscriber.nextDueDate || !isToday(new Date(subscriber.nextDueDate))) {
          continue; // Skip if not due today
        }

        const servicePlan = subscriber.servicePlan;

        if (!servicePlan || typeof servicePlan !== 'object' || !('price' in servicePlan)) {
          payload.logger.error(`Service Plan not found or invalid for Subscriber ${subscriber.id}`);
          continue;
        }

        let totalAmountDue = 0;
        const lineItems = [];

        // Add recurring plan fee
        lineItems.push({
          description: `Service Plan: ${servicePlan.name} (${servicePlan.billingCycle})`,
          quantity: 1,
          price: servicePlan.price,
        });
        totalAmountDue += servicePlan.price;

        // 2. Generate a new Invoice
        await payload.create({
          collection: 'invoices',
          data: {
            invoiceNumber: `INV-${Date.now()}-${subscriber.accountNumber}`,
            subscriber: subscriber.id,
            amountDue: totalAmountDue,
            dueDate: new Date().toISOString(), // Due today
            status: 'unpaid',
            lineItems: lineItems,
            ispOwner: subscriber.ispOwner, // Assign ispOwner from the Subscriber
          },
        });

        // 3. Update the Subscriber's nextDueDate to the next billing cycle
        let newNextDueDate = new Date(subscriber.nextDueDate);
        if (servicePlan.billingCycle === 'monthly') {
          newNextDueDate = addMonths(newNextDueDate, 1);
        } else if (servicePlan.billingCycle === 'quarterly') {
          newNextDueDate = addQuarters(newNextDueDate, 1);
        }
        // Add a small buffer to ensure it's always the next day, not same day if time is off
        newNextDueDate = addDays(newNextDueDate, 1);

        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            nextDueDate: newNextDueDate.toISOString(),
          },
        });

        payload.logger.info(`Invoice generated and nextDueDate updated for Subscriber ${subscriber.id}`);

        // TODO: Fire invoice.created event for Communications module
      }

      // Automated Suspension Logic
      const overdueSubscribers = await payload.find({
        collection: 'subscribers',
        where: {
          and: [
            {
              status: {
                equals: 'active', // Only suspend active subscribers
              },
            },
            {
              nextDueDate: {
                less_than: new Date().toISOString(), // Due date is in the past
              },
            },
            {
              or: [
                {
                  gracePeriodEndDate: {
                    exists: false, // No grace period set
                  },
                },
                {
                  gracePeriodEndDate: {
                    less_than: new Date().toISOString(), // Grace period has passed
                  },
                },
              ],
            },
          ],
        },
      });

      for (const subscriber of overdueSubscribers.docs) {
        // Change Subscriber's status to Suspended
        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            status: 'suspended',
          },
        });
        payload.logger.info(`Subscriber ${subscriber.id} suspended due to overdue invoice.`);

        payload.logger.info({
          event: 'subscriber.suspended',
          subscriberId: subscriber.id,
          message: `Event: Subscriber ${subscriber.accountNumber} was suspended.`,
        });
      }

      return res.status(200).json({ message: 'Automated billing cycle completed' });
    } catch (error: any) {
      payload.logger.error(`Error during automated billing cycle: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },
};

export default billingCronEndpoint;
