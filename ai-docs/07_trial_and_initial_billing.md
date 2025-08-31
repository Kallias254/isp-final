# Specification: Trial Period & Initial Billing Workflow

This document outlines the complete workflow for creating new subscribers with a trial period, handling upfront one-time charges, and managing the transition to a paid subscription.

## 1. User Interface (The "Add New Subscriber" Form)

To keep the user experience nimble, the trial logic will be handled by a single field in the "Add New Subscriber" or "Convert Lead" modal.

*   **Trial Days Field:** A simple Number field labeled "Trial Days (optional)". The agent can enter a number like 7 or 30. If left blank, a standard, non-trial subscription is created.
*   **One-Off Charges Section:** A lineItems array field (like on an invoice) labeled "Upfront Charges". Here, the agent can add items like "Router Purchase" or "Installation Fee" with their respective prices.

## 2. Backend Logic & Workflow

When a subscriber is created, a `beforeChange` hook will execute the following logic to handle the trial and billing dates automatically.

### Scenario A: Standard Signup (No Trial Days Entered)

*   **`nextDueDate` Calculation:** The `nextDueDate` is set to the subscriber's creation date.
*   **Initial Invoice Generation:**
    *   An Invoice is created immediately upon the subscriber's status changing to `Active`.
    *   This invoice includes the pro-rated recurring `servicePlan` fee.
    *   It also includes any one-off charges added in the "Upfront Charges" section.

### Scenario B: Trial Signup (Trial Days > 0)

*   **Date Calculation:** The hook performs the following date calculations:
    *   `trialEndDate` = `currentDate` + `trial_days`
    *   `nextDueDate` = `currentDate` + `trial_days`
    *   This sets both the end of the free period and the start of the first paid period.
*   **Initial Invoice Generation (for Upfront Charges Only):**
    *   The system checks if any line items were added to the "Upfront Charges" section.
    *   **If yes:** An invoice is generated immediately, but it **only** includes the one-off line items. The recurring plan fee is explicitly excluded. The `dueDate` for this invoice is immediate.
    *   **If no:** No invoice is generated at this time.
*   **"Trial Ending Soon" Notification:**
    *   The daily billing CRON job will find subscribers whose `trialEndDate` is 3 days away.
    *   It will publish a `subscriber.trial.ending_soon` event, triggering an SMS notification.
*   **First Recurring Invoice Generation:**
    *   On the `trialEndDate`, the daily billing CRON job will identify the subscriber.
    *   It will generate their first full, recurring invoice, which includes the `servicePlan` fee for the upcoming period (e.g., the next month).
    *   It will publish an `invoice.created` event, triggering an SMS notification for this new bill.

This comprehensive workflow ensures that:

*   Sales agents have a simple and intuitive interface.
*   Upfront hardware and installation costs are billed immediately and correctly, even for trial customers.
*   The first recurring service bill is accurately generated the day the trial period ends.
*   The customer is kept informed throughout the process with automated notifications.
