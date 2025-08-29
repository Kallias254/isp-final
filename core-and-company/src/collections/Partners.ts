
import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'

const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'fullName',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'partners' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'partners' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'partners' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'partners' }),
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
  ],
}

export default Partners;
