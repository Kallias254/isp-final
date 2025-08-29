# Data-Driven Access Control (RBAC) Architecture

This document outlines the architecture for implementing a flexible, data-driven Role-Based Access Control (RBAC) system within the Payload CMS. This approach allows ISP administrators to define roles and manage permissions directly through the CMS, without requiring code changes.

## 1. Overview

Instead of hardcoding permissions within collection configurations, permissions will be stored as data within a dedicated `Roles` collection. A single, reusable access control function will then query these stored permissions to determine user access for all actions across the system.

## 2. `Roles` Collection Definition

We will create a new collection named `Roles` (`src/collections/core/Roles.ts`). This collection will serve as the central repository for all defined roles and their associated permissions.

### Fields:

*   `name` (Text): The name of the role (e.g., "Admin", "Sales Manager", "Technician"). This will be a required, unique field.
*   `permissions` (Array of Objects): A flexible field to define granular permissions for each collection.
    *   Each object in this array will represent permissions for a specific collection.
    *   **Sub-fields for each `permissions` object:**
        *   `collection` (Select/Text): The slug of the collection to which these permissions apply (e.g., `subscribers`, `invoices`, `staff`). This should ideally be a select field populated dynamically with available collection slugs.
        *   `read` (Checkbox): Boolean indicating if users with this role can read/view documents in this collection.
        *   `create` (Checkbox): Boolean indicating if users with this role can create new documents in this collection.
        *   `update` (Checkbox): Boolean indicating if users with this role can update existing documents in this collection.
        *   `delete` (Checkbox): Boolean indicating if users with this role can delete documents from this collection.

### Example `Roles` Collection Entry:

```json
{
  "name": "Sales Manager",
  "permissions": [
    {
      "collection": "leads",
      "read": true,
      "create": true,
      "update": true,
      "delete": false
    },
    {
      "collection": "subscribers",
      "read": true,
      "create": false,
      "update": true,
      "delete": false
    },
    // ... permissions for other collections
  ]
}
```

## 3. Updating the `Staff` Collection

The `Staff` collection (`src/collections/core/Staff.ts`) will be modified to link to the new `Roles` collection.

*   The existing `role` field (if any) will be replaced or updated.
*   A new field, `assignedRole` (or similar), will be added as a `relationship` field, linking to the `Roles` collection.
    *   This will allow each staff member to be assigned a specific role defined in the `Roles` collection.

## 4. Generic Access Control Function

A single, reusable TypeScript function will be created (e.g., `src/utils/access.ts`) to handle all access control checks. This function will be applied to the `access` property of all collections.

### Logic:

1.  **Input:** Takes the `req` object (containing `req.user`) and the desired `action` (`read`, `create`, `update`, `delete`).
2.  **Admin Check:** If `req.user` exists and `req.user.role` (assuming 'admin' is a special hardcoded role for super-admins, or checking if their assigned role's name is 'Admin') indicates an administrator, return `true` (full access).
3.  **Role Lookup:** Retrieve the `assignedRole` for the current `req.user` from the database (if not already populated).
4.  **Permission Check:** Iterate through the `permissions` array of the user's `assignedRole`.
    *   Find the object where `collection` matches the current collection being accessed.
    *   Check if the boolean flag corresponding to the requested `action` (`read`, `create`, `update`, `delete`) is `true`.
5.  **Return:** Return `true` if permission is granted, `false` otherwise.

### Example Usage in a Collection (`access` property):

```typescript
// In src/collections/Subscribers.ts
import { isAdminOrHasPermission } from '../utils/access';

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'subscribers' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'subscribers' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'subscribers' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'subscribers' }),
  },
  // ... other fields and configurations
};
```

## 5. Application to Existing Collections

Once the `Roles` collection and the generic access function are implemented, every existing collection (`Subscribers`, `Invoices`, `Leads`, `Staff`, etc.) will have its `access` property updated to use this new generic function. This will replace any existing hardcoded access logic.