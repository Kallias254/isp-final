
import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'fullName',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('partners')],
    afterDelete: [getAuditLogDeleteHook('partners')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'partners'),
    create: isAdminOrHasPermission('create', 'partners'),
    update: isAdminOrHasPermission('update', 'partners'),
    delete: isAdminOrHasPermission('delete', 'partners'),
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
      access: {
        update: () => false, // Prevent manual modification
      },
      admin: {
        hidden: true, // Hide from admin UI
      },
    },
  ],
}

export default Partners;
