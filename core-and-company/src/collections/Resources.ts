import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';

const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'resourceName',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'resources' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'resources' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'resources' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'resources' }),
  },
  fields: [
    {
      name: 'resourceName',
      type: 'text',
      required: true,
    },
    {
      name: 'resourceType',
      type: 'select',
      options: [
        { label: 'Router', value: 'router' },
        { label: 'Antenna', value: 'antenna' },
        { label: 'Switch', value: 'switch' },
        { label: 'Cable', value: 'cable' },
      ],
      required: true,
    },
    {
      name: 'serialNumber',
      type: 'text',
      unique: true,
    },
    {
      name: 'macAddress',
      type: 'text',
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Deployed', value: 'deployed' },
        { label: 'Faulty', value: 'faulty' },
        { label: 'Retired', value: 'retired' },
      ],
      required: true,
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: ['subscribers', 'buildings'],
      hasMany: false,
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'buildings',
      hasMany: false,
    },
  ],
};

export default Resources;
