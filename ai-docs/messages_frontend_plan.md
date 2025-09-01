# Messages Frontend Plan

This document outlines the plan for implementing the "Messages" section of the ISP Admin Dashboard, focusing on UI/UX and consistency with existing patterns.

## 1. Overall Goal
To provide a comprehensive UI for managing messages sent to subscribers, including viewing sent messages and composing new ones with flexible recipient and template options.

## 2. Three-View Management Pattern
We will follow the consistent three-view management pattern established for other modules:

### 2.1. List View (Sent Messages)
*   **Purpose:** Display a list of all sent messages.
*   **Details:** Data table showing recipient, message type (SMS, Email, Push), subject, date sent, and status.
*   **Linking:** Each message record will link to its Detail View.

### 2.2. Detail View (Sent Message Details)
*   **Purpose:** Display the full content and details of a specific sent message.
*   **Details:** Show recipient, type, content, status, trigger event, and sender (staff).
*   **Actions:** Breadcrumbs, and an "Edit" button (for consistency, though editing sent messages is unusual).

### 2.3. Compose/Send New Message View (Add New/Edit)
*   **Purpose:** A flexible form for composing and sending new messages, and for editing draft messages (if applicable).
*   **Key Features:**
    *   **Message Type Selection:** Radio buttons or a select dropdown for `type` (SMS, Email, Push Notification).
        *   **Push Notification Note:** Push notifications are generally reliable if the client has the app installed and notifications enabled. They are typically free to send (cost is in app development/maintenance). They are not bothersome if used judiciously for relevant updates.
    *   **Dynamic Recipient Selection:** A crucial and flexible component:
        *   **Recipient Type Selector:** A select dropdown to choose between "Single Subscriber", "Unregistered User", and "Group".
        *   **Conditional Recipient Fields:** Based on the selected Recipient Type:
            *   **Single Subscriber:** A searchable combobox to select an existing subscriber. If navigating from a subscriber's detail page, this field will be pre-filled and read-only.
            *   **Unregistered User:** Text input fields for the recipient's contact (phone number or email) and a name. This allows sending messages to individuals not in the subscriber list (e.g., landlords, prospective leads).
            *   **Group:** A "Group Type" selector (e.g., "All Subscribers", "Buildings", "Plans"). Then, a combobox/multi-select to choose specific groups. This handles bulk messaging.
    *   **Template Integration:**
        *   A "Use Template" checkbox. When checked, a searchable combobox for `MessageTemplates` will appear.
        *   Selecting a template will pre-fill the message `subject` and `content` fields, which can then be customized.
    *   **Subject Field:** Text input for the message subject.
    *   **Content Field:** A `Textarea` for the message body.
    *   **Company Sender ID:** Acknowledge that this is typically a backend configuration or a property of the message template, not directly managed in this frontend form.
    *   **Submit Button:** "Send Message" (or "Save Changes" for editing drafts).

## 3. Implementation Steps (Current Status: Midway through `message-form.tsx`)

1.  **Create `message-form.tsx`:** (In Progress)
    *   Implement the complex `zod` schema with conditional validation.
    *   Implement dynamic recipient selection logic.
    *   Implement template integration logic.
2.  **Create `new/page.tsx`:** Render `MessageForm` without `initialData`.
3.  **Create `edit/page.tsx`:** Render `MessageForm` with `initialData`.
4.  **Create `detail/page.tsx`:** Simple view for sent messages.
5.  **Update `columns.tsx` for list view:** Ensure correct linking to detail page.

## 4. UI/UX Considerations
*   **Consistency:** Maintain consistency with existing UI patterns (breadcrumbs, headers, card layouts, Shadcn UI components).
*   **Clarity:** Ensure clear labels, helper texts, and validation messages.
*   **Responsiveness:** Design for various screen sizes.
