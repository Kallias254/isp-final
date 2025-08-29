import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';

const BuildingUnits: CollectionConfig = {
  slug: 'buildingUnits',
  admin: {
    useAsTitle: 'unitNumber',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'buildingUnits' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'buildingUnits' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'buildingUnits' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'buildingUnits' }),
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
  ],
};

export default BuildingUnits;
