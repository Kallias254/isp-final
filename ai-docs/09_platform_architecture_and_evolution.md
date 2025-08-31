# ISP Platform: Architecture & Evolution Guide

This document outlines the architectural principles and future evolution path for the ISP Management Platform, covering the transition to a multi-tenant SaaS and a microservices-based backend.

## Part 1: The Vision - A Tiered, Multi-Tenant SaaS Platform

The end-goal is a flexible, scalable platform that can be offered in tiered packages to various ISP clients. This requires two key architectural shifts: multi-tenancy and a modular, "pluggable" service model.

### 1.1. Multi-Tenant SaaS Architecture

The core idea is to introduce a new, higher level of administration (a "Super Admin") that sits above the individual "ISP Admins" (the tenants).

*   **Super Admin:** The platform owner, responsible for creating and managing ISP tenant accounts. Has administrative access to all data.
*   **ISP Admin (Tenant):** The customer, who can only see and manage their own company's data (subscribers, staff, etc.).

### 1.2. Tiered Service Model

The platform will be offered in distinct packages, allowing clients to choose the functionality they need.

*   **Tier 1: ISP Essentials:** Core subscriber and manual billing management.
*   **Tier 2: ISP Starter:** Adds CRM and sales tools for growth.
*   **Tier 3: ISP Professional:** Adds automation and integration (RADIUS, M-Pesa, Notifications).
*   **Tier 4: ISP Enterprise:** Adds the full Network Operations (NOC) module with Zabbix integration and inventory management.

## Part 2: How Payload CMS Enables This Vision

Payload CMS is architecturally well-suited to build this platform.

### 2.1. Achieving Multi-Tenancy

*   **Data Isolation (`tenantId`):** This is the most critical piece.
    *   **Access Control:** We will use global `access` functions on every collection to automatically filter all database queries based on the logged-in user's `tenantId`. This is a non-negotiable security layer enforced at the API level.
    *   **Hooks (`beforeChange`):** A `beforeChange` hook will automatically stamp every new document with the creator's `tenantId`, making data scoping seamless.
*   **The Super Admin Module:**
    *   **Flexible Collections:** We will create a new `isps` collection to manage tenants. This collection will contain an `enabledModules` group field with checkboxes, allowing the Super Admin to easily enable or disable features for each tenant.
    *   **Super Admin Bypass:** Payload's core design allows a designated super admin to bypass all access control rules, which is essential for platform administration and support.

### 2.2. Achieving the Tiered, Pluggable Model

*   **API-First Design:** Payload's comprehensive REST and GraphQL APIs allow the frontend to query a tenant's `enabledModules` and conditionally render the UI, ensuring clients only see the features they've paid for.
*   **Event-Driven Hooks (The "Event Bus"):** Payload's hooks act as a powerful event bus. For example, the billing module can fire an `invoice.created` event. In a "Professional" plan, a hook can listen for this event and trigger the `notification-service`. In an "Essentials" plan, the event fires but has no listener. This creates a perfectly decoupled and extensible system.

## Part 3: The Path from Monolith to Microservices

The current application is a "loosely coupled monolith," with the "fault lines" for future microservices already defined by the logical modules (Core, CRM, Billing, etc.).

### 3.1. The Transition Strategy

The evolution is a gradual, safe process, not a "big bang" rewrite.

1.  **API-Centric Communication:** The foundation is already laid. Modules within the monolith communicate via internal API calls (custom endpoints) and hooks, rather than direct function calls. They already act like separate services.
2.  **Service Extraction:** When the time comes to separate a module (e.g., CRM), the process is straightforward:
    *   A new, standalone microservice is created (e.g., a new Payload instance containing only the CRM collections).
    *   The main application is updated to point its API calls to the new external service's URL instead of the internal endpoint.
    *   The change is minimal because the API-driven communication pattern is already in place.
3.  **API Gateway:** As services are extracted, an API Gateway will be introduced to act as a single entry point, routing incoming requests to the appropriate microservice.

This API-first, modular approach, enabled by Payload CMS, provides a clear and robust path for scaling the platform's architecture as its business requirements evolve.
