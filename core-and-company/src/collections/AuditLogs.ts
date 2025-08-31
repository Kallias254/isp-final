import { CollectionConfig } from 'payload/types'
import { isAdmin } from '../utils/access'

const AuditLog: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['timestamp', 'user', 'action', 'collectionSlug', 'documentId'],
    description: 'A log of all changes made to the system.',
  },
  access: {
    read: ({ req }) => isAdmin({ req }),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'staff',
    },
    {
        name: 'action',
        type: 'text',
        required: true,
    },
    {
        name: 'collectionSlug',
        type: 'text',
        required: true,
    },
    {
        name: 'documentId',
        type: 'text',
        required: true,
    },
    {
        name: 'before',
        type: 'json',
    },
    {
        name: 'after',
        type: 'json',
    },
  ],
}

export default AuditLog
