import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
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
      access: {
        update: ({ req: { user } }) => user.email === 'admin@example.com',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      access: {
        update: ({ req: { user } }) => user.email === 'admin@example.com',
      },
    },
    {
      name: 'accountNumber',
      type: 'text',
      required: true,
      unique: true,
      access: {
        update: ({ req: { user } }) => user.email === 'admin@example.com',
      },
    },
    {
      name: 'mpesaNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
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
    },
    {
      name: 'servicePlan',
      type: 'relationship',
      relationTo: 'plans',
      hasMany: false,
    },
    {
      name: 'billingCycle',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
      ],
    },
    {
      name: 'nextDueDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'accountBalance',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'gracePeriodEndDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'trialDays',
      label: 'Trial Days (optional)',
      type: 'number',
      defaultValue: 0,
      min: 0,
      access: {
        update: ({ req: { user } }) => user.email === 'admin@example.com',
      },
    },
    {
      name: 'trialEndDate',
      type: 'date',
      hidden: true, // This field is now managed by the beforeChange hook
    },
    {
      name: 'addressNotes',
      type: 'textarea',
    },
    {
      name: 'internalNotes',
      type: 'richText',
    },
    {
      name: 'upfrontCharges',
      type: 'array',
      label: 'Upfront Charges',
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
      access: {
        update: ({ req: { user } }) => user.email === 'admin@example.com',
      },
      admin: {
        condition: (_, siblingData) => !siblingData.id || (siblingData.upfrontCharges && siblingData.upfrontCharges.length > 0),
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
      access: {
        update: ({ req: { user } }) => user.email === 'admin@example.com',
      },
    },
    {
      name: 'radiusPassword',
      type: 'text',
      access: {
        create: () => true,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'assignedIp',
      type: 'relationship',
      relationTo: 'ipAddresses',
      hasMany: false,
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
    beforeChange: [
      async ({ data, operation }) => {
        // On create, if trialDays are provided, calculate the trialEndDate and nextDueDate
        if (operation === 'create' && data.trialDays && data.trialDays > 0) {
          const now = new Date();
          const endDate = new Date(now.setDate(now.getDate() + data.trialDays));
          data.trialEndDate = endDate.toISOString();
          data.nextDueDate = endDate.toISOString();
        } else if (operation === 'create') {
            // Standard signup, set next due date to now
            data.nextDueDate = new Date().toISOString();
        }
        return data;
      },
    ],
    afterChange: [
      // On create, if it's a trial signup with upfront charges, create an invoice for those charges
      async ({ req, doc, operation }) => {
        if (operation === 'create' && doc.trialDays > 0 && doc.upfrontCharges && doc.upfrontCharges.length > 0) {
          const { payload } = req;
          const { upfrontCharges, id: subscriberId } = doc;

          let totalUpfrontAmount = 0;
          const lineItems = upfrontCharges.map(charge => {
            totalUpfrontAmount += charge.quantity * charge.price;
            return charge;
          });

          await payload.create({
            collection: 'invoices',
            data: {
              invoiceNumber: `INV-UPFRONT-${Date.now()}`,
              subscriber: subscriberId,
              amountDue: totalUpfrontAmount,
              dueDate: new Date().toISOString(),
              status: 'unpaid',
              lineItems: lineItems,
            },
          });
          payload.logger.info(`Upfront charges invoice created for new trial subscriber ${subscriberId}.`);
        }
        return doc;
      },
      // Existing hook for Initial Invoice Generation
      async ({ req, doc, operation, previousDoc }) => {
        const typedDoc: any = doc; // Use 'any' to avoid stale type errors during build

        // Only generate an invoice if a service plan is assigned and the user is activated
        if (operation === 'update' && typedDoc.status === 'active' && previousDoc.status === 'pending-installation' && typedDoc.servicePlan) {
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
          if (typedDoc.upfrontCharges && Array.isArray(typedDoc.upfrontCharges)) {
            const initialCharges: { description: string; quantity: number; price: number; }[] = typedDoc.upfrontCharges;
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

          // Publish the subscriber.activated event
          payload.logger.info({
            event: 'subscriber.activated',
            subscriberId: subscriberId,
            accountNumber: typedDoc.accountNumber,
            message: `Event: Subscriber ${typedDoc.accountNumber} was activated.`
          });
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
            collection: 'work-orders',
            data: {
              orderType: 'new-installation',
              subscriber: subscriberId,
              status: 'pending',
              notes: `New installation for subscriber ${typedDoc.firstName} ${typedDoc.lastName} (${typedDoc.accountNumber})`,
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
    afterDelete: [getAuditLogDeleteHook('subscribers')],
  },
};

export default Subscribers;
