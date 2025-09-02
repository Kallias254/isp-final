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
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'subscribers'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'subscribers'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'subscribers'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'subscribers'),
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
      name: 'cpeDevice',
      type: 'relationship',
      relationTo: 'network-devices',
      hasMany: false,
    },
    {
      name: 'deviceToken', // New field for push notifications
      type: 'text',
      admin: {
        description: 'Device token for sending push notifications to the subscriber\'s app.',
      },
    },
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
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
      async ({ doc, operation, req }) => {
        const { payload } = req as any;
        if (operation === 'create' && doc.trialDays > 0 && doc.upfrontCharges && doc.upfrontCharges.length > 0) {
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
              ispOwner: doc.ispOwner, // Assign ispOwner from the Subscriber
            },
          });
          payload.logger.info(`Upfront charges invoice created for new trial subscriber ${subscriberId}.`);
        }
      },
    ],
  },
};

export default Subscribers;