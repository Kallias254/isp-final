import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'

const MessageTemplates: CollectionConfig = {
  slug: 'messageTemplates',
  admin: {
    useAsTitle: 'templateName',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'messageTemplates' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'messageTemplates' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'messageTemplates' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'messageTemplates' }),
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
  ],
}

export default MessageTemplates;
