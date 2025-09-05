# Frontend Plan: Subscribers Module

## 1. Objective

This plan outlines the progressive steps to fix the existing errors in the subscribers module, connect it to the live backend API, and completely remove the mock data.

## 2. Current State & Error Analysis

- **Subscribers List Page (`/dashboard/crm/subscribers`):** This page currently displays a static table using mock data. A "Hydration Error" is present, indicating a server-client rendering mismatch caused by failed data fetches during server rendering.

- **"Create Subscriber" Page (`/dashboard/crm/subscribers/new`):** This page crashes immediately upon loading.
    - **Root Cause:** The page attempts to `fetch` data from the backend (e.g., for service plans dropdowns).
    - The API requests fail with a `403 Forbidden` error because the frontend is not authenticated with the backend.
    - This leads to a `TypeError: Cannot read properties of undefined (reading 'map')` as the component tries to render a list from data that was never successfully fetched.

## 3. Proposed Implementation Plan

We will follow a phased approach to minimize disruption and ensure a stable result.

### Phase 1: Fix API Authentication

The core problem is that the frontend `fetch` requests are not authenticated. We need to create a reusable utility that handles this correctly.

1.  **Create an API Client:** Create a new file at `frontend/lib/api.ts`.
2.  **Implement Wrapper:** Inside this file, create a wrapper function around the native `fetch` API. This wrapper will automatically include the necessary credentials (like the `payload-token` cookie) in every request to the backend.
3.  **Handle Server-Side:** The wrapper must be ableto handle both client-side and server-side rendering contexts, passing credentials appropriately in each case.

### Phase 2: Fix the "Create Subscriber" Page Crash

With the authenticated API client from Phase 1, we can fix the crash.

1.  **Modify Data Fetching:** Update the `Create Subscriber` page component to use the new `api.ts` wrapper for fetching data like Service Plans.
2.  **Validate:** Confirm that the API calls now succeed (200 OK) and that the form renders correctly without crashing.

### Phase 3: Connect the Subscribers List Page

Now we replace the mock data on the main list page.

1.  **Fetch Live Data:** Modify the subscribers page component (`/dashboard/crm/subscribers`) to use the `api.ts` wrapper to fetch the list of all subscribers from the `/api/subscribers` endpoint.
2.  **Remove Mock Data:** Delete the code that imports and uses the local mock data.
3.  **Update Data Table:** Ensure the `DataTable` component correctly receives and displays the columns and data from the live API response.

### Phase 4: Enable Subscriber Creation

Finally, we make the form functional.

1.  **Update Form Handler:** Modify the `subscriber-form.tsx` component. The `onSubmit` handler should now use the `api.ts` wrapper to send a `POST` request to `/api/subscribers` with the new subscriber's data.
2.  **Add User Feedback:** Implement success and error notifications (e.g., using the existing `sonner` library) to inform the user of the outcome.
3.  **Redirect:** Upon successful creation, redirect the user back to the main subscribers list page.
