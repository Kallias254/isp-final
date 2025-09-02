import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';

const IpSubnets: CollectionConfig = {
  slug: 'ipSubnets',
  admin: {
    useAsTitle: 'network',
  },
  hooks: {
    afterChange: [getAuditLogHook('ipSubnets')],
    afterDelete: [getAuditLogDeleteHook('ipSubnets')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'ipSubnets'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'ipSubnets'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'ipSubnets'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'ipSubnets'),
  },
  fields: [
    {
      name: 'network',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
  ],
};

export default IpSubnets;
