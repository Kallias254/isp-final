import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const IpAddresses: CollectionConfig = {
  slug: 'ipAddresses',
  admin: {
    useAsTitle: 'ipAddress',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('ipAddresses')],
    afterDelete: [getAuditLogDeleteHook('ipAddresses')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'ipAddresses'),
    create: isAdminOrHasPermission('create', 'ipAddresses'),
    update: isAdminOrHasPermission('update', 'ipAddresses'),
    delete: isAdminOrHasPermission('delete', 'ipAddresses'),
  },
  fields: [
    {
      name: 'ipAddress',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'subnet',
      type: 'relationship',
      relationTo: 'ipSubnets',
      hasMany: false,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Assigned', value: 'assigned' },
        { label: 'Reserved', value: 'reserved' },
      ],
      required: true,
    },
    {
      name: 'assignedDevice',
      type: 'relationship',
      relationTo: 'network-devices',
      hasMany: false,
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

export default IpAddresses;
