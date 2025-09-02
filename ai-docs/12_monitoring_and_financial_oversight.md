# 12. ISP Network Monitoring & Financial Oversight Plan

## 1. Executive Summary

**The Vision:** To create a proactive, intelligent, and deeply integrated operations center within the ISP Admin Dashboard. This system will act as a "single pane of glass," providing admins with the critical, actionable information they need to manage both network health and core operational expenses.

**The Architecture:** We will use **LibreNMS** as the powerful, 24/7 monitoring engine. Our Payload CMS will serve as the central control plane and single source of truth for all network devices, IP addresses, and their associated costs. Our Next.js frontend will be the beautiful and intuitive user interface, presenting a curated "driver's dashboard" view of the ISP's operational health.

## 2. Guiding Principles

*   **CMS as the Single Source of Truth:** All network hardware and its financial data will be registered and categorized within our Payload CMS.
*   **Engineered for Action, Not Just Data:** The UI will prioritize information that leads to a decision, whether it's a network outage or a budget overview.
*   **Seamless Workflow Integration:** Monitoring and financial data will be embedded intelligently where it's most relevant—on a network map, a subscriber's detail page, and within a simplified expense tracking module.

## 3. Data Model: Extending Our Collections

To support this system, we will introduce a new collection for hardware (`NetworkDevices`), significantly enhance our `Expenses` collection, and add a new `CrisisEvents` collection for intelligent outage management.

### Collection: NetworkDevices (Replaces Resources)

This is the master inventory of all physical hardware, now with financial tracking and a more precise topology.

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| deviceName | Text | e.g., "Kenyatta Ave AP 1" |
| ipAddress | Relationship | Links to `IpAddresses`. The device's management IP. |
| deviceType | Select | **Refined List:** `Core Router`, `Switch`, `Access Point (AP)`, `Station (Building Receiver)`, `Customer Premise Equipment (CPE)` |
| purchaseDate | Date | The date the asset was acquired. |
| purchaseCost | Number | The cost of the hardware, for Capital Expenditure (CAPEX) tracking. |
| monitoringType | Select | `ICMP Only`, `ICMP + SNMP` |
| snmpCommunity | Encrypted Text | Required for SNMP monitoring. |
| physicalLocation| Relationship | Links to a `ServiceLocation`. |
| parentDevice | Relationship | Defines network topology (e.g., a CPE's parent is a Station). |
| ispOwner | Relationship | Links to the `Company` collection for multi-tenancy. |

### Enhanced Collection: Expenses

This collection is expanded to provide simple, powerful financial oversight.

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| expenseDate | Date | |
| expenseType | Select | `Capital Expenditure (CAPEX)`, `Operational Expenditure (OPEX)` |
| category | Select | **Dynamic based on expenseType.** If OPEX: `Salaries`, `Bandwidth`, `Rent`, `Utilities`, `Marketing`, `Other`. If CAPEX: `Network Hardware`, `Vehicles`, `Tools`, `Other`. |
| description | Text Area | |
| amount | Number | |
| relatedAsset | Relationship | **Polymorphic.** Can link to `NetworkDevice` (for hardware CAPEX) or `Staff` (for salary OPEX). |
| status | Select | `Uncategorized`, `Approved` |
| ispOwner | Relationship | Enforces multi-tenancy. |

### New Collection: CrisisEvents

This collection tracks major network outages as a single, manageable event.

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| rootCauseDevice | Relationship | Links to the `NetworkDevice` that triggered the event. |
| affectedSubscribers | Relationship | `hasMany`. Links to all `Subscribers` impacted by the outage. |
| status | Select | `Ongoing`, `Resolved` |
| description | Text Area | Auto-generated summary of the impact. |
| startTime | Date | |
| endTime | Date | |

### Updates to Existing Collections

*   **Subscribers:** A new `cpeDevice` (Relationship) field will link a subscriber directly to their installed `NetworkDevice` (where `deviceType` is `CPE`).
*   **IpAddresses:** The `assignedTo` relationship is replaced by `assignedDevice` (Relationship) to link an IP address to a specific `NetworkDevice`.

## 4. Workflows & Automation

### Automated Financial Tracking

1.  When an admin creates a new `NetworkDevice`, they fill in the `purchaseDate` and `purchaseCost`.
2.  On save, a Payload `afterChange` hook fires.
3.  The hook automatically creates a new `Expense` record with:
    *   `expenseType`: `CAPEX`
    *   `category`: `Network Hardware`
    *   `amount`: Copied from the device's `purchaseCost`.
    *   `relatedAsset`: A polymorphic link to the newly created `NetworkDevice`.
    *   `status`: `Approved`.

### Emergency Workflow: Alert -> Triage -> Escalate

This refined workflow ensures that automated alerts are handled safely and professionally, preventing false alarms and empowering human operators to make informed decisions.

1.  **Automated Alert -> Automated High-Priority Ticket:**
    *   LibreNMS detects a confirmed outage (after a configured delay to avoid false positives).
    *   The webhook triggers our backend to create a new **Ticket** in the Support module.
    *   This ticket is automatically flagged as "High Priority" and its subject is pre-filled: "Network Alert: Device 'Kenyatta-Tower-AP1' is Offline."
    *   The body of the ticket contains all the automated "blast radius" information: the list of affected subscribers and a link to the `CrisisEvent` page.

2.  **Human Triage -> Manual Escalation:**
    *   A support agent or NOC operator sees this new, high-priority ticket. Their first job is to triage it.
    *   They can quickly look at the crisis page, check for other related alerts, and confirm it's a real issue that needs a technician.
    *   On the ticket page, there will be a clear button: **"Escalate to Work Order."**

3.  **Informed Decision -> Technician Dispatch:**
    *   Only when a human has verified the issue do they click that button.
    *   This action then creates a new `WorkOrder`, automatically copying over all the relevant details from the ticket.

This process puts a human decision-maker in the loop at the most critical moment. It empowers the ISP admin with incredible automated diagnostics while ensuring they retain full control over dispatching their valuable field technicians.

## 5. Technical Integration: LibreNMS as a Headless Service

The architecture is designed to be lean and secure, with the Payload monolith acting as the central gateway.

*   **API Abstraction:** The Next.js frontend only ever communicates with our Payload backend. It requests simple, business-focused data (e.g., `GET /api/subscribers/:id/connection-status`).
*   **Secure, Server-to-Server Communication:** A dedicated `MonitoringService` within the backend is the sole intermediary to LibreNMS. It securely queries the LibreNMS API in the background, filters data for the correct tenant (`ispOwner`), and merges it with financial data from the local database, and sends a clean, unified response to the frontend.
*   **No Direct User Access:** The ISP Admin **never** needs to access or even know about the LibreNMS frontend. It is purely a data collection engine. Our platform provides the user-friendly, business-focused interface.

## 6. The User Experience: Integrated Operations and Finance

*Note: The components described in this section are frontend (Next.js) UI/UX elements and have not yet been implemented. This document outlines their intended functionality and appearance.*

### A. The NOC Sidebar

The sidebar under "Network Operations" (NOC) will be reorganized for clarity:

*   **Network Map:** The primary visual monitoring tool.
*   **Device Inventory:** The list of all `NetworkDevices`.
*   **IPAM:** Management of IP subnets and addresses.
*   **Work Orders:** For technician dispatch and task management.

### B. The Subscriber "Driver's Dashboard"

When viewing a subscriber's detail page, a new tab "Connection Status" will display the four most critical, real-time metrics for that customer's specific `CPE`:

1.  **Status:** Online / Offline
2.  **Latency / Packet Loss:** A simple sparkline graph for the last 24 hours.
3.  **Live Throughput:** A gauge showing current download/upload speed.
4.  **Signal Quality (SNR):** The current signal strength of their wireless connection.
