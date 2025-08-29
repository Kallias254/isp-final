ISP Management Platform: Complete System Specifications
1. System Overview & Architecture
This document outlines the specifications for a modular, microservices-based ISP Management Platform, designed to be built using Payload CMS. The architecture separates business domains into distinct services to ensure scalability, security, and ease of management.

1.1. Architectural Model
The system follows a "Hub and Spoke" microservices model. The core modules are built as independent Payload CMS instances, which act as the central hub for data management. These core modules communicate with each other via APIs and events, and they command smaller, specialized "spoke" services for specific tasks like payments and notifications.

1.2. Core Modules & Services
Core & Company Module: Manages foundational data shared across the system.

CRM & Sales Module: Manages the entire customer acquisition lifecycle.

Billing & Finance Module: Manages all business revenue, expenses, and subscriber billing.

Operations & Network Management (NOC) Module: Manages physical network assets, IP addresses, and monitoring.

Support & Communications Module: Manages customer support tickets and all communications.

1.3. Integrated Open-Source & External Services
FreeRADIUS: The network gatekeeper for subscriber Authentication, Authorization, and Accounting (AAA).

Zabbix: The 24/7 Network Monitoring System (NMS) for all network hardware.

M-Pesa Service: A dedicated microservice to handle all interactions with the Safaricom Daraja API.

Notification Service: A microservice for sending SMS/Email via gateways like Twilio or Africa's Talking.

WhatsApp Parser Service: A service to receive and process lead-generation messages from Partners.

2. User Roles & Permissions (RBAC)
Access is governed by a Role-Based Access Control (RBAC) model to enforce the principle of least privilege. This ensures that each user has access only to the tools and data necessary for their job, which enhances security and simplifies workflows. The structure is designed to scale from a single operator to a departmentalized organization.

Role

Primary Module(s)

Key Permissions Summary

Admin

All

Full CRUD access to everything. Manages staff and system settings.

Sales Agent

CRM & Sales

CRUD on Partners, Buildings, Leads. Can convert a Lead to a Subscriber. Read-only on basic Subscriber info. No access to Finance or Network data.

Billing Manager

Billing & Finance

CRUD on Invoices, Payments, Expenses. Can update financial fields on Subscribers. Read-only on non-financial Subscriber data. No access to Network or Sales data.

Network Engineer

Operations & NOC

CRUD on Routers, Resources, IPAM. Can update technical fields on Subscribers. Read-only on non-technical Subscriber data. No access to Finance.

Technician

Operations & NOC

Read-only on WorkOrders where they are assigned. Can only update the status of their own Work Orders. No other system access.

Support Agent

Support & Comms

CRUD on Tickets and Messages. Can send manual and bulk Messages. Read-only on Subscriber data needed for troubleshooting. Cannot see financial data.

Partner

(External)

No login access. Can only send formatted SMS/WhatsApp messages to generate Leads.

3. Module Specifications
3.1. Core & Company Module
The Story: This is the foundational layer of the entire system. It holds the essential, shared data that all other modules depend on to function. Think of it as the company's central directory. It defines who works for the company (Staff), what the company sells (Plans), and who the company partners with to generate growth (Partners). Without this core data, no other module can operate.

Collections:
1. staff
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| fullName | Text | required |
| email | Email | required, unique, Used for login |
| password | Password | required |
| role | Select | required, Options: Admin, Sales Agent, etc. |
| status | Select | required, defaultValue: Active, Options: Active, Inactive |
| phoneNumber| Text | |

2. plans (Service Plans)
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| name | Text | required, e.g., "Home Basic 10Mbps" |
| downloadSpeed| Number | required, in Mbps |
| uploadSpeed | Number | required, in Mbps |
| price | Number | required, in KES |
| billingCycle| Select | required, Options: Monthly, Quarterly |
| notes | Text | |
| planEnabled| Checkbox | defaultValue: true, Overall on/off switch for the plan. |
| activeForNewSignups| Checkbox | defaultValue: true, If unchecked, existing users remain but no new signups allowed. |
| ipAssignmentType| Select | required, defaultValue: Dynamic, Options: Dynamic, Static-Public |
| staticIpPool| Relationship| hasOne, Links to ipSubnets. Conditionally required if ipAssignmentType is Static-Public. |

3. partners (House Managers)
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| fullName | Text | required |
| phoneNumber| Text | required, unique, Used to identify incoming leads |
| mpesaNumber| Text | required, For commission payments |
| status | Select | required, Options: Prospect, Active, Inactive |
| buildings | Relationship| hasMany, Links to the Buildings collection |
| commissionRate| Number | defaultValue: 1500 |
| referralCount| Number | defaultValue: 0, Incremented by a hook on lead conversion |
| perks | Checkbox | e.g., Free Personal Internet |

3.2. CRM & Sales Module
The Story: This module is the engine of the ISP's growth. It covers the entire customer acquisition journey, from a sales agent identifying a new apartment building ("building hunting") to nurturing a potential customer ("lead") and finally converting them into a subscriber ready for installation. Its primary goal is to manage the sales pipeline and provide clear data on acquisition channels, such as the crucial "ISP Property Partner" program.

Collections:
1. buildings
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| name | Text | required, e.g., "Mombasa Trade Center" |
| address | Text | required |
| status | Select | required, Options: Prospecting, Negotiating, Active, Lost |
| partner | Relationship| hasOne, Links to the Partners collection (the caretaker) |
| location | Geolocation | |
| equipment | Relationship| read-only, View of Resources assigned to this building in the NOC module. |

2. buildingUnits
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| unitNumber | Text | required, e.g., "Apt 3B" |
| building | Relationship| required, hasOne, Links to Buildings |
| status | Select | required, Options: Vacant, Occupied, Lead, Subscriber |
| currentProvider| Text | optional, e.g., "Safaricom Home Fibre" |
| competitorPaymentDate| Date | optional, Used for sales follow-up timing |
| currentIssues| Text Area | optional, Notes on current internet problems from prospect |

3. leads
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| status | Select | required, Options: New, Contacted, Site Survey, Converted, Lost |
| leadSource | Select | required, Options: Partner Referral, Website, Direct Call |
| referredBy | Relationship| hasOne, Links to Partners. Required if leadSource is Partner Referral |
| subscriberName| Text | required |
| subscriberPhone| Text | required |
| serviceLocation| Relationship| required, hasOne, Links to BuildingUnits |
| notes | Rich Text | |

Workflows:
Lead Creation via WhatsApp/SMS:

The external WhatsApp Parser service receives a message.

It validates the sender's phone number against the Partners collection.

If valid, it parses the message and uses the Payload API to create a new Lead, linking it to the correct Partner.

Lead Conversion:

A Sales Agent changes a Lead's status to Converted.

A Payload afterChange hook triggers.

The hook creates a new Subscriber record in the Billing module.

It sets the new subscriber's status to Pending Installation.

It publishes a subscriber.created event for other modules to consume.

If the lead was from a partner, it increments the referralCount on the Partner's record.

3.3. Billing & Finance Module
The Story: This is the financial heart of the ISP. It manages the company's cash flow, from generating recurring invoices for subscribers to tracking payments and managing business expenses. This module ensures that every active customer is billed correctly and on time, and it provides the tools to handle financial realities like grace periods, trial offers, and automated suspensions for non-payment. Its accuracy is critical for the business's profitability and health.

Collections:
1. subscribers
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| firstName | Text | required |
| lastName | Text | required |
| accountNumber| Text | required, unique, Auto-generated |
| mpesaNumber | Text | required, For STK Push & billing notifications |
| contactPhone | Text | optional, For general communication |
| email | Email | optional, For portal login & notifications |
| status | Select | required, Options: Pending Installation, Active, Suspended, Deactivated |
| servicePlan| Relationship| required, hasOne, Links to Plans |
| billingCycle| Select | required, Options: Monthly, Quarterly |
| nextDueDate| Date | required, Set on activation and after each payment |
| accountBalance| Number | defaultValue: 0 |
| gracePeriodEndDate | Date | optional, Manually set to override automated suspension. |
| trialEndDate | Date | optional, If set, billing starts after this date. |
| addressNotes | Text Area | optional, For technician directions, e.g., "Use the back gate" |
| internalNotes| Rich Text | optional, For staff-only notes about the subscriber |
| connectionType| Select | read-only, Managed by Ops. Options: PPPoE, IPoE/DHCP, Static IP, Hotspot |
| assignedIp | Text | read-only, Managed by Ops |

2. invoices
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| invoiceNumber| Text | required, unique, Auto-generated |
| subscriber | Relationship| required, hasOne, Links to Subscribers |
| amountDue | Number | required, Auto-calculated from line items |
| dueDate | Date | required |
| status | Select | required, Options: Draft, Unpaid, Paid, Overdue, Cancelled |
| lineItems | Array | required, Fields: description (Text), quantity (Number), price (Number) |

3. payments
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| paymentReference| Text | required, e.g., Mpesa transaction ID |
| invoice | Relationship| required, hasOne, Links to Invoices |
| amountPaid | Number | required |
| paymentMethod| Select | required, Options: Mpesa, Bank Transfer, Cash |
| paymentDate| Date | required |

4. expenses
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| expenseDate| Date | required |
| category | Select | required, Options: Bandwidth, Salaries, Rent, etc. |
| vendor | Text | |
| amount | Number | required |
| description| Text Area | |
| receipt | File Upload| |

Workflows:
Initial Invoice Generation: When a Subscriber is created, the system also creates their first Invoice. The form must allow the Sales Agent to add one-off charges (e.g., Installation Fee, Router Purchase) which are added as lineItems alongside the recurring plan fee.

Automated Billing Cycle: A scheduled job (CRON) runs daily:

It finds all Subscribers whose nextDueDate is today and are not on an active trial.

For each, it generates a new Invoice based on their servicePlan.

It fires an invoice.created event for the Communications module.

Payment Reconciliation (Mpesa):

The Mpesa service receives a payment confirmation callback.

It creates a Payment record.

It updates the related Invoice status to Paid.

It updates the Subscriber's nextDueDate and accountBalance.

Automated Suspension: The daily CRON job checks for overdue Invoices. For each overdue subscriber, it performs the following check:

Grace Period Check: It first checks if the subscriber has a gracePeriodEndDate set and if that date is in the future.

Decision:

If a valid grace period exists, the system skips suspension for this user.

If no grace period exists (or the date has passed), it changes the Subscriber's status to Suspended and fires a subscriber.suspended event for the Operations module.

3.4. Operations & Network Management (NOC) Module
The Story: This is the technical backbone of the ISP. It deals with the physical and logical assets that make the internet service work. This module tracks every piece of hardware from routers in stock to antennas on a roof (Resources), manages the finite pool of IP addresses (IPAM), and automates the technical provisioning of a customer's service on the network via FreeRADIUS. It also integrates with Zabbix to act as the company's early warning system for network problems.

Collections:
1. subscribers (Technical View)
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

2. resources (Inventory)
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| resourceName| Text | required |
| resourceType| Select | required, Options: Router, Antenna, Switch, Cable |
| serialNumber| Text | unique |
| macAddress | Text | unique |
| status | Select | required, Options: In Stock, Deployed, Faulty, Retired |
| assignedTo | Relationship| hasOne, Polymorphic (can link to Subscribers or Buildings) |
| location | Relationship| hasOne, Links to Buildings |

3. ipSubnets (IPAM)
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| network | Text | required, unique, e.g., "10.30.20.0/24" |
| description| Text | required |

4. ipAddresses (IPAM)
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| ipAddress | Text | required, unique |
| subnet | Relationship| required, hasOne, Links to IpSubnets |
| status | Select | required, Options: Available, Assigned, Reserved |
| assignedTo | Relationship| hasOne, Links to Subscribers |

5. workOrders
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| orderType | Select | required, Options: New Installation, Repair, Site Survey |
| subscriber | Relationship| required, hasOne, Links to Subscribers |
| status | Select | required, Options: Pending, Scheduled, In Progress, Completed, Failed |
| assignedTo | Relationship| hasOne, Links to Staff (with role Technician) |
| notes | Rich Text | |

Workflows:
Subscriber Provisioning & RADIUS Integration:

When a subscriber.created event is received, a WorkOrder for a New Installation is automatically created.

When a Technician marks the WorkOrder as Completed, a hook fires.

IP Assignment Logic:

The hook checks the ipAssignmentType on the subscriber's servicePlan.

If Static-Public, it queries the IpAddresses collection for an Available IP from the plan's linked staticIpPool. It then updates the IP's status to Assigned and links it to the subscriber. This atomic action guarantees uniqueness.

If Dynamic, the IP is assigned by the router/RADIUS server dynamically.

The hook sends an API call to the FreeRADIUS server to create the user with their radiusUsername, radiusPassword, assignedIp (if static), and servicePlan details.

Finally, it changes the Subscriber status to Active.

Subscriber Suspension: When a subscriber.suspended event is received, a hook sends an API call to FreeRADIUS to disconnect the user's session and disable their account.

Monitoring & Alerting (Zabbix Integration):

Zabbix is configured to monitor all network Resources.

When Zabbix detects an issue (e.g., high latency on an antenna), it sends a webhook to a custom endpoint in this module.

The endpoint automatically creates a high-priority Ticket in the Support module, pre-filled with details from the Zabbix alert.

3.5. Support & Communications Module
The Story: This module is the voice of the company. It handles all direct interactions with customers, both reactive and proactive. It manages reactive problem-solving through the Tickets system, ensuring no customer issue is lost. It also manages proactive outreach, from automated invoice reminders to critical, filtered bulk SMS alerts about network outages. This module's goal is to ensure communication is clear, timely, and fully logged.

Collections:
1. tickets
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| ticketID | Text | required, unique, Auto-generated |
| subscriber | Relationship| required, hasOne, Links to Subscribers |
| subject | Text | required |
| description| Rich Text | required |
| status | Select | required, Options: Open, In Progress, Resolved, Closed |
| priority | Select | required, Options: Low, Medium, High |
| assignedTo | Relationship| hasOne, Links to Staff (with role Support Agent) |

2. messages (Communication Log)
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| recipient | Text | required, Phone number or email address |
| type | Select | required, Options: SMS, Email |
| content | Text Area | required |
| status | Select | required, Options: Sent, Failed |
| triggerEvent| Text | e.g., "invoice.created", "manual.reply", "bulk.outage" |
| sentBy | Relationship| hasOne, Links to Staff (for manual messages) |
| bulkSend | Boolean | defaultValue: false, Indicates if it was part of a bulk message |

3. contacts (For Unregistered Recipients)
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| phoneNumber| Text | required, unique |
| fullName | Text | optional |
| source | Text | optional, e.g., "Marketing List" |

4. messageTemplates
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| templateName| Text | required, unique, e.g., "Outage Notice" |
| content | Text Area | required, Can use variables like {{firstName}} |

Workflows:
Automated Notifications: This module listens for events from all other modules (invoice.created, payment.received, ticket.updated, etc.). When an event is received, it calls the external Notification Service to send the appropriate SMS/Email and logs the action in the Messages collection.

Manual Communication: A Support Agent viewing a Ticket can use a "Send Message" feature. This allows them to send a manual SMS/Email to the customer, which is also logged in the Messages collection with triggerEvent: "manual.reply".

Bulk Messaging Workflow:

A Support Agent or Admin navigates to the "Compose Message" screen.

Audience Selection: They choose to send to "Registered Users" (Subscribers) or "Unregistered" (Contacts).

Filtering (for Subscribers): If sending to subscribers, they can apply filters:

By Plan: Select one or more Plans.

By Router: Select one or more Routers.

By Service Location: Select one or more Buildings.
The system queries the Subscribers collection to build a recipient list based on these filters. If no filters are applied, it targets all subscribers.

Composition: They can either select a messageTemplate (which populates the message box) or write a custom message.

Send: Upon sending, the system iterates through the final recipient list (either filtered subscribers or selected contacts) and calls the Notification Service for each one. A single, parent Message log is created with bulkSend: true, potentially linking to individual send statuses.


------------


