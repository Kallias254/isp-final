import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'
import { setIspOwnerHook } from '../hooks/setIspOwner';

const MessageTemplates: CollectionConfig = {
  slug: 'messageTemplates',
  admin: {
    useAsTitle: 'templateName',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('messageTemplates')],
    afterDelete: [getAuditLogDeleteHook('messageTemplates')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'messageTemplates'),
    create: isAdminOrHasPermission('create', 'messageTemplates'),
    update: isAdminOrHasPermission('update', 'messageTemplates'),
    delete: isAdminOrHasPermission('delete', 'messageTemplates'),
  },
  fields: [
    {
      name: 'templateName',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
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
}

export default MessageTemplates;
