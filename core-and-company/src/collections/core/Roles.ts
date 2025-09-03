import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../../hooks/auditLogHook';
import { collectionSlugs } from '../collectionSlugs';
import { isSuperAdmin } from '../../utils/access';

const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [getAuditLogHook('roles')],
    afterDelete: [getAuditLogDeleteHook('roles')],
  },
  access: {
    read: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
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
          type: 'select',
          options: collectionSlugs.map(slug => ({ label: slug, value: slug })),
          required: true,
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
