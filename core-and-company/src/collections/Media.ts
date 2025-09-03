import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: './media',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('media')],
    afterDelete: [getAuditLogDeleteHook('media')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'media'),
    create: isAdminOrHasPermission('create', 'media'),
    update: isAdminOrHasPermission('update', 'media'),
    delete: isAdminOrHasPermission('delete', 'media'),
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
