import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';

const IpAddresses: CollectionConfig = {
  slug: 'ipAddresses',
  admin: {
    useAsTitle: 'ipAddress',
  },
  hooks: {
    afterChange: [getAuditLogHook('ipAddresses')],
    afterDelete: [getAuditLogDeleteHook('ipAddresses')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'ipAddresses'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'ipAddresses'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'ipAddresses'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'ipAddresses'),
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
    },
  ],
};

export default IpAddresses;
