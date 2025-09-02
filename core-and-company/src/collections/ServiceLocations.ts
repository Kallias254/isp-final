import { CollectionConfig } from 'payload/types';

const ServiceLocations: CollectionConfig = {
  slug: 'service-locations',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'ispOwner',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
  ],
};

export default ServiceLocations;
