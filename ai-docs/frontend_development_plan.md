# Frontend Development Plan

This document outlines the plan for developing the new frontend for the ISP Admin Dashboard. The plan is divided into four phases, starting with a UI-first approach using mock data, and then progressively integrating the backend and authentication logic.

## Phase 1: UI Scaffolding (No Auth)

The goal of this phase is to quickly set up the new dashboard UI using the generated code from v0.dev and populate it with mock data. This will allow for rapid iteration and feedback on the UI without the complexity of backend integration.

1.  **Generate Dashboard Component (in a Temporary Project):**
    *   Create a temporary directory outside of the current project to avoid any conflicts.
    *   Inside the temporary directory, run the `npx shadcn@latest add` command with the provided v0.dev URL to generate a new Next.js project containing the dashboard components.
    *   Identify the relevant component files from the generated project (e.g., dashboard, sidebar, etc.).
    *   Copy the necessary component files from the temporary project to a dedicated directory in our `frontend` project at `frontend/src/components/generated`.
    *   Delete the temporary directory and the newly created project to keep our workspace clean.

2.  **Integrate Generated Dashboard:**
    *   Update the main layout file (`frontend/src/app/layout.tsx`) to use the new dashboard layout.
    *   Replace the content of the main page (`frontend/src/app/page.tsx`) with the generated dashboard component.
    *   The existing pages and components will be temporarily disabled or removed to avoid conflicts.

3.  **Populate with Mock Data:**
    *   Create mock data for all the dynamic parts of the dashboard, such as the subscribers list, recent activities, and statistics.
    *   The mock data will be defined in separate files (e.g., `frontend/src/lib/mock-data.ts`) to keep the components clean.

## Phase 2: Component Integration and Refinement

In this phase, we will break down the monolithic generated dashboard into smaller, reusable components and refine the UI.

1.  **Componentization:**
    *   Analyze the generated dashboard component and identify logical sections that can be extracted into smaller, reusable components (e.g., `Sidebar`, `Header`, `SubscriberTable`, `StatCard`, etc.).
    *   Create a new directory structure for these components inside `frontend/src/components` (e.g., `frontend/src/components/dashboard`, `frontend/src/components/subscribers`).

2.  **UI Refinement:**
    *   Refine the styles and layout of the components to match the project's branding and design requirements.
    *   Ensure the UI is responsive and works well on different screen sizes.

## Phase 3: Backend Integration (with Auth)

This phase focuses on connecting the frontend to the backend API and implementing the authentication flow.

1.  **Implement Authentication:**
    *   Create the `AuthContext` and `useAuth` hook as outlined in the `10_frontend_integration_and_auth.md` document.
    *   Implement the login page and connect it to the backend's `/api/staff/login` endpoint using a React Server Action.
    *   Implement the `/api/staff/me` endpoint call to fetch the authenticated user's data and hydrate the `AuthContext`.
    *   Implement the logout functionality.

2.  **Replace Mock Data with Real Data:**
    *   Create API client functions in `frontend/src/lib/api.ts` to fetch data from the backend.
    *   Replace all the mock data with real data fetched from the backend API.
    *   Ensure that the data is correctly displayed in the UI.

## Phase 4: Finalization and Cleanup

The final phase involves cleaning up the codebase and preparing for production.

1.  **Cleanup:**
    *   Remove the `frontend/src/components/generated` directory and any other temporary files.
    *   Remove all the mock data and related code.
    *   Review the codebase for any unused components or variables and remove them.

2.  **Final Review:**
    *   Perform a thorough review of the entire frontend application, including the UI, functionality, and code quality.
    *   Test the application on different browsers and devices to ensure compatibility.
