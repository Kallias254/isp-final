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
    beforeValidate: [
      async ({ data, req, operation }) => {
        // --- Auto-generation on Create ---
        if (operation === 'create') {
          // Auto-assign VLAN ID if not provided
          if (!data.vlanId) {
            data.vlanId = Math.floor(Math.random() * (4094 - 100 + 1) + 100); // Random VLAN
          }

          // Auto-generate PPPoE credentials if not provided
          if (data.connectionType === 'pppoe') {
            if (!data.radiusUsername || !data.radiusPassword) {
              const subscriber = await req.payload.findByID({ collection: 'subscribers', id: data.subscriber });
              if (subscriber) {
                if (!data.radiusUsername) {
                  data.radiusUsername = `${subscriber.firstName.toLowerCase()}.${subscriber.lastName.toLowerCase()}.${Math.random().toString(36).slice(-4)}`;
                }
                if (!data.radiusPassword) {
                  data.radiusPassword = Math.random().toString(36).slice(-8);
                }
              }
            }
          }
        }

        // --- Conditional Validation ---
        const errors = [];
        if (data.connectionType === 'pppoe') {
          if (!data.radiusUsername) errors.push('RADIUS Username is required for PPPoE connections.');
          if (!data.radiusPassword) errors.push('RADIUS Password is required for PPPoE connections.');
        } else if (data.connectionType === 'ipoe-dhcp') {
          if (!data.macAddress) errors.push('MAC Address is required for IPoE-DHCP connections.');
        }

        // --- Related Data Validation (assignedIp) ---
        if (data.subscriber) {
            const subscriber = await req.payload.findByID({ collection: 'subscribers', id: data.subscriber, depth: 1 });
            if (subscriber && subscriber.servicePlan && typeof subscriber.servicePlan === 'object' && subscriber.servicePlan.ipAssignmentType === 'static-pool') {
                if (!data.assignedIp) {
                    errors.push('Assigned IP is required for plans with Static-Pool IP assignment.');
                }
            }
        }

        if (errors.length > 0) {
          throw new Error(errors.join(' '));
        }

        return data;
      },
    ],
    beforeChange: [
      setIspOwnerHook,
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
