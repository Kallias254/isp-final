import { CollectionConfig } from 'payload/types';
import { setIspOwnerHook } from '../hooks/setIspOwner';
import { isAdminOrHasPermission } from '../utils/access';

const ServiceLocations: CollectionConfig = {
  slug: 'service-locations',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
  },
  access: {
    read: isAdminOrHasPermission('read', 'service-locations'),
    create: isAdminOrHasPermission('create', 'service-locations'),
    update: isAdminOrHasPermission('update', 'service-locations'),
    delete: isAdminOrHasPermission('delete', 'service-locations'),
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
      access: {
        update: () => false, // Prevent manual modification
      },
      admin: {
        hidden: true, // Hide from admin UI
      },
    },
  ],
};

export default ServiceLocations;
