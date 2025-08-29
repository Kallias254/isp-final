# ISP Management Platform: System Overview & Architecture

## 1. System Overview & Architecture

This document outlines the specifications for a modular monolith ISP Management Platform, designed to be built using Payload CMS. The architecture consolidates business domains into logical divisions within a single application to ensure scalability, security, and ease of management.

### 1.1. Architectural Model

The system follows a modular monolith architecture. The core modules are logical divisions within a single Payload CMS instance, where all data management is centralized. Relationships between these modules are handled directly within the database, leveraging Payload's built-in relationship capabilities.

### 1.2. Core Modules & Services

*   **Core & Company Module:** Manages foundational data shared across the system.
*   **CRM & Sales Module:** Manages the entire customer acquisition lifecycle.
*   **Billing & Finance Module:** Manages all business revenue, expenses, and subscriber billing.
*   **Operations & Network Management (NOC) Module:** Manages physical network assets, IP addresses, and monitoring.
*   **Support & Communications Module:** Manages customer support tickets and all communications.

### 1.3. Integrated Open-Source & External Services

*   **FreeRADIUS:** The network gatekeeper for subscriber Authentication, Authorization, and Accounting (AAA).
*   **Zabbix:** The 24/7 Network Monitoring System (NMS) for all network hardware.
*   **M-Pesa Service:** A dedicated microservice to handle all interactions with the Safaricom Daraja API.
*   **Notification Service:** A microservice for sending SMS/Email via gateways like Twilio or Africa's Talking.
*   **WhatsApp Parser Service:** A service to receive and process lead-generation messages from Partners.

## 2. User Roles & Permissions (RBAC)

Access is governed by a Role-Based Access Control (RBAC) model to enforce the principle of least privilege. This ensures that each user has access only to the tools and data necessary for their job, which enhances security and simplifies workflows. The structure is designed to scale from a single operator to a departmentalized organization.

| Role             | Primary Module(s)      | Key Permissions Summary                                                                                             |
| :--------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Admin**        | All                    | Full CRUD access to everything. Manages staff and system settings.                                                  |
| **Sales Agent**  | CRM & Sales            | CRUD on Partners, Buildings, Leads. Can convert a Lead to a Subscriber. Read-only on basic Subscriber info. No access to Finance or Network data. |
| **Billing Manager**| Billing & Finance      | CRUD on Invoices, Payments, Expenses. Can update financial fields on Subscribers. Read-only on non-financial Subscriber data. No access to Network or Sales data. |
| **Network Engineer**| Operations & NOC       | CRUD on Routers, Resources, IPAM. Can update technical fields on Subscribers. Read-only on non-technical Subscriber data. No access to Finance. |
| **Technician**   | Operations & NOC       | Read-only on WorkOrders where they are assigned. Can only update the status of their own Work Orders. No other system access. |
| **Support Agent**| Support & Comms        | CRUD on Tickets and Messages. Can send manual and bulk Messages. Read-only on Subscriber data needed for troubleshooting. Cannot see financial data. |
| **Partner**      | (External)             | No login access. Can only send formatted SMS/WhatsApp messages to generate Leads.                                   |
