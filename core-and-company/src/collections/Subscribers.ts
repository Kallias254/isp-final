import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { isAdminOrHasPermission } from '../utils/access';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'accountNumber',
  },
  access: {
    read: isAdminOrHasPermission('read', 'subscribers'),
    create: isAdminOrHasPermission('create', 'subscribers'),
    update: isAdminOrHasPermission('update', 'subscribers'),
    delete: isAdminOrHasPermission('delete', 'subscribers'),
  },
  hooks: {
    beforeChange: [
      setIspOwnerHook,
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
      getAuditLogHook('subscribers'),
      // On create, if it's a trial signup with upfront charges, create an invoice for those charges
      async ({ doc, operation, req }) => {
        const { payload } = req;
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
    afterDelete: [getAuditLogDeleteHook('subscribers')],
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
      name: 'accountNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'contactPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'mpesaNumber',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Pending Installation', value: 'pending-installation' },
        { label: 'Disconnected', value: 'disconnected' },
      ],
      defaultValue: 'pending-installation',
      required: true,
    },
    {
      name: 'servicePlan',
      type: 'relationship',
      relationTo: 'plans',
      required: true,
    },
    {
      name: 'billingCycle',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Annually', value: 'annually' },
      ],
      required: true,
    },
    {
      name: 'nextDueDate',
      type: 'date',
      required: true,
    },
    {
      name: 'accountBalance',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastPaymentDate',
      type: 'date',
    },
    {
      name: 'trialDays',
      type: 'number',
      admin: {
        description: 'Number of trial days for new signups',
      },
    },
    {
      name: 'trialEndDate',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'upfrontCharges',
      type: 'array',
      fields: [
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
        },
        {
          name: 'price',
          type: 'number',
        },
      ],
    },
    {
      name: 'addressNotes',
      type: 'textarea',
    },
    {
      name: 'connectionType',
      type: 'select',
      options: [
        { label: 'Fiber', value: 'fiber' },
        { label: 'Wireless', value: 'wireless' },
      ],
    },
    {
      name: 'assignedIp',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'cpeDevice',
      type: 'relationship',
      relationTo: 'network-devices',
      admin: {
        description: 'Customer Premise Equipment assigned to this subscriber',
      },
    },
    {
      name: 'radiusPassword',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated RADIUS password',
      },
    },
    {
      name: 'deviceToken',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'gracePeriodEndDate',
      type: 'date',
      admin: {
        description: 'Date until which service remains active despite overdue payment',
      },
    },
  ],
};

export default Subscribers;