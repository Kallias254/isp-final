import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';

const BuildingUnits: CollectionConfig = {
  slug: 'buildingUnits',
  admin: {
    useAsTitle: 'unitNumber',
  },
  hooks: {
    afterChange: [getAuditLogHook('buildingUnits')],
    afterDelete: [getAuditLogDeleteHook('buildingUnits')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'building-units'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'building-units'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'building-units'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'building-units'),
  },
  fields: [
    {
      name: 'unitNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'building',
      type: 'relationship',
      relationTo: 'buildings',
      hasMany: false,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Vacant', value: 'vacant' },
        { label: 'Occupied', value: 'occupied' },
        { label: 'Lead', value: 'lead' },
        { label: 'Subscriber', value: 'subscriber' },
      ],
      required: true,
    },
    {
      name: 'currentProvider',
      type: 'text',
    },
    {
      name: 'competitorPaymentDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'currentIssues',
      type: 'textarea',
    },
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
  ],
};

export default BuildingUnits;
