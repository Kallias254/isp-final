import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: './media',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'media' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'media' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'media' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'media' }),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
};

export default Media;
