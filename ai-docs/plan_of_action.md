# Plan of Action: ISP Management Platform Implementation

This document outlines the progress of implementing custom functionalities and workflows for the ISP Management Platform, based on the provided `.md` documentation files.

## 1. Initial Setup & Collection Verification (Completed)

*   **Docker Build & Setup:**
    *   Resolved SWC `baseUrl` issues by adding `.swcrc` configuration.
    *   Resolved Payload `Staff` collection `password` field conflict.
    *   Resolved Docker port allocation conflicts by changing MongoDB port and performing full container cleanup.
    *   Successfully started Docker containers (`core-and-company-mongodb`, `core-and-company-payload`).
*   **Admin User Creation:** Successfully created the initial admin user via Playwright.
*   **Collection Definition Verification:** All collection `.ts` files have been reviewed and updated to align with their respective `.md` documentation specifications.

## 2. Custom Functionalities & Workflows (Completed)

This section lists all identified custom logic, hooks, endpoints, and integrations required for the system.

### 2.1. Core & Company Module (`01_core_and_company_module.md`)

*   **Status:** Completed

### 2.2. CRM & Sales Module (`02_crm_and_sales_module.md`)

*   **Lead Creation via WhatsApp/SMS:** Status: Completed
*   **Lead Conversion:** Status: Completed

### 2.3. Billing & Finance Module (`03_billing_and_finance_module.md`)

*   **Initial Invoice Generation:** Status: Completed
*   **Automated Billing Cycle:** Status: Completed
*   **Payment Reconciliation (Mpesa):** Status: Completed
*   **Automated Suspension:** Status: Completed

### 2.4. Operations & Network Management (NOC) Module (`04_operations_and_network_management_module.md`)

*   **Subscriber Provisioning & RADIUS Integration:** Status: Completed
*   **Subscriber Suspension (RADIUS Integration):** Status: Completed
*   **Automated Reconnection:** Status: Completed
*   **Monitoring & Alerting (Zabbix Integration):** Status: Replaced/Updated (See 5.9. ISP Network Monitoring & Financial Oversight)

### 5.9. ISP Network Monitoring & Financial Oversight
*   **Status:** Completed
*   **Specification:** `12_monitoring_and_financial_oversight.md`
*   **Goal:** Implement a comprehensive network monitoring and financial oversight system using LibreNMS, including automated financial tracking, emergency diagnostics, and a streamlined ticket-to-work-order escalation workflow.

### 2.5. Support & Communications Module (`05_support_and_communications_module.md`)

*   **Automated Notifications:** Status: Completed
*   **Manual Communication:** Status: Completed
*   **Bulk Messaging Workflow:** Status: Completed

### 2.6. Data-Driven Access Control Refactor

*   **Status:** Completed
*   **Goal:** Transition from hardcoded RBAC to a flexible, data-driven access control system where roles and permissions are configurable via the CMS.
*   **Key Steps:**
    *   Create a new `Roles` collection to define user roles and their associated permissions.
    *   Update the `Staff` collection's `role` field to be a relationship to the new `Roles` collection.
    *   Implement a generic, reusable access control function that queries permissions from the `Roles` collection.
    *   Apply this generic access function to all existing Payload collections.

### 2.7. System & Auditing Module (`06_system_and_auditing_module.md`)

*   **Status:** Completed
*   **Goal:** Implement a system-wide, read-only audit trail to log all significant create, update, and delete actions across all collections.
*   **Key Steps:**
    *   Created a new `AuditLogs` collection.
    *   Implemented a generic hook that is applied to all collections to automatically log changes.
    *   Ensured the log is non-editable by users.

## 3. External Services (In Progress)

### 3.1. M-Pesa Service
*   **Status:** Completed (Simulation Mode)
*   **Description:** A standalone Node.js/Express service has been built to handle all M-Pesa interactions. It currently runs in a simulation mode, allowing for full end-to-end testing of STK Push and C2B workflows without requiring live Daraja API credentials.

### 3.2. Push Notification Service
*   **Status:** Completed (Simulation Mode)
*   **Description:** A standalone service to handle sending push notifications to mobile devices (e.g., via Firebase Cloud Messaging).

## 4. Next Steps

With the entire backend application and the simulated M-Pesa and Push Notification services now complete and tested, the project is at a major milestone. The next logical phases are:

1.  **Frontend Development (Next.js):**
    *   Begin building the Next.js frontend application.
    *   This will consume the Payload CMS REST/GraphQL APIs for all data and user actions.
    *   Key features will include: Admin dashboards, subscriber management, ticket handling, and initiating payments.

2.  **Live Integration:**
    *   Once the external services are built and the frontend is ready, the final step is to switch the simulated services (M-Pesa, Notifications) to live mode by populating the `.env` files with real production credentials.

## 5. New & Planned Initiatives

### 5.1. Trial Period & Initial Billing Workflow
*   **Status:** Completed
*   **Specification:** `07_trial_and_initial_billing.md`
*   **Goal:** Implement a comprehensive trial period and initial billing system that handles upfront charges, trial notifications, and the transition to a recurring subscription.

### 5.2. Subscriber Data Integrity
*   **Status:** Completed
*   **Goal:** Prevent ISP Admins from editing a subscriber's core details after creation, while allowing the Super Admin to do so.
*   **Key Steps:**
    *   Applied field-level access control to `firstName`, `lastName`, `accountNumber`, `trialDays`, `upfrontCharges`, and `radiusUsername` fields in the `Subscribers` collection.
    *   The access control logic restricts updates to the super admin (`admin@example.com`).
