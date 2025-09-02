import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'

const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'recipient',
  },
  hooks: {
    afterChange: [getAuditLogHook('messages')],
    afterDelete: [getAuditLogDeleteHook('messages')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'messages'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'messages'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'messages'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'messages'),
  },
  fields: [
    {
      name: 'recipient',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'SMS', value: 'sms' },
        { label: 'Email', value: 'email' },
        { label: 'Push Notification', value: 'push' }, // Added 'push' type
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      required: true,
    },
    {
      name: 'triggerEvent',
      type: 'text',
    },
    {
      name: 'sentBy',
      type: 'relationship',
      relationTo: 'staff',
      hasMany: false,
    },
    {
      name: 'bulkSend',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
  ],
}

export default Messages;
