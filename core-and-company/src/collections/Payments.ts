import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { sendNotification } from '../utils/notificationService'; // Import sendNotification
import { isAdminOrHasPermission } from '../utils/access';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'paymentReference',
  },
  access: {
    read: isAdminOrHasPermission('read', 'payments'),
    create: isAdminOrHasPermission('create', 'payments'),
    update: isAdminOrHasPermission('update', 'payments'),
    delete: isAdminOrHasPermission('delete', 'payments'),
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [
      getAuditLogHook('payments'),
      async ({ req, doc, operation }) => {
        // Check if a new payment was created
        if (operation === 'create') {
          const payload = req.payload;
          const paymentAmount = doc.amountPaid;
          const invoiceId = typeof doc.invoice === 'object' ? doc.invoice.id : doc.invoice;

          // Fetch the invoice to get the subscriber ID
          const invoice = await payload.findByID({
            collection: 'invoices',
            id: invoiceId,
            depth: 1, // Fetch subscriber details
          });

          if (!invoice || !invoice.subscriber) {
            payload.logger.error(`Invoice or Subscriber not found for Payment ${doc.id}`);
            return doc;
          }

          const subscriberId = typeof invoice.subscriber === 'object' ? invoice.subscriber.id : invoice.subscriber;

          // Fetch the full Subscriber record
          const subscriber = await payload.findByID({
            collection: 'subscribers',
            id: subscriberId,
            depth: 1, // Fetch servicePlan
          });

          if (!subscriber) {
            payload.logger.error(`Subscriber not found for Payment ${doc.id}`);
            return doc;
          }

          // Send payment received notification
          if (subscriber.deviceToken) {
            await sendNotification({
              payload: payload,
              recipient: subscriber.id,
              type: 'push',
              deviceToken: subscriber.deviceToken,
              title: 'Payment Received!',
              content: `Your payment of KES ${paymentAmount} for invoice ${invoice.invoiceNumber} has been successfully received. Thank you!`,
              triggerEvent: 'payment.received',
              data: {
                paymentId: doc.id,
                invoiceId: invoice.id,
                subscriberId: subscriber.id,
              },
              ispOwner: typeof subscriber.ispOwner === 'object' ? subscriber.ispOwner.id : subscriber.ispOwner, // Assign ispOwner from the Subscriber
            });
            payload.logger.info(`Push notification sent for payment ${doc.id} (event: payment.received)`);
          } else {
            payload.logger.warn(`No deviceToken found for subscriber ${subscriber.id}. Skipping payment received push notification.`);
          }


          // Check if subscriber is suspended
          if (subscriber.status === 'suspended') {
            // Simplified check: assume any payment for a suspended user is for reconnection
            // A more robust system would check if payment covers overdue amount
            payload.logger.info(`Payment received for suspended Subscriber ${subscriber.id}. Attempting reconnection.`);

            // Send API call to FreeRADIUS server to re-enable the user's account
            // This is a placeholder. Actual FreeRADIUS integration would involve an HTTP client.
            try {
              // Example: axios.post('http://freeradius-api.example.com/reconnect', {
              //   username: subscriber.accountNumber,
              // });
              payload.logger.info(`FreeRADIUS API call simulated for reconnection of Subscriber ${subscriber.id}`);
            } catch (radiusError: unknown) {
              payload.logger.error(`Error calling FreeRADIUS API for reconnection of Subscriber ${subscriber.id}: ${(radiusError as Error).message}`);
              // Log error, potentially notify admin
              return doc;
            }

            // Change Subscriber status to Active
            await payload.update({
              collection: 'subscribers',
              id: subscriber.id,
              data: {
                status: 'active',
              },
            });

            payload.logger.info(`Subscriber ${subscriber.id} status changed to Active (reconnected).`);

            // Send reconnection notification
            if (subscriber.deviceToken) {
              await sendNotification({
                payload: payload,
                recipient: subscriber.id,
                type: 'push',
                deviceToken: subscriber.deviceToken,
                title: 'Service Reconnected!',
                content: `Your service has been reconnected. Welcome back!`,
                triggerEvent: 'subscriber.reconnected',
                data: {
                  subscriberId: subscriber.id,
                },
                ispOwner: typeof subscriber.ispOwner === 'object' ? subscriber.ispOwner.id : subscriber.ispOwner, // Assign ispOwner from the Subscriber
              });
              payload.logger.info(`Push notification sent for subscriber ${subscriber.id} (event: subscriber.reconnected)`);
            } else {
              payload.logger.warn(`No deviceToken found for subscriber ${subscriber.id}. Skipping reconnection push notification.`);
            }
          }
        }
        return doc;
      },
    ],
    afterDelete: [getAuditLogDeleteHook('payments')],
  },
  fields: [
    {
        name: 'ispOwner',
        type: 'relationship',
        relationTo: 'companies',
        required: true,
        access: {
            update: () => false,
        },
        admin: {
            hidden: true,
        },
    },
    {
        name: 'paymentReference',
        type: 'text',
        required: true,
        unique: true,
    },
    {
        name: 'invoice',
        type: 'relationship',
        relationTo: 'invoices',
        required: true,
    },
    {
        name: 'amountPaid',
        type: 'number',
        required: true,
    },
    {
        name: 'paymentDate',
        type: 'date',
        required: true,
    },
    {
        name: 'paymentMethod',
        type: 'select',
        options: [
            { label: 'M-Pesa', value: 'mpesa' },
            { label: 'Bank Transfer', value: 'bank-transfer' },
            { label: 'Cash', value: 'cash' },
        ],
        required: true,
    },
  ],
};

export default Payments;
