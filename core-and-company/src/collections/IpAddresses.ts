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
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'ipAddresses' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'ipAddresses' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'ipAddresses' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'ipAddresses' }),
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
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'subscribers',
      hasMany: false,
    },
  ],
};

export default IpAddresses;
