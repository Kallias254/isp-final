# Specification: Subscriber Creation & Billing Lifecycle

## 1. Core Principle: Two Workflows, One Logic

The system must support two primary methods for creating a new subscriber:

1.  **Lead Conversion:** The standard sales pipeline where a `Lead` is promoted to a `Subscriber`.
2.  **Direct Creation:** An administrator directly creates a `Subscriber` record for a "direct sale" or walk-in customer.

A foundational rule is that **both workflows must trigger the exact same backend logic.** This ensures consistency in billing, work orders, and date management, regardless of how the subscriber enters the system.

## 2. The `Subscribers` Form: Conditional Editability

To support the "Direct Creation" workflow while protecting the data of existing customers, the fields on the `Subscribers` form will be **conditionally editable**.

*   **On "Create New":** All necessary fields (`firstName`, `lastName`, `servicePlan`, `trialDays`, `upfrontCharges`, etc.) will be **fully editable**. This allows an admin to manually enter all information for a direct sale.
*   **On "Edit Existing":** After a subscriber has been created (either manually or via lead conversion), core identifying fields (`firstName`, `lastName`, `accountNumber`) will become **read-only**. This is a critical safety feature to ensure data integrity for billing and network provisioning.

## 3. Backend Logic: The `Subscriber` Lifecycle Hooks

The following automated logic will be attached to the `Subscribers` collection and will run for **both** direct creation and lead conversion.

### `beforeChange` (On Create)

This hook runs *before* the new subscriber is saved to the database.

1.  **Date Calculation:**
    *   **If `trialDays` > 0:** The hook calculates `trialEndDate` and sets the `nextDueDate` to match the `trialEndDate`.
    *   **If `trialDays` is 0 or blank:** The `nextDueDate` is set to the creation date.

### `afterChange` (On Create)

This hook runs *immediately after* the new subscriber is saved.

1.  **Work Order Generation:** A "New Installation" `Work Order` is created and linked to the new subscriber.
2.  **Upfront Charges Invoice (for Trial Customers):**
    *   The system checks if the subscriber has `trialDays` > 0 AND has items in the `upfrontCharges` field.
    *   If yes, a new `Invoice` is generated **only for the upfront charges**. The recurring plan fee is ignored for this invoice.

### `afterChange` (On Update)

This hook runs when an existing subscriber is updated.

1.  **Initial Invoice on Activation:**
    *   The hook checks if the subscriber's status has just changed from `pending-installation` to `active`.
    *   If yes, it generates the first official invoice. This invoice includes the recurring `servicePlan` fee plus any `upfrontCharges` that were added.
    *   It then publishes a `subscriber.activated` event to the system log.

## 4. The Daily CRON Job

The daily billing CRON job will handle ongoing billing and trial management.

1.  **"Trial Ending Soon" Notification:** It will find subscribers whose `trialEndDate` is 3 days away and publish a `subscriber.trial.ending_soon` event.
2.  **First Recurring Invoice (Post-Trial):** It will find subscribers whose `trialEndDate` is today, generate their first recurring invoice for their service plan, and publish an `invoice.created` event.
