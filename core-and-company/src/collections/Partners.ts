
import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'

const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'fullName',
  },
  hooks: {
    afterChange: [getAuditLogHook('partners')],
    afterDelete: [getAuditLogDeleteHook('partners')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'partners'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'partners'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'partners'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'partners'),
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'mpesaNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Prospect', value: 'prospect' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      required: true,
    },
    {
      name: 'buildings',
      type: 'relationship',
      relationTo: 'buildings',
      hasMany: true,
    },
    {
      name: 'commissionRate',
      type: 'number',
      defaultValue: 1500,
    },
    {
      name: 'referralCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'perks',
      type: 'checkbox',
    },
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
  ],
}

export default Partners;
