import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'users' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'users' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'users' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'users' }),
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};

export default Users;