# Core & Company Module

The Story: This is the foundational layer of the entire system. It holds the essential, shared data that all other modules depend on to function. Think of it as the company's central directory. It defines who works for the company (Staff), what the company sells (Plans), and who the company partners with to generate growth (Partners). Without this core data, no other module can operate.

## Collections:

### 1. staff

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| fullName | Text | required |
| email | Email | required, unique, Used for login |
| password | Password | required |
| assignedRole | Relationship | required, Links to the `Roles` collection. Permissions are defined in the `Roles` collection. |
| status | Select | required, defaultValue: Active, Options: Active, Inactive |
| phoneNumber| Text | |

### 2. plans (Service Plans)

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| name | Text | required, e.g., "Home Basic 10Mbps" |
| downloadSpeed| Number | required, in Mbps |
| uploadSpeed | Number | required, in Mbps |
| price | Number | required, in KES |
| billingCycle| Select | required, Options: Monthly, Quarterly |
| notes | Text | |
| planEnabled| Checkbox | defaultValue: true, Overall on/off switch for the plan. |
| activeForNewSignups| Checkbox | defaultValue: true, If unchecked, existing users remain but no new signups allowed. |
| ipAssignmentType| Select | required, defaultValue: Dynamic, Options: Dynamic, Static-Public |
| staticIpPool| Relationship| hasOne, Links to ipSubnets. Conditionally required if ipAssignmentType is Static-Public. |

### 3. partners (House Managers)

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| fullName | Text | required |
| phoneNumber| Text | required, unique, Used to identify incoming leads |
| mpesaNumber| Text | required, For commission payments |
| status | Select | required, Options: Prospect, Active, Inactive |
| buildings | Relationship| hasMany, Links to the Buildings collection |
| commissionRate| Number | defaultValue: 1500 |
| referralCount| Number | defaultValue: 0, Incremented by a hook on lead conversion |
| perks | Checkbox | e.g., Free Personal Internet |
