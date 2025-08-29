import { CollectionConfig } from 'payload/types';

const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    // TODO: Implement access control based on the new data-driven RBAC
    // For now, allow all for development
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'permissions',
      type: 'array',
      label: 'Collection Permissions',
      fields: [
        {
          name: 'collection',
          type: 'text',
          required: true,
          // TODO: Potentially make this a select with dynamic options from Payload collections
        },
        {
          name: 'read',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'create',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'update',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'delete',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
};

export default Roles;
