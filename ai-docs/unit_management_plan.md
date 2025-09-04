# Detailed Plan: Unit-Based Sales & Management

This plan is designed to create a robust system for managing individual building units, integrating them seamlessly into the sales and subscriber lifecycle.

---

### **Phase 1: Core Data Model Enhancements (Backend)**

The foundation of this feature lies in precise data modeling.

1.  **Update `BuildingUnits.ts` Collection:**
    *   **Objective:** To make this collection the central hub for all unit-related information.
    *   **Specific Actions:**
        *   I will change the collection `slug` to `building-units` for API consistency.
        *   The `status` field will be updated to a `select` dropdown with your exact specifications and a default value:
            *   `Vacant / Unsurveyed` (default)
            *   `Lead`
            *   `Active Subscriber`
            *   `Former Subscriber`
            *   `Do Not Solicit`
        *   I will add a new, optional `subscriber` relationship field that links to the `Subscribers` collection.
        *   I will add a new, optional `lead` relationship field that links to the `Leads` collection.

2.  **Update `Leads.ts` & `Subscribers.ts` Collections:**
    *   **Objective:** To shift from tracking general locations to specific, actionable units.
    *   **Specific Actions:**
        *   In both collections, I will add a new optional `buildingUnit` relationship field that points to the `building-units` collection.
        *   The old `location` field on `Leads` will be removed to avoid data duplication. The true location will be derived from the unit's parent building.

---

### **Phase 2: Business Logic & Automation (Backend Hooks)**

This phase is about making the system intelligent and reducing manual data entry.

1.  **Lead Conversion Logic (`Leads.ts`):**
    *   **Objective:** To ensure a flawless handoff from sales to operations.
    *   **Specific Actions:**
        *   When a lead is converted to a subscriber, the `afterChange` hook will be updated to:
            1.  Transfer the `buildingUnit` relationship to the new subscriber record.
            2.  Automatically update the `BuildingUnit`'s status to `Active Subscriber`.
            3.  Clear the `lead` link from the `BuildingUnit` to free it up.

2.  **Unit Status Automation (`BuildingUnits.ts`):**
    *   **Objective:** To have unit statuses that update themselves based on real-world events.
    *   **Specific Actions:**
        *   A `beforeChange` hook will be added to the collection.
        *   This hook will check if the `lead` or `subscriber` fields are being changed and will set the `status` accordingly, ensuring data integrity.

3.  **Subscriber Lifecycle Logic (`Subscribers.ts`):**
    *   **Objective:** To accurately track churn and win-back opportunities.
    *   **Specific Actions:**
        *   When a subscriber's status is changed to `Disconnected`, an `afterChange` hook will:
            1.  Find the associated `BuildingUnit`.
            2.  Update its status to `Former Subscriber`.
            3.  Clear the `subscriber` link, making the unit available for a new sales cycle.

---

### **Phase 3: User Interface & Experience (Frontend)**

This phase is about making the feature intuitive and powerful for your team.

1.  **New `UnitSelector.tsx` Component:**
    *   **Objective:** To create a guided and error-proof way to select a specific unit.
    *   **Specific Actions:**
        *   I will build a new, reusable React component with a chain of three dependent dropdowns:
            1.  **Service Location:** Select the area.
            2.  **Building:** Shows buildings within that location.
            3.  **Building Unit:** Shows available units in that building.

2.  **Update Forms (`lead-form.tsx` & `subscriber-form.tsx`):**
    *   **Objective:** To integrate the new selection workflow into your daily tools.
    *   **Specific Actions:**
        *   The `UnitSelector` component will be added to both the lead and subscriber forms, providing a consistent user experience.

3.  **Enhance Building View (`building-detail-page.tsx`):**
    *   **Objective:** To give managers a powerful, at-a-glance dashboard for each building.
    *   **Specific Actions:**
        *   A new "Units" tab will be added to the page.
        *   This tab will contain a data table listing all units in the building, with columns for the unit number, its real-time status (including the color-coded badges you designed), and a direct link to the associated lead or subscriber.