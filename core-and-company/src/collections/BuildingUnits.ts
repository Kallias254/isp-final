import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const BuildingUnits: CollectionConfig = {
  slug: 'buildingUnits',
  admin: {
    useAsTitle: 'unitNumber',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('buildingUnits')],
    afterDelete: [getAuditLogDeleteHook('buildingUnits')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'building-units'),
    create: isAdminOrHasPermission('create', 'building-units'),
    update: isAdminOrHasPermission('update', 'building-units'),
    delete: isAdminOrHasPermission('delete', 'building-units'),
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
      access: {
        update: () => false, // Prevent manual modification
      },
      admin: {
        hidden: true, // Hide from admin UI
      },
    },
  ],
};

export default BuildingUnits;
