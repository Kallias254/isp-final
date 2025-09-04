# Plan for Enhancing Location Management in Lead/Subscriber Onboarding

This document outlines the plan to improve the location selection and creation process within the lead and subscriber forms. The goal is to provide more flexibility, particularly for handling standalone homes, and to streamline the user experience.

## 1. Component Modifications

The core of this plan involves modifying existing components to add on-the-fly creation capabilities for buildings and units.

### `location-selector.tsx`

This component will be significantly enhanced to become the central hub for location management during onboarding.

- **Add "Create Building" Functionality:**
  - A "+" (plus) icon button will be added next to the "Building" dropdown menu.
  - Clicking this button will open a `Sheet` (a side modal) containing the `BuildingForm`.
  - This will allow users to create a new building directly from the lead/subscriber form without navigating away. The newly created building will be automatically selected.

- **Add "Create Unit" Functionality:**
  - Similarly, a "+" icon button will be added next to the "Unit" dropdown.
  - This will open a `Sheet` containing the `UnitForm`.
  - The `buildingId` of the currently selected building will be passed to the form to ensure the new unit is correctly associated.

- **Support for Standalone Homes:**
  - This new workflow naturally supports standalone homes. A user can create a new "Building" named, for example, "John Doe Residence," and then create a single "Unit" for it, which could be named "Main House" or simply "N/A".

### `building-form.tsx`

- **Geolocation Feature:** The request to add a geolocation button ("Use My Location") to this form is already addressed. The `building-form.tsx` uses the `ServiceLocationSelector`, which in turn uses a modal containing the `service-location-form.tsx`. This service location form already has the geolocation functionality implemented. Therefore, no direct changes are needed in `building-form.tsx` for this feature.

### `unit-form.tsx`

- This form will be used within the new "Create Unit" `Sheet`. It will receive the `buildingId` as a prop to correctly associate the new unit with its parent building.

### `lead-form.tsx`

- **Optional Location:** To accommodate cases where a lead's location is not immediately known, the form's validation schema (Zod) will be updated.
  - The `serviceLocation`, `building`, and `buildingUnit` fields will be made optional.

## 2. New User Experience Flow

These changes will result in a more fluid user experience:

- **Scenario 1: Onboarding a Lead in a Standalone Home**
  1. User opens the "New Lead" form.
  2. In the `LocationSelector`, they select a `ServiceLocation` (or create one).
  3. They click the "+" button next to the `Building` dropdown, opening the `BuildingForm` in a sheet.
  4. They fill in the building name (e.g., "Jane Smith's House") and save.
  5. They click the "+" button next to the `Unit` dropdown.
  6. They create a new unit (e.g., "N/A") and save.
  7. The new location is now associated with the lead.

- **Scenario 2: Onboarding a Lead with No Location**
  1. User opens the "New Lead" form.
  2. They fill in the lead's personal details.
  3. They leave the `LocationSelector` fields blank.
  4. They can successfully save the lead.

This plan will be executed by modifying the respective files as described above.