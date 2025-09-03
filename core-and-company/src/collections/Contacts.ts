import { CollectionConfig } from 'payload/types'
import { isAdminOrHasPermission } from '../utils/access'
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook'
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'phoneNumber',
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [getAuditLogHook('contacts')],
    afterDelete: [getAuditLogDeleteHook('contacts')],
  },
  access: {
    read: isAdminOrHasPermission('read', 'contacts'),
    create: isAdminOrHasPermission('create', 'contacts'),
    update: isAdminOrHasPermission('update', 'contacts'),
    delete: isAdminOrHasPermission('delete', 'contacts'),
  },
  fields: [
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'fullName',
      type: 'text',
    },
    {
      name: 'source',
      type: 'text',
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
}

export default Contacts;
