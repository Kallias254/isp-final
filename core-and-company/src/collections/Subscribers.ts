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
    beforeValidate: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          // Generate a unique account number if one isn't provided
          if (!data.accountNumber) {
            data.accountNumber = `ACC-${Math.random().toString().substring(2, 8)}`;
          }

          // Calculate the nextDueDate if one isn't provided
          if (!data.nextDueDate) {
            const now = new Date();
            if (data.isTrial && data.trialDays && data.trialDays > 0) {
              // For trial users, set due date to the end of the trial
              const endDate = new Date(now.setDate(now.getDate() + data.trialDays));
              data.nextDueDate = endDate.toISOString();
            } else {
              // For non-trial users, set due date to 30 days from now
              const endDate = new Date(now.setDate(now.getDate() + 30));
              data.nextDueDate = endDate.toISOString();
            }
          }
        }
        return data;
      },
    ],
    beforeChange: [
      setIspOwnerHook,
    ],
    afterChange: [
      getAuditLogHook('subscribers'),
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
      name: 'accountNumber',
      type: 'text',
      required: true,
      unique: true,
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
        { label: 'Pending-Installation', value: 'pending-installation' },
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Deactivated', value: 'deactivated' },
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
      name: 'isTrial',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'trialDays',
      type: 'number',
      admin: {
        condition: (data) => data.isTrial === true,
      }
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
      name: 'addressNotes',
      type: 'textarea',
    },
    {
      name: 'internalNotes',
      type: 'richText',
    },
  ],
};

export default Subscribers;
