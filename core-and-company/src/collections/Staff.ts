
import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Staff: CollectionConfig = {
  slug: 'staff',
  auth: true,
  admin: {
    useAsTitle: 'fullName',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('staff')],
    afterDelete: [getAuditLogDeleteHook('staff')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'staff'),
    create: isAdminOrHasPermission('create', 'staff'),
    update: isAdminOrHasPermission('update', 'staff'),
    delete: isAdminOrHasPermission('delete', 'staff'),
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
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
  ],
}

export default Staff
