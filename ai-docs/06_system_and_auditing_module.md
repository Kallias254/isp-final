# Module Proposal: System & Auditing

## 1. Executive Summary

This document proposes the creation of a new, foundational **System & Auditing** module. Inspired by the comprehensive "Operations" log found in platforms like Splynx, this module will serve as the system's immutable "black box recorder." It will automatically capture a detailed audit trail of every significant action performed across the entire platform, whether by a human user or an automated process. This provides an essential layer of security, accountability, and traceability, which is critical for a complex operational system like an ISP.

## 2. Importance to the ISP-Final Project

The introduction of an auditing module is not merely a "nice-to-have"; it is a core requirement for building a robust, secure, and trustworthy management platform. Its importance can be broken down into three key areas:

*   **Security & Accountability:** In a multi-user environment managing critical customer and network data, it is vital to know who did what, and when. If a subscriber's plan is changed, an invoice is deleted, or a user's permissions are elevated, the audit log provides a clear, unchangeable record. This discourages unauthorized actions and provides definitive proof of activity, holding users accountable for their actions.

*   **Troubleshooting & Debugging:** When operational issues arise, the first question is always "What changed?". A customer might report an unexpected service disconnection. The audit log would allow support staff to trace the sequence of events: Was a payment marked as "missed"? Did a cron job automatically suspend the account? Was a manual change made by a staff member? This drastically reduces the time required to diagnose and resolve complex problems.

*   **Operational Transparency:** The module provides a holistic view of all system activities. This is invaluable for understanding how different automated components (e.g., billing cron jobs, M-Pesa callbacks, Zabbix webhooks) are interacting with the data. It helps ensure that automated processes are functioning as expected and provides a trail to inspect when they do not.

## 3. Role and Architectural Fit

The System & Auditing module is a **cross-cutting concern**, meaning it interfaces with and provides value to all other modules in the system (Core, CRM, Billing, Operations, etc.). It is not a siloed feature but a foundational service.

*   **Centralized, Read-Only Access:** It will be presented in the admin UI as a new, top-level "System" or "Auditing" section. For most users, access will be strictly **read-only**. This ensures the integrity of the log. High-level administrators may have rights to view the log, but no user will be able to edit or delete log entries through the standard UI.

*   **Programmatic Data Population:** The audit log is not populated by direct user input. Instead, it will be populated automatically by leveraging **Payload CMS's built-in hooks**. Specifically, `afterChange` and `afterDelete` hooks will be attached to every critical collection (Subscribers, Invoices, Payments, WorkOrders, etc.). When a document in one of these collections is created, updated, or deleted, the hook will fire and create a corresponding entry in the `auditLog`.

*   **"System" as a User:** For actions not tied to a specific logged-in user (e.g., automated billing runs, actions triggered by external webhooks), the log will attribute the action to a virtual **"System"** user, ensuring that no action is ever unrecorded.

## 4. Proposed Collection Schema

To implement this, a new `auditLog` collection will be created with the following structure. This collection will be configured to be non-editable from the admin panel.

| Field Name   | Type         | Notes                                                              |
| :----------- | :----------- | :----------------------------------------------------------------- |
| `timestamp`  | DateTime     | `required`, Indexed. The exact time the action occurred.           |
| `user`       | Relationship | `hasOne`, Links to `Staff` collection (or indicates "System").     |
| `action`     | Text         | `required`, e.g., "create", "update", "delete".                    |
| `collection` | Text         | `required`, The slug of the collection that was modified.          |
| `documentId` | Text         | `required`, The ID of the document that was created, updated, or deleted. |
| `before`     | JSON         | A snapshot of the document's data *before* the change (for updates/deletes). |
| `after`      | JSON         | A snapshot of the document's data *after* the change (for creates/updates). |

By capturing both `before` and `after` states, the system can provide a precise "diff" of what was changed, making the log exceptionally detailed and useful.
