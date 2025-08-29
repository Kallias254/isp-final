import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';

const Buildings: CollectionConfig = {
  slug: 'buildings',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'buildings' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'buildings' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'buildings' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'buildings' }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Prospecting', value: 'prospecting' },
        { label: 'Negotiating', value: 'negotiating' },
        { label: 'Active', value: 'active' },
        { label: 'Lost', value: 'lost' },
      ],
      required: true,
    },
    {
      name: 'partner',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: false,
    },
    {
      name: 'location',
      type: 'point',
    },
    {
      name: 'equipment',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
      admin: {
        readOnly: true,
      },
    },
  ],
};

export default Buildings;
