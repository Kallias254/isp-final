# 11. Service Location and Monitoring Architecture

This document details the architecture of the `ServiceLocation` collection and explains how it serves as the backbone for monitoring and asset tracking within the ISP platform.

## 1. Core Principle: A Single Source of Truth

The `ServiceLocation` collection is the definitive source for all geographical data. Every physical asset, customer, or site in the system is tied to a `ServiceLocation` record. This centralized approach prevents data duplication and ensures that location information is consistent and easy to manage.

Each `ServiceLocation` record contains essential geographical data, primarily its `latitude` and `longitude`.

## 2. Key Relationships

Three primary collections are directly linked to `ServiceLocation`:

*   **`Subscribers`**: The `serviceAddress` field on a `Subscriber` record is a direct relationship to a `ServiceLocation`. This pinpoints the exact location where a customer receives their service.
*   **`Buildings`**: The `location` field on a `Building` record (representing a Multi-Dwelling Unit or MDU) is a relationship to a `ServiceLocation`. This marks the physical location of the entire building.
*   **`NetworkDevices`**: The `physicalLocation` field on a `NetworkDevice` is a relationship to a `ServiceLocation`. This tracks the precise physical placement of hardware like routers, switches, or antennas.

### The Subscriber-to-Building Link

A `Subscriber` is **not** directly linked to a `Building` in the database. The association is made **indirectly through a shared `ServiceLocation`**.

*   **Example:** An apartment building is created as a `Building` and linked to `ServiceLocation A`. When 20 subscribers are added for that building, each of their `serviceAddress` fields will also point to `ServiceLocation A`. This correctly associates all 20 subscribers with the building without creating a rigid, direct database link.

This design provides the flexibility to also manage subscribers in standalone locations (like single-family homes) that don't belong to a larger `Building` entity.

## 3. The Monitoring Trail

This architecture is crucial for effective network monitoring and support.

*   **Subscriber-Driven Events:** When a `Ticket` is created for a `Subscriber`, the support team can immediately identify the physical location of the issue through the data flow: `Ticket -> Subscriber -> ServiceLocation`.

*   **Network-Driven Events:** When a `NetworkDevice` triggers a `CrisisEvent` (e.g., goes offline), the system knows the device's exact location via `CrisisEvent -> NetworkDevice -> ServiceLocation`. The platform can then identify all `Subscribers` who are also linked to that same `ServiceLocation` to proactively notify them of an outage.

## 4. UI/UX Implementation Note

The management of `ServiceLocation` is designed to be seamless and integrated into the user workflow. There is no separate, dedicated page for "managing all service locations."

Instead, a `ServiceLocation` is typically created or selected **within the forms for other records**. For example, when adding a new `Building` or `Subscriber`, the user interface will provide a map or address lookup tool. When the user picks a location on the map, the system either finds the existing `ServiceLocation` for that spot or creates a new one behind the scenes. This keeps the user experience focused on the task at hand (e.g., "I'm adding a new subscriber") rather than forcing them to manage geographical data separately.
