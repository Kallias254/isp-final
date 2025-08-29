# CRM & Sales Module

**Access Control Note:** Access to the collections and the ability to perform actions within the workflows described in this module are now managed through the Data-Driven Access Control (RBAC) system. Permissions are configured in the `Roles` collection, as detailed in `00_data_driven_rbac.md`.

The Story: This module is the engine of the ISP's growth. It covers the entire customer acquisition journey, from a sales agent identifying a new apartment building ("building hunting") to nurturing a potential customer ("lead") and finally converting them into a subscriber ready for installation. Its primary goal is to manage the sales pipeline and provide clear data on acquisition channels, such as the crucial "ISP Property Partner" program.

## Collections:

### 1. buildings

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| name | Text | required, e.g., "Mombasa Trade Center" |
| address | Text | required |
| status | Select | required, Options: Prospecting, Negotiating, Active, Lost |
| partner | Relationship| hasOne, Links to the Partners collection (the caretaker) |
| location | Geolocation | |
| equipment | Relationship| read-only, View of Resources assigned to this building in the NOC module. |

### 2. buildingUnits

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| unitNumber | Text | required, e.g., "Apt 3B" |
| building | Relationship| required, hasOne, Links to Buildings |
| status | Select | required, Options: Vacant, Occupied, Lead, Subscriber |
| currentProvider| Text | optional, e.g., "Safaricom Home Fibre" |
| competitorPaymentDate| Date | optional, Used for sales follow-up timing |
| currentIssues| Text Area | optional, Notes on current internet problems from prospect |

### 3. leads

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| status | Select | required, Options: New, Contacted, Site Survey, Converted, Lost |
| leadSource | Select | required, Options: Partner Referral, Website, Direct Call |
| referredBy | Relationship| hasOne, Links to Partners. Required if leadSource is Partner Referral |
| subscriberName| Text | required |
| subscriberPhone| Text | required |
| serviceLocation| Relationship| required, hasOne, Links to BuildingUnits |
| notes | Rich Text | |

## Workflows:

### Lead Creation via WhatsApp/SMS:

1.  The external WhatsApp Parser service receives a message.
2.  It validates the sender's phone number against the Partners collection.
3.  If valid, it parses the message and uses the Payload API to create a new Lead, linking it to the correct Partner.

### Lead Conversion:

1.  A Sales Agent changes a Lead's status to Converted.
2.  A Payload afterChange hook triggers.
3.  The hook creates a new Subscriber record in the Billing module.
4.  It sets the new subscriber's status to Pending Installation.
5.  It publishes a subscriber.created event for other modules to consume.
6.  If the lead was from a partner, it increments the referralCount on the Partner's record.
