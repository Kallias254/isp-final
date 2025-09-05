import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { isAdminOrHasPermission } from '../utils/access';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const SubscriberTechnicalDetails: CollectionConfig = {
  slug: 'subscriber-technical-details',
  admin: {
    useAsTitle: 'radiusUsername',
    group: 'Operations',
  },
  access: {
    read: isAdminOrHasPermission('read', 'subscriber-technical-details'),
    create: isAdminOrHasPermission('create', 'subscriber-technical-details'),
    update: isAdminOrHasPermission('update', 'subscriber-technical-details'),
    delete: isAdminOrHasPermission('delete', 'subscriber-technical-details'),
  },
  hooks: {
    beforeChange: [
      setIspOwnerHook,
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          // Auto-assign VLAN ID from a pool (placeholder)
          data.vlanId = Math.floor(Math.random() * (4094 - 100 + 1) + 100); // Random VLAN between 100 and 4094

          if (data.connectionType === 'pppoe') {
            const subscriber = await req.payload.findByID({
              collection: 'subscribers',
              id: data.subscriber,
            });

            if (subscriber) {
              // Auto-generate RADIUS username
              data.radiusUsername = `${subscriber.firstName.toLowerCase()}.${subscriber.lastName.toLowerCase()}`;
            }

            // Auto-generate a random password
            data.radiusPassword = Math.random().toString(36).slice(-8);
          }
        }
        return data;
      },
    ],
    afterChange: [getAuditLogHook('subscriber-technical-details')],
    afterDelete: [getAuditLogDeleteHook('subscriber-technical-details')],
  },
  fields: [
    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'subscribers',
      required: true,
      hasMany: false,
      unique: true,
    },
    {
      name: 'vlanId',
      type: 'number',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-assigned from a VLAN pool for subscriber isolation.',
      },
    },
    {
      name: 'connectionType',
      type: 'select',
      options: [
        { label: 'PPPoE', value: 'pppoe' },
        { label: 'IPoE-DHCP', value: 'ipoe-dhcp' },
      ],
      required: true,
    },
    {
      name: 'radiusUsername',
      type: 'text',
      unique: true,
      admin: {
        condition: (data) => data.connectionType === 'pppoe',
      },
    },
    {
      name: 'radiusPassword',
      type: 'text',
      admin: {
        condition: (data) => data.connectionType === 'pppoe',
      },
    },
    {
      name: 'macAddress',
      type: 'text',
      admin: {
        condition: (data) => data.connectionType === 'ipoe-dhcp',
      },
    },
    {
      name: 'assignedIp',
      type: 'text',
      admin: {
        description: 'The static IP assigned. Required for Static-Pool plans.',
      },
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
};

export default SubscriberTechnicalDetails;
