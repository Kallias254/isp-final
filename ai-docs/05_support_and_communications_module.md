# Support & Communications Module

**Access Control Note:** Access to the collections and the ability to perform actions within the workflows described in this module are now managed through the Data-Driven Access Control (RBAC) system. Permissions are configured in the `Roles` collection, as detailed in `00_data_driven_rbac.md`.

The Story: This module is the voice of the company. It handles all direct interactions with customers, both reactive and proactive. It manages reactive problem-solving through the Tickets system, ensuring no customer issue is lost. It also manages proactive outreach, from automated invoice reminders to critical, filtered bulk SMS alerts about network outages. This module's goal is to ensure communication is clear, timely, and fully logged.

## Collections:

### 1. tickets

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| ticketID | Text | required, unique, Auto-generated |
| subscriber | Relationship| required, hasOne, Links to Subscribers |
| subject | Text | required |
| description| Rich Text | required |
| status | Select | required, Options: Open, In Progress, Resolved, Closed |
| priority | Select | required, Options: Low, Medium, High |
| assignedTo | Relationship| hasOne, Links to Staff (with role Support Agent) |

### 2. messages (Communication Log)

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| recipient | Text | required, Phone number or email address |
| type | Select | required, Options: SMS, Email |
| content | Text Area | required |
| status | Select | required, Options: Sent, Failed |
| triggerEvent| Text | e.g., "invoice.created", "manual.reply", "bulk.outage" |
| sentBy | Relationship| hasOne, Links to Staff (for manual messages) |
| bulkSend | Boolean | defaultValue: false, Indicates if it was part of a bulk message |

### 3. contacts (For Unregistered Recipients)

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| phoneNumber| Text | required, unique |
| fullName | Text | optional |
| source | Text | optional, e.g., "Marketing List" |

### 4. messageTemplates

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| templateName| Text | required, unique, e.g., "Outage Notice" |
| content | Text Area | required, Can use variables like {{firstName}} |

## Workflows:

### Automated Notifications: This module listens for events from all other modules (invoice.created, payment.received, ticket.updated, etc.). When an event is received, it calls the external Notification Service to send the appropriate SMS/Email and logs the action in the Messages collection.

### Manual Communication: A Support Agent viewing a Ticket can use a "Send Message" feature. This allows them to send a manual SMS/Email to the customer, which is also logged in the Messages collection with triggerEvent: "manual.reply".

### Bulk Messaging Workflow:

1.  A Support Agent or Admin navigates to the "Compose Message" screen.
2.  **Audience Selection:** They choose to send to "Registered Users" (Subscribers) or "Unregistered" (Contacts).
3.  **Filtering (for Subscribers):** If sending to subscribers, they can apply filters:
    *   By Plan: Select one or more Plans.
    *   By Router: Select one or more Routers.
    *   By Service Location: Select one or more Buildings.
    The system queries the Subscribers collection to build a recipient list based on these filters. If no filters are applied, it targets all subscribers.
4.  **Composition:** They can either select a messageTemplate (which populates the message box) or write a custom message.
5.  **Send:** Upon sending, the system iterates through the final recipient list (either filtered subscribers or selected contacts) and calls the Notification Service for each one. A single, parent Message log is created with bulkSend: true, potentially linking to individual send statuses.
