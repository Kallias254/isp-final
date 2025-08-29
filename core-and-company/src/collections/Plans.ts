
import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'

const Plans: CollectionConfig = {
  slug: 'plans',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'plans' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'plans' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'plans' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'plans' }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'downloadSpeed',
      type: 'number',
      required: true,
    },
    {
      name: 'uploadSpeed',
      type: 'number',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'billingCycle',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
      ],
      required: true,
    },
    {
      name: 'notes',
      type: 'text',
    },
    {
      name: 'planEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'activeForNewSignups',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'ipAssignmentType',
      type: 'select',
      options: [
        { label: 'Dynamic', value: 'dynamic' },
        { label: 'Static-Public', value: 'static-public' },
      ],
      defaultValue: 'dynamic',
      required: true,
    },
    {
      name: 'staticIpPool',
      type: 'relationship',
      relationTo: 'ipSubnets',
      hasMany: false,
      admin: {
        condition: (_, siblingData) => siblingData?.ipAssignmentType === 'static-public',
      },
    },
  ],
}

export default Plans;
