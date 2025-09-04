# FreeRADIUS Integration: Frontend Impact and UX Plan

## 1. Objective
This document outlines the necessary modifications to the frontend application to support the FreeRADIUS integration, focusing on enhanced user experience (UX) and efficient management of subscriber data.

## 2. Subscriber Form Modifications (`frontend/components/subscriber-form.tsx`)

The subscriber creation and editing forms will require significant updates to accommodate FreeRADIUS-specific attributes and connection types.

### 2.1. New Fields

*   **Connection Type:** A new `select` field to define how the subscriber connects to the network.
    *   Options: `PPPoE`, `IPoE/DHCP (MAC Locked)`, `Hotspot`.
*   **MAC Address:** A text input field for IPoE/DHCP connections.
*   **Static IP Address:** A text input field for static IP assignments.
*   **FreeRADIUS Attributes (Optional/Advanced):** Consider a flexible field (e.g., a JSON editor or key-value pair input) for advanced FreeRADIUS attributes if needed for future extensibility.

### 2.2. Conditional Display Logic

The form fields will dynamically change based on the selected "Connection Type" to ensure a clean and relevant user interface.

*   **If `PPPoE` is selected:**
    *   Display `username` and `password` fields.
    *   Hide `MAC Address` and `Static IP Address` fields.
*   **If `IPoE/DHCP (MAC Locked)` is selected:**
    *   Display `MAC Address` and `Static IP Address` fields.
    *   Hide `username` and `password` fields.
*   **If `Hotspot` is selected:**
    *   Display fields relevant to hotspot management (e.g., voucher generation options, time limits). This might require further definition.
    *   Hide `username`, `password`, `MAC Address`, and `Static IP Address` fields.

### 2.3. Input Validation and Masking

*   **MAC Address:** Implement input masking (e.g., `XX:XX:XX:XX:XX:XX`) and validation to ensure correct format.
*   **IP Address:** Implement validation for valid IPv4 addresses.

## 3. Subscriber List Enhancements (`frontend/app/dashboard/columns.tsx` and `frontend/components/data-table.tsx`)

The subscriber data table will need to display the new connection-related information.

*   Add new columns for:
    *   `Connection Type`
    *   `MAC Address` (if applicable)

## 4. User Experience (UX) Considerations

*   **Clarity:** Ensure all new fields and options are clearly labeled and intuitive.
*   **Help Text/Tooltips:** Provide concise help text or tooltips for complex fields (e.g., explaining the purpose of MAC address for IPoE).
*   **Error Handling:** Implement robust client-side and server-side validation with clear, user-friendly error messages.
**   **Consistency:** Maintain the existing design system and component library for a consistent look and feel.
