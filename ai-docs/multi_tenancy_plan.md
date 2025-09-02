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
