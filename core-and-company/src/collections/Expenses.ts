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
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'expenses'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'expenses'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'expenses'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'expenses'),
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
        name: 'expenseType',
        type: 'select',
        options: [
            { label: 'Capital Expenditure (CAPEX)', value: 'capex' },
            { label: 'Operational Expenditure (OPEX)', value: 'opex' },
        ],
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Salaries', value: 'salaries' },
        { label: 'Bandwidth', value: 'bandwidth' },
        { label: 'Rent', value: 'rent' },
        { label: 'Utilities', value: 'utilities' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Network Hardware', value: 'network-hardware' },
        { label: 'Vehicles', value: 'vehicles' },
        { label: 'Tools', value: 'tools' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
        name: 'relatedAsset',
        type: 'relationship',
        relationTo: ['network-devices', 'staff'],
    },
    {
        name: 'status',
        type: 'select',
        options: [
            { label: 'Uncategorized', value: 'uncategorized' },
            { label: 'Approved', value: 'approved' },
        ],
    },
    {
        name: 'ispOwner',
        type: 'relationship',
        relationTo: 'companies',
        required: true,
    },
  ],
};

export default Expenses;
