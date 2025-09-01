# ISP Admin Dashboard - Frontend Plan

This document outlines the structure, components, and user experience for the main dashboard of the ISP Admin. The goal is to provide a comprehensive, intuitive, and efficient control panel for the entire ISP operation.

## 1. Dashboard UI/UX Design

The dashboard will be a single-page application with a persistent sidebar for navigation on the left and a main content area on the right. The design will be clean and data-focused, prioritizing clarity and ease of use.

### 1.1. Sidebar Navigation

The main navigation will be a collapsible sidebar, organized by the core modules we've defined. Each top-level item will have a clear icon and will expand to show the collections within that module.

*   **Dashboard** (Home Icon) - The main overview page described below.
*   **CRM & Sales** (Handshake Icon)
    *   Subscribers
    *   Leads
    *   Buildings
    *   Partners
*   **Billing & Finance** (Invoice Icon)
    *   Invoices
    *   Payments
    *   Expenses
*   **Operations & NOC** (Network Icon)
    *   Work Orders
    *   Inventory (Resources)
    *   IP Manager (IPAM)
*   **Support & Comms** (Headset Icon)
    *   Tickets
    *   Communications (Messages)
    *   Templates
*   --- (Divider) ---
*   **System & Auditing** (Shield Icon)
    *   Staff Management
    *   Audit Logs
    *   API Keys
*   **Reporting** (Chart Icon)
    *   Financial Reports
    *   Customer Reports
    *   Operations Reports

### 1.2. Universal "Add New" Button

To streamline data entry, a universal "+" (Add New) button will be present in the main header. Clicking this button will present a dropdown of common actions, allowing an admin to create a new record from anywhere in the app.

**Dropdown Options:** New Subscriber, New Lead, New Ticket, New Expense, New Work Order.

Clicking any of these options will open a clean, focused modal or slide-out drawer for quick data entry.

### 1.3. The Consistent Three-View Management Pattern

To create a predictable and intuitive user experience, all primary data collections (Subscribers, Leads, Invoices, etc.) will follow a consistent three-view pattern for management: the List View, the Detail View, and the Edit View.

#### 1.3.1. The List View (Collection Dashboard)

This is the main hub for managing a collection. It provides a high-level overview and powerful tools for finding and organizing data.

*   **Header:** A clear title (e.g., "Subscribers") with a brief description of its purpose. It will feature primary action buttons like "+ Add Subscriber" and "Export".
*   **Data Table:** The main content area will be a powerful data table with the following features:
    *   A prominent search bar.
    *   Multiple dropdown filters for key fields (e.g., "Status," "Plan").
    *   A "More Filters" button for advanced filtering options.
    *   Sortable columns.
    *   Clear pagination controls in the footer.
    *   Each row will be clickable, navigating the user to the Detail View for that specific item.

#### 1.3.2. The Detail View (360-Degree View)

This page is a comprehensive, read-only dashboard for a single record (e.g., a specific subscriber like "John Doe"). Its purpose is to consolidate all information related to that record in one place.

*   **Header:** A breadcrumb navigation path (e.g., Dashboard > Subscribers > John Doe) and a prominent title with the record's name. It will contain primary actions like "Back" and "Edit".
*   **Summary Cards:** A row of cards at the top will summarize the most critical information for quick reference. For a subscriber, this would include "Details" (Status, Plan), "Contact," and "Standing" (Account Balance).
*   **Tabbed Interface:** The core of this view is a tabbed navigation system that organizes all related data. For a subscriber, this would include tabs for:
    *   Invoices
    *   Payments
    *   Tickets
    *   Messages
    *   Activity Log
    *   Service Details

This allows an admin to see a complete history and current status without leaving the page.

#### 1.3.3. The Edit View (Data Entry Form)

This is a clean, dedicated form for modifying an existing record's details. The "Add New" page will use the exact same layout for consistency, but with blank fields.

*   **Header:** A clear breadcrumb (e.g., ... > John Doe > Edit) and a primary "Save Changes" button.
*   **Logical Grouping:** The form fields will be grouped into logical sections or cards (e.g., "Subscriber Details," "Service Configuration") to make the form easy to scan and understand.
*   **Clear Labels & Instructions:** Every field will have a clear label and, where necessary, helper text below it to explain the purpose of the field (e.g., "Used for STK Push & automated messages" under the M-Pesa phone number field).

### 1.4. Required Fields for Key "Add New" Forms

To ensure data integrity, the "Add New" forms will enforce the required fields from our system specifications.

*   **To create a new Lead:**
    *   Subscriber Name
    *   Subscriber Phone
    *   Service Location (linking to a Building and Unit)
    *   Lead Source (and Referred By if applicable)
*   **To convert a Lead to a Subscriber:**
    *   The form will be pre-populated with the lead's information.
    *   The Sales Agent must select the Service Plan and confirm the Billing Cycle.
    *   The system will automatically generate the first Invoice, and the agent will have the option to add initial one-off charges (like "Installation Fee") as line items before finalizing.

## 2. Dashboard Layout & Widgets

The main dashboard page (`/dashboard`) will feature a grid layout with several key "widget" components providing an at-a-glance view of the business.

### 2.1. Core Components & Widgets:

*   **Key Performance Indicators (KPIs)** - Top Row:
    *   A series of "stat cards" displaying critical, real-time numbers.
    *   Total Subscribers: A live count of all active subscribers.
    *   Active Tickets: The number of currently open support tickets.
    *   Overdue Invoices: The total amount of unpaid, overdue invoices.
    *   Monthly Revenue: A running total of revenue for the current month.
*   **Subscribers Overview** - Main Panel:
    *   A searchable and sortable table listing all subscribers, following the List View pattern described above.
*   **Support Tickets Feed** - Side Panel:
    *   A live-updating list of the 5-10 most recent support tickets.
    *   Details shown: Ticket ID, Subscriber Name, Issue Title, and Status (Open, In-Progress, Closed).
    *   Clicking a ticket will take the admin to the full ticket Detail View.
*   **Financial Summary** - Lower Panel:
    *   A simple bar chart visualizing revenue over the last 6 months.
    *   A list of recent high-value payments received.

### 2.2. User Roles & CRUD Operations

The ISP Admin is the superuser. This dashboard is the only place where other users (Staff, Technicians) can be created, updated, or deleted via the Staff Management section.

Other roles (e.g., Sales Agent, Support Agent) will see a simplified version of this navigation and dashboard, with menu items and widgets hidden based on their permissions.
