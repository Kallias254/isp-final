import { CollectionConfig } from 'payload/types';

const CrisisEvents: CollectionConfig = {
  slug: 'crisis-events',
  admin: {
    useAsTitle: 'description',
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
    },
  ],
};

export default CrisisEvents;
