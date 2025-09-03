
import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Plans: CollectionConfig = {
  slug: 'plans',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('plans')],
    afterDelete: [getAuditLogDeleteHook('plans')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'plans'),
    create: isAdminOrHasPermission('create', 'plans'),
    update: isAdminOrHasPermission('update', 'plans'),
    delete: isAdminOrHasPermission('delete', 'plans'),
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

export default Plans;
