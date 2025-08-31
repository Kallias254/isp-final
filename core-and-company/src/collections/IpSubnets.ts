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
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'ipSubnets' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'ipSubnets' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'ipSubnets' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'ipSubnets' }),
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
  ],
};

export default IpSubnets;
