import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';

const Expenses: CollectionConfig = {
  slug: 'expenses',
  admin: {
    useAsTitle: 'description',
  },
  hooks: {
    afterChange: [getAuditLogHook('expenses')],
    afterDelete: [getAuditLogDeleteHook('expenses')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'expenses' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'expenses' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'expenses' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'expenses' }),
  },
  fields: [
    {
      name: 'expenseDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Bandwidth', value: 'bandwidth' },
        { label: 'Salaries', value: 'salaries' },
        { label: 'Rent', value: 'rent' },
        { label: 'Utilities', value: 'utilities' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'vendor',
      type: 'text',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'receipt',
      type: 'upload',
      relationTo: 'media', // Assuming a media collection for file uploads
    },
  ],
};

export default Expenses;
