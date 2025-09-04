import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { setIspOwnerHook } from '../hooks/setIspOwner';
import { unitStatusAutomationHook } from '../hooks/unitStatusAutomationHook';

const BuildingUnits: CollectionConfig = {
  slug: 'building-units',
  admin: {
    useAsTitle: 'unitNumber',
  },
  hooks: {
    beforeChange: [setIspOwnerHook, unitStatusAutomationHook],
    afterChange: [getAuditLogHook('building-units')],
    afterDelete: [getAuditLogDeleteHook('building-units')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'building-units'),
    create: isAdminOrHasPermission('create', 'building-units'),
    update: isAdminOrHasPermission('update', 'building-units'),
    delete: isAdminOrHasPermission('delete', 'building-units'),
  },
  fields: [
    {
      name: 'unitNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'building',
      type: 'relationship',
      relationTo: 'buildings',
      hasMany: false,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Vacant / Unsurveyed', value: 'vacant-unsurveyed' },
        { label: 'Lead', value: 'lead' },
        { label: 'Active Subscriber', value: 'active-subscriber' },
        { label: 'Former Subscriber', value: 'former-subscriber' },
        { label: 'Do Not Solicit', value: 'do-not-solicit' },
      ],
      defaultValue: 'vacant-unsurveyed',
      required: true,
    },
    {
        name: 'subscriber',
        type: 'relationship',
        relationTo: 'subscribers',
        hasMany: false,
    },
    {
        name: 'lead',
        type: 'relationship',
        relationTo: 'leads',
        hasMany: false,
    },
    {
      name: 'currentProvider',
      type: 'text',
    },
    {
      name: 'competitorPaymentDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'currentIssues',
      type: 'textarea',
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
};

export default BuildingUnits;
