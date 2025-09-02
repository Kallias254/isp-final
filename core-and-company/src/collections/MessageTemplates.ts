import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'

const MessageTemplates: CollectionConfig = {
  slug: 'messageTemplates',
  admin: {
    useAsTitle: 'templateName',
  },
  hooks: {
    afterChange: [getAuditLogHook('messageTemplates')],
    afterDelete: [getAuditLogDeleteHook('messageTemplates')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'messageTemplates'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'messageTemplates'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'messageTemplates'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'messageTemplates'),
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
    },
  ],
}

export default MessageTemplates;
