# Streamlined ISP Onboarding for FreeRADIUS (Superadmin Workflow)

## Core Philosophy: Simplicity, Speed, and Professionalism
This document outlines a new, hyper-streamlined onboarding process designed for a FreeRADIUS-powered ISP management platform. It embraces the "Flexible Onboarding & Laddered Value" philosophy, allowing a new ISP to get their core services online in minutes. The process is condensed into three essential stages, focusing only on what is absolutely necessary to begin authenticating subscribers.

## The New 3-Step Onboarding Wizard
When a new ISP Admin (Superadmin role) logs in for the first time, they are guided through this simple, three-step setup.

### Step 1: Define Your Services & IP Pools

**Purpose:** To define the products you sell to customers and the IP addresses they will use. This combines the "IPAM" and "Service Plans" steps into one logical action.

**UI / Action (Superadmin Dashboard):
** A clean interface to "Create a New Service Plan." For each plan, the admin fills out:
*   **Plan Name:** e.g., "Residential 50Mbps"
*   **Price & Billing Cycle:** e.g., "3000 KES per month"
*   **Speed Limit:** e.g., 50M Down / 50M Up
*   **IP Assignment Type:** A simple dropdown menu with two choices:
    *   **Dynamic Pool (for PPPoE):** Admin defines the IP range for this pool (e.g., 192.168.10.1 - 192.168.10.254).
    *   **Static Pool (for IPoE/MAC Locking):** Admin defines the IP range for static assignments.

**Backend Mapping (Payload CMS & FreeRADIUS Logic):
**
*   **Payload CMS (`src/collections/Plans.ts`):
**
    *   Update `Plans` collection to include fields for `ipAssignmentType` (enum: `dynamic`, `static`), `dynamicIpPoolStart`, `dynamicIpPoolEnd`, `staticIpPoolStart`, `staticIpPoolEnd`.
*   **FreeRADIUS Logic (via Payload Hooks):
**
    *   **`radgroupreply` table:** A `beforeChange` or `afterChange` hook on the `Plans` collection will populate `radgroupreply` with the speed limit attributes (e.g., `MikroTik-Rate-Limit`).
    *   **`radippool` table:** The same hook will interact with the FreeRADIUS database to populate the `radippool` table with the defined IP ranges, associating them with the plan name. This will require a new utility function or service to manage FreeRADIUS database interactions.

**A Note on IPAM: Integrating Your System with FreeRADIUS
**
*   **Recommended Architecture ("Best of Both Worlds"):** We will implement a "division of labor" approach.
    *   **Your Payload IPAM (The Master Planner):** The user-friendly UI will be the single source of truth for defining *all* IP pools, including those for network devices. For *subscriber* IP pools, when an admin creates a "Dynamic PPPoE Pool" or "Static Pool" in Step 1, your application writes that IP range and its associated plan/group name to the `radippool` table in the FreeRADIUS database. Your IPAM is used for comprehensive management, visualization, and strategic planning.
    *   **FreeRADIUS IPAM (The High-Speed Field Agent):** FreeRADIUS's `rlm_sqlippool` module will be configured to read directly from the `radippool` table during live authentication. It will find the correct pool for the user's plan, select the next available IP, lease it, and record the lease. This handles all real-time, high-transaction work automatically for *subscriber* IP assignments.

### Step 2: Connect Your Network Hardware (NAS)

**Purpose:** To establish a secure, trusted connection between your network hardware (routers, access points) and the FreeRADIUS server.

**UI / Action (Superadmin Dashboard):
** A form to "Add a New NAS (Network Access Server)." The admin enters:
*   **NAS Name:** e.g., "Mombasa-Gateway-Router"
*   **Public IP of the NAS:** The IP address from which RADIUS requests will come.
*   **Generate a Shared Secret:** A button to create a strong, random password.

After saving, the system will present the admin with the exact, simple configuration needed for their hardware (e.g., MikroTik configuration snippet).

**Backend Mapping (Payload CMS & FreeRADIUS Logic):
**
*   **Payload CMS (`src/collections/NetworkDevices.ts`):
**
    *   Update or create a `NetworkDevices` collection with fields for `name`, `ipAddress`, and `sharedSecret`.
*   **FreeRADIUS Logic (via Payload Hooks):
**
    *   **`nas` table:** A hook on the `NetworkDevices` collection will interact with the FreeRADIUS database to create an entry in the `nas` table. This is FreeRADIUS's address book, ensuring requests from unknown IPs or with incorrect secrets are ignored.

### Step 3: Add Your First Subscribers

**Purpose:** To add your initial customers to the system and confirm everything is working end-to-end.

**UI / Action (Superadmin Dashboard):
** A simple "Add New Subscriber" form.
*   **Subscriber Name & Contact:** e.g., "John Doe", "0712345678"
*   **Select Service Plan:** A dropdown of the plans created in Step 1.
*   **Define Connection Type:** A choice between:
    *   **PPPoE:** The system auto-generates a secure username and password.
    *   **IPoE (Static IP):** The system prompts for the customer's MAC Address.

**Backend Mapping (Payload CMS & FreeRADIUS Logic):
**
*   **Payload CMS (`src/collections/Subscribers.ts`):
**
    *   Update `Subscribers` collection to include `connectionType` (enum: `pppoe`, `ipoe`), `macAddress`, `username`, and `password`.
*   **FreeRADIUS Logic (via Payload Hooks):
**
    *   **`radcheck` table:** A hook on the `Subscribers` collection will populate `radcheck` with the user's credentials (e.g., `Cleartext-Password` for PPPoE or `Calling-Station-Id` for IPoE's MAC address).
    *   **`radusergroup` table:** The same hook will add the user to their chosen service plan in the `radusergroup` table.

### Post-Onboarding: Ready to Scale
After completing these three simple steps, the ISP is fully operational. Their core system is configured, secure, and ready to serve customers. The main dashboard will then provide access to more advanced features, including the Bulk Subscriber Import tool, detailed logging, and billing management (like M-Pesa integration), perfectly aligning with the "Laddered Value" philosophy.
