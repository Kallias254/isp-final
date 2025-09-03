import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const IpSubnets: CollectionConfig = {
  slug: 'ipSubnets',
  admin: {
    useAsTitle: 'network',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('ipSubnets')],
    afterDelete: [getAuditLogDeleteHook('ipSubnets')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'ipSubnets'),
    create: isAdminOrHasPermission('create', 'ipSubnets'),
    update: isAdminOrHasPermission('update', 'ipSubnets'),
    delete: isAdminOrHasPermission('delete', 'ipSubnets'),
  },
  fields: [
    {
      name: 'network',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
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

export default IpSubnets;
