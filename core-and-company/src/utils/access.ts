import { AccessArgs } from 'payload/config';
import { User, Staff } from '../payload-types'; // Import Staff type

interface HasPermissionArgs extends AccessArgs {
  action: 'read' | 'create' | 'update' | 'delete';
  collection: string;
}

export const isAdminOrHasPermission = async ({ req, action, collection }: HasPermissionArgs): Promise<boolean> => {
  const user = req.user as Staff | undefined; // Cast user to Staff type

  // If user is not logged in, deny access
  if (!user) {
    return false;
  }

  // If user is an admin (assuming 'admin' is a special role name or a flag on the user)
  // This check assumes a simple 'admin' role name. Adjust if your admin check is different.
  if (user.assignedRole && typeof user.assignedRole === 'object' && user.assignedRole.name === 'Admin') {
    return true;
  }

  // If user has an assigned role, check its permissions
  if (user.assignedRole && typeof user.assignedRole === 'object' && user.assignedRole.permissions) {
    const permissions = user.assignedRole.permissions;

    // Find permissions for the specific collection
    const collectionPermissions = permissions.find(p => p.collection === collection);

    if (collectionPermissions) {
      // Check if the specific action is allowed for this collection
      return collectionPermissions[action];
    }
  }

  // If no specific permission found or role not assigned, deny access
  return false;
};
