# Billing & Finance Module

**Access Control Note:** Access to the collections and the ability to perform actions within the workflows described in this module are now managed through the Data-Driven Access Control (RBAC) system. Permissions are configured in the `Roles` collection, as detailed in `00_data_driven_rbac.md`.

The Story: This is the financial heart of the ISP. It manages the company's cash flow, from generating recurring invoices for subscribers to tracking payments and managing business expenses. This module ensures that every active customer is billed correctly and on time, and it provides the tools to handle financial realities like grace periods, trial offers, and automated suspensions for non-payment. Its accuracy is critical for the business's profitability and health.

## Collections:

### 1. subscribers

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

### 2. invoices

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| invoiceNumber| Text | required, unique, Auto-generated |
| subscriber | Relationship| required, hasOne, Links to Subscribers |
| amountDue | Number | required, Auto-calculated from line items |
| dueDate | Date | required |
| status | Select | required, Options: Draft, Unpaid, Paid, Overdue, Cancelled |
| lineItems | Array | required, Fields: description (Text), quantity (Number), price (Number) |

### 3. payments

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| paymentReference| Text | required, e.g., Mpesa transaction ID |
| invoice | Relationship| required, hasOne, Links to Invoices |
| amountPaid | Number | required |
| paymentMethod| Select | required, Options: Mpesa, Bank Transfer, Cash |
| paymentDate| Date | required |

### 4. expenses

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| expenseDate| Date | required |
| category | Select | required, Options: Bandwidth, Salaries, Rent, etc. |
| vendor | Text | |
| amount | Number | required |
| description| Text Area | |
| receipt | File Upload| |

## Workflows:

### Initial Invoice Generation: When a Subscriber is created, the system also creates their first Invoice. The form must allow the Sales Agent to add one-off charges (e.g., Installation Fee, Router Purchase) which are added as lineItems alongside the recurring plan fee.

### Automated Billing Cycle: A scheduled job (CRON) runs daily:

1.  It finds all Subscribers whose nextDueDate is today and are not on an active trial.
2.  For each, it generates a new Invoice based on their servicePlan.
3.  It fires an invoice.created event for the Communications module.

### Payment Reconciliation (Mpesa):

1.  The Mpesa service receives a payment confirmation callback.
2.  It creates a Payment record.
3.  It updates the related Invoice status to Paid.
4.  It updates the Subscriber's nextDueDate and accountBalance.

### Automated Suspension: The daily CRON job checks for overdue Invoices. For each overdue subscriber, it performs the following check:

*   **Grace Period Check:** It first checks if the subscriber has a gracePeriodEndDate set and if that date is in the future.
*   **Decision:**
    *   If a valid grace period exists, the system skips suspension for this user.
    *   If no grace period exists (or the date has passed), it changes the Subscriber's status to Suspended and fires a subscriber.suspended event for the Operations module.
