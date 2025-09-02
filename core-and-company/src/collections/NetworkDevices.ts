import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';

const NetworkDevices: CollectionConfig = {
  slug: 'network-devices',
  admin: {
    useAsTitle: 'deviceName',
  },
  hooks: {
    afterChange: [
      getAuditLogHook('network-devices'),
      async ({ req, doc, operation }) => {
        if (operation === 'create' && doc.purchaseCost && doc.purchaseDate) {
          const { payload } = req;
          await payload.create({
            collection: 'expenses',
            data: {
              expenseDate: doc.purchaseDate,
              expenseType: 'capex',
              category: 'network-hardware',
              amount: doc.purchaseCost,
              description: `Purchase of ${doc.deviceName}`,
              relatedAsset: {
                relationTo: 'network-devices',
                value: doc.id,
              },
              status: 'approved',
              ispOwner: doc.ispOwner,
            },
          });
        }
        return doc;
      },
    ],
    afterDelete: [getAuditLogDeleteHook('network-devices')],
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission(req, 'read', 'network-devices'),
    create: ({ req }) => isAdminOrHasPermission(req, 'create', 'network-devices'),
    update: ({ req }) => isAdminOrHasPermission(req, 'update', 'network-devices'),
    delete: ({ req }) => isAdminOrHasPermission(req, 'delete', 'network-devices'),
  },
  fields: [
    {
      name: 'deviceName',
      type: 'text',
      required: true,
    },
    {
        name: 'ipAddress',
        type: 'relationship',
        relationTo: 'ipAddresses',
    },
    {
      name: 'deviceType',
      type: 'select',
      options: [
        { label: 'Core Router', value: 'core-router' },
        { label: 'Switch', value: 'switch' },
        { label: 'Access Point (AP)', value: 'access-point' },
        { label: 'Station (Building Receiver)', value: 'station' },
        { label: 'Customer Premise Equipment (CPE)', value: 'cpe' },
      ],
      required: true,
    },
    {
        name: 'purchaseDate',
        type: 'date',
    },
    {
        name: 'purchaseCost',
        type: 'number',
    },
    {
        name: 'monitoringType',
        type: 'select',
        options: [
            { label: 'ICMP Only', value: 'icmp' },
            { label: 'ICMP + SNMP', value: 'icmp-snmp' },
        ],
    },
    {
        name: 'snmpCommunity',
        type: 'text',
        // encrypted: true, // TODO: Re-enable after figuring out encryption
    },
    {
        name: 'physicalLocation',
        type: 'relationship',
        relationTo: 'service-locations',
    },
    {
        name: 'parentDevice',
        type: 'relationship',
        relationTo: 'network-devices',
    },
    {
        name: 'ispOwner',
        type: 'relationship',
        relationTo: 'companies',
    },
  ],
};

export default NetworkDevices;

