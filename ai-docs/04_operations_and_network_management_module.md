# Operations & Network Management (NOC) Module

**Access Control Note:** Access to the collections and the ability to perform actions within the workflows described in this module are now managed through the Data-Driven Access Control (RBAC) system. Permissions are configured in the `Roles` collection, as detailed in `00_data_driven_rbac.md`.

The Story: This is the technical backbone of the ISP. It deals with the physical and logical assets that make the internet service work. This module tracks every piece of hardware from routers in stock to antennas on a roof (Resources), manages the finite pool of IP addresses (IPAM), and automates the technical provisioning of a customer's service on the network via FreeRADIUS. It also integrates with Zabbix to act as the company's early warning system for network problems.

## Collections:

### 1. subscribers (Technical View)

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| firstName | Text | read-only, Managed by Billing |
| lastName | Text | read-only, Managed by Billing |
| accountNumber| Text | read-only, Managed by Billing |
| contactPhone| Text | read-only, Managed by Billing |
| status | Select | read-only, Managed by Billing. Options: Pending Installation, Active, Suspended, Deactivated |
| servicePlan| Relationship| read-only, Managed by Billing |
| connectionType| Select | required, Options: PPPoE, IPoE/DHCP, Static IP, Hotspot |
| radiusUsername| Text | Auto-generated |
| radiusPassword| Text | Auto-generated, encrypted |
| assignedIp | Relationship| hasOne, Links to IpAddresses |
| macAddress | Text | |
| router | Relationship| hasOne, Links to Resources (where resourceType is Router) |

### 2. resources (Inventory)

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| resourceName| Text | required |
| resourceType| Select | required, Options: Router, Antenna, Switch, Cable |
| serialNumber| Text | unique |
| macAddress | Text | unique |
| status | Select | required, Options: In Stock, Deployed, Faulty, Retired |
| assignedTo | Relationship| hasOne, Polymorphic (can link to Subscribers or Buildings) |
| location | Relationship| hasOne, Links to Buildings |

### 3. ipSubnets (IPAM)

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| network | Text | required, unique, e.g., "10.30.20.0/24" |
| description| Text | required |

### 4. ipAddresses (IPAM)

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| ipAddress | Text | required, unique |
| subnet | Relationship| required, hasOne, Links to IpSubnets |
| status | Select | required, Options: Available, Assigned, Reserved |
| assignedTo | Relationship| hasOne, Links to Subscribers |

### 5. workOrders

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| orderType | Select | required, Options: New Installation, Repair, Site Survey |
| subscriber | Relationship| required, hasOne, Links to Subscribers |
| status | Select | required, Options: Pending, Scheduled, In Progress, Completed, Failed |
| assignedTo | Relationship| hasOne, Links to Staff (with role Technician) |
| notes | Rich Text | |

## Workflows:

### Subscriber Provisioning & RADIUS Integration:

1.  When a subscriber.created event is received, a WorkOrder for a New Installation is automatically created.
2.  When a Technician marks the WorkOrder as Completed, a hook fires.
3.  **IP Assignment Logic:**
    *   The hook checks the ipAssignmentType on the subscriber's servicePlan.
    *   If Static-Public, it queries the IpAddresses collection for an Available IP from the plan's linked staticIpPool. It then updates the IP's status to Assigned and links it to the subscriber. This atomic action guarantees uniqueness.
    *   If Dynamic, the IP is assigned by the router/RADIUS server dynamically.
4.  The hook sends an API call to the FreeRADIUS server to create the user with their radiusUsername, radiusPassword, assignedIp (if static), and servicePlan details.
5.  Finally, it changes the Subscriber status to Active.

### Subscriber Suspension: When a subscriber.suspended event is received, a hook sends an API call to FreeRADIUS to disconnect the user's session and disable their account.

### Automated Reconnection:
1.  When a `payment.received` event is received for a `Subscriber` whose status is `Suspended`.
2.  A hook checks if the payment covers the overdue amount.
3.  If covered, the hook sends an API call to FreeRADIUS to re-enable the user's account.
4.  It changes the `Subscriber` status to `Active`.
5.  It fires a `subscriber.reconnected` event for the Communications module.

### Monitoring & Alerting (Zabbix Integration):

1.  Zabbix is configured to monitor all network Resources.
2.  When Zabbix detects an issue (e.g., high latency on an antenna), it sends a webhook to a custom endpoint in this module.
3.  The endpoint automatically creates a high-priority Ticket in the Support module, pre-filled with details from the Zabbix alert.
