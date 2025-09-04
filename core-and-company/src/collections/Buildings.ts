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
      name: 'location',
      type: 'relationship',
      relationTo: 'service-locations',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        'active',
        'prospecting',
        'negotiating',
        'on_hold',
      ],
      defaultValue: 'prospecting',
      required: true,
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
