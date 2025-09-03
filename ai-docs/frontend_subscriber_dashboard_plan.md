# Frontend Plan: Subscriber Driver's Dashboard

This document outlines the development plan for implementing the "Connection Status" tab on the subscriber detail page, as specified in `12_monitoring_and_financial_oversight.md`.

## Phase 1: Backend Development (Payload CMS)

### Step 1.1: Enhance the Monitoring Service

-   **File:** `core-and-company/src/utils/monitoringService.ts`
-   **Action:** Create a new public method `getDeviceStatus(deviceId: string)`.
-   **Details:** This method will accept a LibreNMS device ID. It will make the necessary API calls to the LibreNMS instance to fetch the following metrics for that specific device:
    -   Status (Up/Down)
    -   Latency / Packet Loss (last 24 hours)
    -   Live Throughput (Download/Upload)
    -   Signal Quality (SNR) - *if applicable for the device type*
-   **Note:** This will require research into the specific LibreNMS API endpoints for retrieving this data. We will start with placeholder data if the endpoints are not immediately discoverable.

### Step 1.2: Create the Custom Endpoint

-   **File:** Create a new file `core-and-company/src/endpoints/subscriberConnectionStatus.ts`.
-   **Action:** Define a new custom endpoint `GET /api/subscribers/:id/connection-status`.
-   **Logic:**
    1.  The endpoint will receive a `subscriberId` as a parameter.
    2.  It will perform an access control check to ensure the logged-in user is allowed to view this subscriber.
    3.  It will fetch the `Subscriber` document from the database to find their associated `cpeDevice`.
    4.  If a `cpeDevice` exists, it will call the `monitoringService.getDeviceStatus()` method with the device's ID.
    5.  It will return the fetched monitoring data as a JSON response.

## Phase 2: Frontend Development (Next.js)

### Step 2.1: Create the UI Component

-   **File:** Create a new file `frontend/app/dashboard/crm/subscribers/[id]/ConnectionStatusTab.tsx`.
-   **Action:** Build a new React component to display the monitoring data.
-   **Details:**
    -   The component will use a client-side data fetching hook (e.g., `useSWR`) to call our new `/api/subscribers/:id/connection-status` endpoint.
    -   It will display loading and error states gracefully.

### Step 2.2: Design the "Driver's Dashboard"

-   The component will render the four key metrics using `shadcn/ui` components:
    -   **Status:** A `Badge` component (e.g., green for "Online", red for "Offline").
    -   **Latency / Packet Loss:** A simple sparkline chart. We will investigate a lightweight charting library like `recharts` or `tremor` if not already present.
    -   **Live Throughput:** A gauge component or two simple progress bars for Download/Upload.
    -   **Signal Quality (SNR):** A text label with a color indicator.

### Step 2.3: Integrate the Tab

-   **File:** Modify the subscriber detail page layout (likely `frontend/app/dashboard/crm/subscribers/[id]/layout.tsx` or `page.tsx`).
-   **Action:** Add a `Tabs` component (`shadcn/ui`) to the page.
-   **Details:** Create two tabs: "Details" (for the existing information) and a new "Connection Status" tab which will render our new `ConnectionStatusTab` component.
