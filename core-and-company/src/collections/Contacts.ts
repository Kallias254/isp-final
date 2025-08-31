import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'

const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'phoneNumber',
  },
  hooks: {
    afterChange: [getAuditLogHook('contacts')],
    afterDelete: [getAuditLogDeleteHook('contacts')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'contacts' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'contacts' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'contacts' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'contacts' }),
  },
  fields: [
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'fullName',
      type: 'text',
    },
    {
      name: 'source',
      type: 'text',
    },
  ],
}

export default Contacts;
