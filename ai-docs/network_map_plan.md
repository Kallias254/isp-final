# Network Map - Frontend Implementation Plan

This document outlines a phased approach to implementing the Network Map feature in the ISP Admin Dashboard, aligning with the "dont overdo now" instruction while laying the groundwork for future, more complex integrations.

## 1. Vision & Goal

To provide a visual representation of the network topology, displaying devices and their connections, with an eventual goal of showing real-time status and integrating with crisis management workflows.

## 2. Phased Implementation

### Phase 1: Static Topology Visualization (Mock Data)

*   **Goal:** Display a basic, static visual representation of the network topology using mock data. This will demonstrate the core concept without requiring live backend integration yet.
*   **Implementation Details:**
    *   **Data:** Create a new mock data file (e.g., `frontend/app/dashboard/operations/map/mock-topology.ts`) that defines a simple network graph. This data will include:
        *   Nodes: Representing `NetworkDevices` (e.g., Router, Switch, Access Point, CPE) with properties like `id`, `deviceName`, `deviceType`, and `location`.
        *   Edges: Representing connections between devices, defined by `source` and `target` node IDs.
    *   **Visualization Library:** Utilize a simple JavaScript graphing library (e.g., `react-flow-renderer`, `vis-network`, or even basic SVG/Canvas drawing) to render this static topology.
    *   **Features:**
        *   Nodes will visually represent different `NetworkDevice` types.
        *   Edges will illustrate network connections.
        *   Basic styling will differentiate device types (e.g., different shapes or colors).
        *   Clicking a node will navigate the user to the corresponding device's Detail View page (using the mock ID).

### Phase 2: Dynamic Status Overlay (Simulated Data)

*   **Goal:** Overlay simulated real-time status (e.g., online/offline, warning) on the static topology, making the map more interactive and indicative of network health.
*   **Implementation Details:**
    *   **Data Enhancement:** Enhance the mock data (`mock-topology.ts`) to include a `status` property for each device (e.g., `online`, `offline`, `warning`).
    *   **Visualization Update:** Modify the visualization to dynamically change node colors, add status icons, or apply other visual cues based on the simulated `status`.
    *   **Interaction:** Introduce a simple mechanism (e.g., a button or a timer) to cycle through different simulated statuses for devices, demonstrating dynamic updates.

### Phase 3: Backend Integration & Real-time Monitoring (Future)

*   **Goal:** Connect the network map to the backend's `MonitoringService` to fetch real-time topology and status data from LibreNMS, and integrate with the `CrisisEvents` system.
*   **Implementation Details:**
    *   **Backend Endpoint:** Create a new backend endpoint (e.g., `/api/network-topology`) that queries LibreNMS via the `MonitoringService` to retrieve live network topology and device status data.
    *   **Data Transformation:** The backend will transform LibreNMS data into a format suitable for the frontend visualization library.
    *   **Real-time Updates:** Implement WebSocket or long-polling to push real-time status updates from the backend to the frontend map.
    *   **Crisis Integration:** When a device status changes to `offline` or `critical` (as detected by LibreNMS and processed by the backend), the map will visually highlight the affected device. Clicking on such a device could provide a direct link or trigger a modal to the relevant `CrisisEvent` page, allowing the user to quickly triage and manage the issue.

## 3. Next Steps (Focusing on Phase 1)

1.  Create the `mock-topology.ts` file with sample network graph data.
2.  Implement the `frontend/app/dashboard/operations/map/page.tsx` to render the static topology using a chosen visualization library.
3.  Ensure nodes are clickable and navigate to device detail pages.
