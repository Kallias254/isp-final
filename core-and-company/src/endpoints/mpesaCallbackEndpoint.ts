import { Payload } from 'payload';
import { Endpoint } from 'payload/config';
import { addMonths, addQuarters } from '../utils/dateUtils';

const mpesaCallbackEndpoint: Endpoint = {
  path: '/mpesa-callback',
  method: 'post',
  handler: async (req, res) => {
    const payload: Payload = req.payload;

    if (!req.body.Body || !req.body.Body.stkCallback || !req.body.Body.stkCallback.CallbackMetadata) {
      payload.logger.error('Invalid M-Pesa callback data structure');
      return res.status(400).json({ message: 'Invalid M-Pesa callback data structure' });
    }

    const callbackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;

    const getValue = (name) => {
      const item = callbackMetadata.find((i) => i.Name === name);
      return item ? item.Value : null;
    };

    const TransAmount = getValue('Amount');
    const TransID = getValue('MpesaReceiptNumber');
    const BillRefNumber = getValue('BillRefNumber');
    const MSISDN = getValue('PhoneNumber');
    const InvoiceNumber = null; // This is not provided in the mock callback

    const accountNumber = BillRefNumber || InvoiceNumber;
    const amountPaid = parseFloat(TransAmount);
    const paymentReference = TransID;
    const mpesaPhoneNumber = MSISDN;

    if (!accountNumber || isNaN(amountPaid) || !paymentReference) {
      payload.logger.error('Missing or invalid Mpesa callback data');
      return res.status(400).json({ message: 'Missing or invalid Mpesa callback data' });
    }

    try {
      let targetInvoice = null;
      let targetSubscriber = null;

      // 1. Attempt to find Invoice by BillRefNumber (as invoiceNumber)
      try {
        const invoiceLookup = await payload.find({
          collection: 'invoices',
          where: {
            invoiceNumber: {
              equals: BillRefNumber,
            },
          },
          limit: 1,
        });

        if (invoiceLookup.docs.length > 0) {
          targetInvoice = invoiceLookup.docs[0];
          // If invoice found, get the associated subscriber
          if (targetInvoice.subscriber) {
            targetSubscriber = await payload.findByID({
              collection: 'subscribers',
              id: typeof targetInvoice.subscriber === 'object' ? targetInvoice.subscriber.id : targetInvoice.subscriber,
            });
          }
        }
      } catch (error: any) {
        payload.logger.error(`Error finding invoice by invoiceNumber ${BillRefNumber}: ${error.message}`);
      }

      // 2. If no specific invoice found, fallback to finding subscriber by accountNumber
      if (!targetInvoice) {
        try {
          const subscriberLookup = await payload.find({
            collection: 'subscribers',
            where: {
              accountNumber: {
                equals: BillRefNumber,
              },
            },
            limit: 1,
          });

          if (subscriberLookup.docs.length > 0) {
            targetSubscriber = subscriberLookup.docs[0];
            // Find the oldest open invoice for this subscriber
            const oldestOpenInvoiceLookup = await payload.find({
              collection: 'invoices',
              where: {
                and: [
                  {
                    subscriber: {
                      equals: targetSubscriber.id,
                    },
                  },
                  {
                    status: {
                      in: ['unpaid', 'overdue', 'partially-paid'],
                    },
                  },
                ],
              },
              sort: 'dueDate', // Sort by due date to get the oldest first
              limit: 1,
            });

            if (oldestOpenInvoiceLookup.docs.length > 0) {
              targetInvoice = oldestOpenInvoiceLookup.docs[0];
            } else {
              payload.logger.warn(`No open invoice found for subscriber ${targetSubscriber.id} (${BillRefNumber}). Treating as advance payment.`);
              // If no open invoice, still proceed as advance payment for the subscriber
            }
          }
        } catch (error: any) {
          payload.logger.error(`Error finding subscriber by accountNumber ${BillRefNumber}: ${error.message}`);
        }
      }

      if (!targetSubscriber) {
        payload.logger.error(`Could not find invoice or subscriber for BillRefNumber: ${BillRefNumber}`);
        return res.status(404).json({ message: `Invoice or Subscriber not found for BillRefNumber: ${BillRefNumber}` });
      }

      // Now, targetInvoice and targetSubscriber are determined. Proceed with payment processing.

      // 3. Create a new Payment record
      const newPayment = await payload.create({
        collection: 'payments',
        data: {
          paymentReference: paymentReference,
          invoice: targetInvoice ? targetInvoice.id : null,
          amountPaid: amountPaid,
          paymentMethod: 'mpesa',
          paymentDate: new Date().toISOString(),
        },
      });

      payload.logger.info(`Payment ${paymentReference} recorded for subscriber ${targetSubscriber.id}`);

      // 4. Update Invoice status if an invoice was found
      if (targetInvoice) {
        const newAmountDue = targetInvoice.amountDue - amountPaid;
        const newStatus = newAmountDue <= 0 ? 'paid' : 'partially-paid';

        await payload.update({
          collection: 'invoices',
          id: targetInvoice.id,
          data: {
            status: newStatus,
            amountDue: newAmountDue > 0 ? newAmountDue : 0,
          },
        });
        payload.logger.info(`Invoice ${targetInvoice.id} status updated to ${newStatus}`);
      }

      // 5. Update Subscriber's accountBalance and nextDueDate
      let updatedAccountBalance = (targetSubscriber.accountBalance || 0) - amountPaid;
      let newNextDueDate = targetSubscriber.nextDueDate;

      // Advance next due date only if the invoice is fully paid
      if (targetInvoice && (targetInvoice.amountDue - amountPaid) <= 0) {
          const servicePlan = targetSubscriber.servicePlan;
          if (servicePlan && typeof servicePlan === 'object' && 'billingCycle' in servicePlan) {
            let currentDueDate = new Date(targetSubscriber.nextDueDate);
            if (servicePlan.billingCycle === 'monthly') {
              newNextDueDate = addMonths(currentDueDate, 1).toISOString();
            } else if (servicePlan.billingCycle === 'quarterly') {
              newNextDueDate = addQuarters(currentDueDate, 1).toISOString();
            }
          }
      }

      await payload.update({
        collection: 'subscribers',
        id: targetSubscriber.id,
        data: {
          accountBalance: updatedAccountBalance,
          nextDueDate: newNextDueDate,
        },
      });

      payload.logger.info(`Subscriber ${targetSubscriber.id} account balance and nextDueDate updated.`);

      return res.status(200).json({ message: 'Mpesa callback processed successfully' });
    } catch (error: any) {
      payload.logger.error(`Error processing Mpesa callback: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },
};

export default mpesaCallbackEndpoint;
