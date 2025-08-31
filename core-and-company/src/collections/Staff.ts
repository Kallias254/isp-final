
import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'

const Staff: CollectionConfig = {
  slug: 'staff',
  auth: true,
  admin: {
    useAsTitle: 'fullName',
  },
  hooks: {
    afterChange: [getAuditLogHook('staff')],
    afterDelete: [getAuditLogDeleteHook('staff')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'staff' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'staff' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'staff' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'staff' }),
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    
    {
      name: 'assignedRole',
      type: 'relationship',
      relationTo: 'roles',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
    },
  ],
}

export default Staff
