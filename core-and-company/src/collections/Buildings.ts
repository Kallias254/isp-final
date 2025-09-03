import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Buildings: CollectionConfig = {
  slug: 'buildings',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('buildings')],
    afterDelete: [getAuditLogDeleteHook('buildings')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'buildings'),
    create: isAdminOrHasPermission('create', 'buildings'),
    update: isAdminOrHasPermission('update', 'buildings'),
    delete: isAdminOrHasPermission('delete', 'buildings'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'buildingImage',
      label: 'Building Image',
      type: 'upload',
      relationTo: 'media',
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
      relationTo: 'network-devices',
      hasMany: true,
      admin: {
        readOnly: true,
      },
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

export default Buildings;
