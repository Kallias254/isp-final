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
      admin: {
        description: 'in Mbps',
      }
    },
    {
      name: 'uploadSpeed',
      type: 'number',
      required: true,
      admin: {
        description: 'in Mbps',
      }
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'in KES',
      }
    },
    {
      type: 'collapsible',
      label: 'IP & RADIUS Logic',
      fields: [
        {
          name: 'ipAssignmentType',
          type: 'select',
          options: [
            { label: 'Dynamic-Pool', value: 'dynamic-pool' },
            { label: 'Static-Pool', value: 'static-pool' },
            { label: 'Static-Individual', value: 'static-individual' },
          ],
          required: true,
        },
        {
          name: 'dynamicIpPool',
          type: 'relationship',
          relationTo: 'ipSubnets',
          hasMany: false,
          validate: (value, { siblingData }) => {
            if (siblingData.ipAssignmentType === 'dynamic-pool' && !value) {
              return 'This field is required for Dynamic-Pool plans.';
            }
            return true;
          },
          admin: {
            condition: (_, siblingData) => siblingData.ipAssignmentType === 'dynamic-pool',
          },
        },
        {
          name: 'staticIpPool',
          type: 'relationship',
          relationTo: 'ipSubnets',
          hasMany: false,
          validate: (value, { siblingData }) => {
            if (siblingData.ipAssignmentType === 'static-pool' && !value) {
              return 'This field is required for Static-Pool plans.';
            }
            return true;
          },
          admin: {
            condition: (_, siblingData) => siblingData.ipAssignmentType === 'static-pool',
          },
        },
        {
          name: 'sessionLimit',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Prevents account sharing (Simultaneous-Use).',
          }
        },
      ]
    },
    {
      type: 'collapsible',
      label: 'Business Logic Fields',
      fields: [
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
      ]
    },
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
  ],
}

export default Plans;