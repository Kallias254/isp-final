import { CollectionConfig } from 'payload/types';
import { sendNotification } from '../utils/notificationService'; // Correctly placed import
import { isAdminOrHasPermission } from '../utils/access';
import { Subscriber } from '../payload-types'; // Import Subscriber type

interface InvoiceLineItem {
  description: string;
  quantity: number;
  price: number;
}

const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'accountNumber',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'subscribers' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'subscribers' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'subscribers' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'subscribers' }),
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'accountNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'mpesaNumber',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'contactPhone',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending Installation', value: 'pending-installation' },
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Deactivated', value: 'deactivated' },
      ],
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'servicePlan',
      type: 'relationship',
      relationTo: 'plans',
      hasMany: false,
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'billingCycle',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
      ],
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'nextDueDate',
      type: 'date',
      required: true,
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'accountBalance',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'gracePeriodEndDate',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'trialEndDate',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'addressNotes',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'internalNotes',
      type: 'richText',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'initialOneOffCharges',
      type: 'array',
      label: 'Initial One-Off Charges',
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
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
      admin: {
        condition: (_, siblingData) => !siblingData.id || (siblingData.initialOneOffCharges && siblingData.initialOneOffCharges.length > 0),
      },
    },
    {
      name: 'connectionType',
      type: 'select',
      options: [
        { label: 'PPPoE', value: 'pppoe' },
        { label: 'IPoE/DHCP', value: 'ipoe-dhcp' },
        { label: 'Static IP', value: 'static-ip' },
        { label: 'Hotspot', value: 'hotspot' },
      ],
    },
    {
      name: 'radiusUsername',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'radiusPassword',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'assignedIp',
      type: 'relationship',
      relationTo: 'ipAddresses',
      hasMany: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'macAddress',
      type: 'text',
    },
    {
      name: 'router',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: false,
    },
    {
      name: 'deviceToken', // New field for push notifications
      type: 'text',
      admin: {
        description: 'Device token for sending push notifications to the subscriber\'s app.',
      },
    },
  ],
  hooks: {
    afterChange: [
      // Existing hook for Initial Invoice Generation
      async ({ req, doc, operation }) => {
        const typedDoc = doc as Subscriber; // Explicitly type doc
        if (operation === 'create') {
          const payload = req.payload;
          const subscriberId = typedDoc.id;
          const servicePlan = typedDoc.servicePlan;

          // Fetch the full service plan details
          const plan = await payload.findByID({
            collection: 'plans',
            id: typeof servicePlan === 'object' ? servicePlan.id : servicePlan,
          });

          if (!plan) {
            payload.logger.error(`Service Plan not found for Subscriber ${subscriberId}`);
            return doc;
          }

          let totalAmountDue = 0;
          const lineItems: { description: string; quantity: number; price: number; }[] = [];

          // Add recurring plan fee
          lineItems.push({
            description: `Service Plan: ${plan.name} (${plan.billingCycle})`,
            quantity: 1,
            price: plan.price,
          });
          totalAmountDue += plan.price;

          // Add one-off charges
          if (typedDoc.initialOneOffCharges && Array.isArray(typedDoc.initialOneOffCharges)) {
            const initialCharges: { description: string; quantity: number; price: number; }[] = typedDoc.initialOneOffCharges;
            if (initialCharges.length > 0) {
              initialCharges.forEach((charge: { description: string; quantity: number; price: number; }) => {
                lineItems.push({
                  description: charge.description,
                  quantity: charge.quantity,
                  price: charge.price,
                });
                totalAmountDue += charge.quantity * charge.price;
              });
            }
          }

          // Create the first Invoice
          await payload.create({
            collection: 'invoices',
            data: {
              invoiceNumber: `INV-${Date.now()}`,
              subscriber: subscriberId,
              amountDue: totalAmountDue,
              dueDate: new Date().toISOString(), // Due today for initial invoice
              status: 'unpaid',
              lineItems: lineItems,
            },
          });

          payload.logger.info(`Initial Invoice created for Subscriber ${subscriberId}`);
        }
        return doc;
      },
      // New hook for WorkOrder creation
      async ({ req, doc, operation }) => {
        const typedDoc = doc as Subscriber; // Explicitly type doc
        if (operation === 'create') {
          const payload = req.payload;
          const subscriberId = typedDoc.id;

          // Create a new WorkOrder for New Installation
          await payload.create({
            collection: 'workOrders',
            data: {
              orderType: 'new-installation',
              subscriber: subscriberId,
              status: 'pending',
              notes: `New installation for subscriber ${doc.firstName} ${doc.lastName} (${doc.accountNumber})`,
            },
          });

          payload.logger.info(`New Installation WorkOrder created for Subscriber ${subscriberId}`);
        }
        return doc;
      },
      // New hook for status changes (e.g., suspended)
      async ({ req, doc, operation, previousDoc }) => { // Changed originalDoc to previousDoc
        const typedDoc = doc as Subscriber; // Explicitly type doc
        const typedPreviousDoc = previousDoc as Subscriber; // Explicitly type previousDoc
        if (operation === 'update' && typedPreviousDoc && typedPreviousDoc.status !== typedDoc.status) { // Changed originalDoc to previousDoc
          const payload = req.payload;
          const subscriber = typedDoc;

          if (!subscriber.deviceToken) {
            payload.logger.warn(`No deviceToken found for subscriber ${subscriber.id}. Skipping status change push notification.`);
            return doc;
          }

          let title = '';
          let content = '';
          let triggerEvent = '';

          switch (subscriber.status) {
            case 'suspended':
              title = 'Service Suspended!';
              content = `Your service has been suspended due to an overdue balance. Please make a payment to restore service.`;
              triggerEvent = 'subscriber.suspended';
              break;
            case 'active':
              // Only send if not a reconnection (handled by Payments hook)
              if (previousDoc.status !== 'suspended') { // Changed originalDoc to previousDoc
                title = 'Service Active!';
                content = `Your service is now active. Enjoy uninterrupted internet!`;
                triggerEvent = 'subscriber.active';
              }
              break;
            // Add other status changes as needed
          }

          if (title && content) {
            await sendNotification({
              payload: payload,
              recipient: subscriber.id,
              type: 'push',
              deviceToken: subscriber.deviceToken || undefined,
              title: title,
              content: content,
              triggerEvent: triggerEvent,
              data: {
                subscriberId: subscriber.id,
                status: subscriber.status,
              },
            });
            payload.logger.info(`Push notification sent for subscriber ${subscriber.id} status change to ${subscriber.status}`);
          }
        }
        return doc;
      },
    ],
  },
};

export default Subscribers;
