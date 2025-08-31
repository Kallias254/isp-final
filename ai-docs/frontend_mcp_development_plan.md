# Frontend Development Plan (MCP)

This document outlines the plan for developing the new frontend for the ISP Admin Dashboard using the `shadcn-ui-mcp-server` tool.

## Phase 1: Project Setup

1.  **Delete Existing Frontend:**
    *   Action: Delete the `frontend` directory.

2.  **Create New Frontend Project:**
    *   Action: Create a new Next.js project named `frontend`.
    *   Command: `npx create-next-app@latest frontend --typescript --tailwind --eslint`

3.  **Initialize shadcn-ui:**
    *   Action: Initialize `shadcn-ui` in the `frontend` project.
    *   Command: `npx shadcn-ui@latest init`

## Phase 2: Dashboard Scaffolding

### 2.1. Get Dashboard Block

*   **Tool:** `get_block`
*   **Options:**
    *   `blockName`: "dashboard-01"
    *   `includeComponents`: true

This will generate the complete dashboard layout with all the necessary components.

## Phase 3: Customization and Integration

1.  **Customize Sidebar Navigation:**
    *   Action: Modify the generated sidebar component to match the navigation structure from our plan.

2.  **Implement Universal "Add New" Button:**
    *   Action: Add the universal "Add New" button to the header and connect it to modal forms.

3.  **Create Collection Views:**
    *   Action: For each collection (Subscribers, Leads, etc.), create the three-view management pattern (List, Detail, Edit) using the generated components as a base.
    *   We will use the `create-data-table` and `build-shadcn-page` prompts for this, as planned before.

## Phase 4: Mock Data and Finalization

1.  **Populate with Mock Data:**
    *   Action: Create mock data for all collections and populate the views.

2.  **Final Review:**
    *   Action: Perform a final review of the UI and functionality.