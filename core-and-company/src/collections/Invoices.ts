import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { sendNotification } from '../utils/notificationService'; // Import sendNotification
import { isAdminOrHasPermission } from '../utils/access';

const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'invoices' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'invoices' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'invoices' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'invoices' }),
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'subscribers',
      hasMany: false,
      required: true,
    },
    {
      name: 'amountDue',
      type: 'number',
      required: true,
      admin: {
        readOnly: true, // Auto-calculated from line items
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Partially Paid', value: 'partially-paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      required: true,
    },
    {
      name: 'lineItems',
      type: 'array',
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const payload = req.payload;
        const invoice = doc;

        // Only send notifications for 'create' or 'update' operations that change status
        if (operation === 'create' || (operation === 'update' && doc.status !== previousDoc.status)) {
          let title = '';
          let content = '';
          let triggerEvent = '';

          // Fetch the subscriber to get deviceToken and other details
          const subscriber = await payload.findByID({
            collection: 'subscribers',
            id: typeof invoice.subscriber === 'object' ? invoice.subscriber.id : invoice.subscriber,
          });

          if (!subscriber || !subscriber.deviceToken) {
            payload.logger.warn(`Subscriber or deviceToken not found for invoice ${invoice.invoiceNumber}. Skipping push notification.`);
            return;
          }

          if (operation === 'create') {
            title = 'New Invoice Generated!';
            content = `Your invoice ${invoice.invoiceNumber} for KES ${invoice.amountDue} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.`;
            triggerEvent = 'invoice.created';
          } else if (operation === 'update') {
            switch (invoice.status) {
              case 'unpaid':
                title = 'Invoice Reminder!';
                content = `Your invoice ${invoice.invoiceNumber} for KES ${invoice.amountDue} is still unpaid. Due on ${new Date(invoice.dueDate).toLocaleDateString()}.`;
                triggerEvent = 'invoice.status_unpaid';
                break;
              case 'overdue':
                title = 'Invoice Overdue!';
                content = `Your invoice ${invoice.invoiceNumber} for KES ${invoice.amountDue} is now overdue. Please make a payment to avoid service interruption.`;
                triggerEvent = 'invoice.status_overdue';
                break;
              case 'paid':
                title = 'Payment Received!';
                content = `Thank you! Your payment for invoice ${invoice.invoiceNumber} has been successfully received.`;
                triggerEvent = 'invoice.status_paid';
                break;
              // Add other statuses as needed
            }
          }

          if (title && content) {
            await sendNotification({
              payload: payload,
              recipient: subscriber.id, // Use subscriber ID as recipient for logging
              type: 'push',
              deviceToken: subscriber.deviceToken,
              title: title,
              content: content,
              triggerEvent: triggerEvent,
              data: {
                invoiceId: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                subscriberId: subscriber.id,
              },
            });
            payload.logger.info(`Push notification sent for invoice ${invoice.invoiceNumber} (event: ${triggerEvent})`);
          }
        }
      },
    ],
    afterDelete: [getAuditLogDeleteHook('invoices')],
  },
};

export default Invoices;
