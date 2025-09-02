import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: './media',
  },
  hooks: {
    afterChange: [getAuditLogHook('media')],
    afterDelete: [getAuditLogDeleteHook('media')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'media'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'media'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'media'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'media'),
  },
  fields: [
    {
      name: 'alt',
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

export default Media;
