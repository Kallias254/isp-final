import { CollectionConfig } from 'payload/types';

const Company: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
};

export default Company;
