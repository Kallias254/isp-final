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
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'contacts'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'contacts'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'contacts'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'contacts'),
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
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
  ],
}

export default Contacts;
