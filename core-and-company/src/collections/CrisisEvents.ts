import { CollectionConfig } from 'payload/types';
import { setIspOwnerHook } from '../hooks/setIspOwner';
import { isAdminOrHasPermission } from '../utils/access';

const CrisisEvents: CollectionConfig = {
  slug: 'crisis-events',
  admin: {
    useAsTitle: 'description',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
  },
  access: {
    read: isAdminOrHasPermission('read', 'crisis-events'),
    create: isAdminOrHasPermission('create', 'crisis-events'),
    update: isAdminOrHasPermission('update', 'crisis-events'),
    delete: isAdminOrHasPermission('delete', 'crisis-events'),
  },
  fields: [
    {
        name: 'rootCauseDevice',
        type: 'relationship',
        relationTo: 'network-devices',
    },
    {
        name: 'affectedSubscribers',
        type: 'relationship',
        relationTo: 'subscribers',
        hasMany: true,
    },
    {
        name: 'status',
        type: 'select',
        options: [
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Resolved', value: 'resolved' },
        ],
    },
    {
        name: 'description',
        type: 'textarea',
    },
    {
        name: 'startTime',
        type: 'date',
    },
    {
        name: 'endTime',
        type: 'date',
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

export default CrisisEvents;
