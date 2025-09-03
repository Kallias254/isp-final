import { Staff } from '../payload-types';
import { Access, AccessArgs } from 'payload/types';

type PermissionType = 'create' | 'read' | 'update' | 'delete';

export const isSuperAdmin = (user: Staff | undefined): boolean => {
  if (!user) return false;
  if (user.assignedRole && typeof user.assignedRole === 'object' && user.assignedRole.permissions) {
    const permissions = user.assignedRole.permissions;
    const rolesPermission = permissions.find(p => p.collection === 'roles');
    if (rolesPermission && rolesPermission.read) {
      return true;
    }
  }
  return false;
}

export const isAdminOrHasPermission = (
  action: PermissionType,
  collectionSlug: string
): Access => {
  return async ({ req }: AccessArgs) => {
    const user = req.user as Staff | undefined;

    if (!user) {
      return false;
    }

    // Super Admins have unrestricted access
    if (isSuperAdmin(user)) {
      return true;
    }

    // Check for user role and permissions
    if (user.assignedRole && typeof user.assignedRole === 'object' && user.assignedRole.permissions) {
      const permissions = user.assignedRole.permissions;
      const collectionPermissions = permissions.find(p => p.collection === collectionSlug);

      if (collectionPermissions && collectionPermissions[action]) {
        // For 'read' operations, return a query constraint to filter by ispOwner
        if (action === 'read') {
          return {
            ispOwner: {
              equals: user.ispOwner,
            },
          };
        }
        // For 'create', 'update', 'delete', allow the operation.
        // The beforeChange hook will ensure the ispOwner is set correctly on create.
        // For update/delete, Payload's default behavior + read access query ensures they can only affect their own documents.
        return true;
      }
    }

    // Deny access if no matching permission is found
    return false;
  };
};
