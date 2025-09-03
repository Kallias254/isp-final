# Multi-Tenancy Plan for ISP Management Platform

This document outlines the multi-tenancy strategy for the ISP Management Platform, adhering to the "Modular Monolith" architectural principle.

## 1. Core Principle: Single Instance, Segregated Data

The platform will operate as a single, unified Payload CMS application with a single database. Multi-tenancy is achieved through data segregation at the application level, rather than separate database instances or microservices per tenant.

## 2. Implementation Strategy

### 2.1. `ispOwner` Field on Collections

All relevant collections (e.g., `Subscribers`, `Invoices`, `Staff`, `Tickets`, `Plans`, etc.) will include a mandatory `ispOwner` field.

*   **Type:** `relationship` to the `companies` collection.
*   **Requirement:** `required: true` to ensure every record is associated with an ISP owner.
*   **Access Control:**
    *   `access.update: () => false`: Prevents manual modification of the `ispOwner` field by administrators.
    *   `admin.hidden: true`: Hides the field from the Payload admin UI, ensuring it's managed programmatically.

### 2.2. Automatic `ispOwner` Assignment (Hooks)

A `beforeChange` hook will be implemented on all multi-tenant collections to automatically assign the `ispOwner` based on the logged-in user's `ispOwner` property.

*   **Mechanism:** When a new record is created or an existing one is updated, the system will check `req.user.ispOwner` and set the `data.ispOwner` field accordingly.
*   **Purpose:** This ensures that all data created or modified by a user is automatically associated with their respective ISP, enforcing data isolation.

### 2.3. Role-Based Access Control (RBAC)

Access to data will be strictly enforced using Payload's `access` functions, leveraging the `isAdminOrHasPermission` utility.

*   **Data Segregation:** These access functions will incorporate logic to ensure that users can only `read`, `create`, `update`, or `delete` records that belong to their `ispOwner`.
*   **Permissions:** Granular permissions (e.g., `read: subscribers`, `update: invoices`) will be defined within the `Roles` collection and checked against the user's assigned roles and their `ispOwner` context.

## 3. Benefits of this Approach

*   **Simplicity:** Leverages Payload CMS's built-in features and a single database, reducing operational complexity.
*   **Performance:** Direct database relationships between collections (e.g., `Tickets` to `Subscribers`) are maintained, ensuring efficient queries.
*   **Scalability:** A single application instance can serve multiple tenants, optimizing resource utilization.
*   **Data Integrity:** Centralized `ispOwner` assignment and access control minimize the risk of data leakage between tenants.

## 4. Future Considerations

*   **Tenant Onboarding:** Process for creating new `companies` (ISPs) and associating initial `Staff` users with them.
*   **Super Admin Role:** A global super-admin role might be necessary to manage multiple ISPs and perform cross-tenant operations (e.g., creating new `companies` records).

---

## Implementation Progress and Debugging Notes

### Multi-Tenancy Implementation Summary:

*   **`ispOwner` Field:** Added to all relevant collections (`Subscribers`, `Invoices`, `Tickets`, `Plans`, `Partners`, `Expenses`, `Leads`, `Messages`, `MessageTemplates`, `NetworkDevices`, `IpSubnets`, `IpAddresses`, `WorkOrders`, `CrisisEvents`, `ServiceLocations`, `Media`).
*   **`setIspOwnerHook`:** Applied to all multi-tenant collections to automatically assign `ispOwner` on creation.
*   **`isAdminOrHasPermission` Access Control:** Implemented and applied to all relevant collections for `create`, `read`, `update`, and `delete` operations, ensuring data segregation.
*   **Tenant Onboarding (`seed.ts`):** Created a seed script to programmatically create a default "Admin" role, a "Vantage" company, and an "admin@vantage.co.ke" user. This script now always creates these records (existence checks removed as per user request). Sample data for `Plans`, `Subscribers`, `Buildings`, `BuildingUnits`, and `Leads` has also been added.
*   **Super Admin Role:** The "Admin" role is now the super admin, with full permissions.
*   **Dynamic Collection Permissions:** The `Roles` collection's `permissions` field now uses a dynamic `select` dropdown populated with all collection slugs.
*   **Data-Driven Super Admin:** Access control logic was updated to identify a super admin based on `read` permission on the `roles` collection, rather than a hardcoded role name.
*   **Linting and Type Checking:** All linting warnings and TypeScript compilation errors were addressed and resolved.

### Debugging Docker Container Restarts:

**Problem:** The `core-and-company-payload` Docker container was continuously restarting.

**Root Cause Identified:** The `entrypoint.sh` script inside the Docker container was explicitly running `npm run seed` every time the container started, leading to `ValidationError: Value must be unique` errors for seeded data (e.g., "Admin" role, "Vantage" company). Additionally, the `onInit` hook in `payload.config.ts` was commented out, preventing the seed from running correctly on application startup.

**Debugging Steps & Findings:**

1.  **Initial `ValidationError`:** Occurred because `npm run seed` was in `entrypoint.sh`.
    *   **Fix:** Modified `seed.ts` to check for existing data (later removed as per user request for fresh data on every build). Removed `npm run seed` from `entrypoint.sh`.

2.  **`onInit` Hook Commented Out:** The `onInit` hook in `payload.config.ts` was commented out, preventing the seed from running on application initialization.
    *   **Fix:** Uncommented the `onInit` hook in `payload.config.ts`.

3.  **Persistence Issue with Docker Volumes/Builds:** Changes to `seed.ts` and `payload.config.ts` were not always immediately reflected due to Docker caching or existing data in volumes.
    *   **Fix:** Repeatedly instructed user to perform `docker-compose down`, `docker volume rm isp-final_mongodb_data`, and `docker-compose up --build` to ensure a clean build and fresh database. This was the ultimate solution to ensure the updated seed logic was applied.

**Current Status:**
All identified issues related to Docker container restarts, seed execution, and super admin permissions have been successfully resolved. The seed script now runs correctly on application startup, populating the database with initial admin credentials and sample data. The admin user has full super admin access, and all collections are visible in the admin UI.