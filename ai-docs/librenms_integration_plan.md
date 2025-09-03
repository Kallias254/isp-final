# LibreNMS Integration Plan

This document outlines the plan for integrating LibreNMS as a core monitoring engine within the ISP Management Platform, building upon the strategy detailed in `12_monitoring_and_financial_oversight.md`.

## 1. Introduction to LibreNMS

LibreNMS is a community-based, GPL-licensed auto-discovering PHP/MySQL-based network monitoring system. It supports a wide range of network hardware and operating systems, providing comprehensive monitoring capabilities through various protocols like SNMP.

## 2. Key Integration Aspects

Based on the Context7 documentation, the integration will focus on the following areas:

### 2.1. Deployment and Setup

*   **Docker Deployment:** LibreNMS can be deployed using Docker Compose, simplifying its setup and management alongside other services. (Snippet: `sudo docker compose -f compose.yml up -d`)
*   **Installation Validation:** The `validate.php` script is crucial for checking the LibreNMS installation for common issues and misconfigurations. (Snippet: `./validate.php`)

### 2.2. Database Management

*   **MySQL/MariaDB:** LibreNMS relies on a MySQL or MariaDB database. The documentation provides commands for dumping and importing the database, which will be useful for backups and migrations. (Snippets: `mysqldump librenms -u root -p > librenms.sql`, `mysql -u root -p librenms < librenms.sql`)
*   **Database Privileges:** Proper database user privileges are essential for LibreNMS to connect and manage its database. (Snippet: `GRANT ALL PRIVILEGES ON librenms.* TO 'librenms'@'IP_OF_YOUR_LNMS_SERVER' IDENTIFIED BY 'PASSWORD' WITH GRANT OPTION;`)

### 2.3. Device Monitoring (SNMP)

*   **SNMP Configuration:** LibreNMS primarily uses SNMP for device monitoring. This involves configuring SNMP agents on network devices and ensuring LibreNMS has the correct community strings. (Snippets for `snmpd` configuration and starting/enabling services).
*   **Adding Devices:** Devices can be added to LibreNMS via its command-line utility (`lnms device:add`). (Snippet: `lnms device:add [hostname or ip]`)
*   **Discovery and Polling:** LibreNMS performs discovery and polling to gather data from devices. (Snippet: `./discovery.php -h HOSTNAME -d`)

### 2.4. API Interaction (Implied)

While direct API interaction snippets were not explicitly provided for data retrieval, the overall architecture of LibreNMS suggests a robust API for programmatic access. Our `MonitoringService` within the Payload backend will be responsible for securely querying this API.

## 3. Alignment with `12_monitoring_and_financial_oversight.md`

This integration plan directly supports the vision outlined in `12_monitoring_and_financial_oversight.md`:

*   **LibreNMS as the Monitoring Engine:** Confirms LibreNMS's role as the 24/7 monitoring engine.
*   **Secure, Server-to-Server Communication:** The `MonitoringService` will encapsulate all interactions with LibreNMS, ensuring secure communication.
*   **No Direct User Access:** The ISP Admin will interact with LibreNMS data solely through the Payload CMS and Next.js frontend, abstracting away the LibreNMS UI.
*   **Data Model Extension:** The data collected by LibreNMS will populate and enrich the `NetworkDevices` and other related collections within our Payload CMS.

## 4. Next Steps

1.  **LibreNMS Deployment:** Set up a LibreNMS instance (preferably using Docker) for development and testing.
2.  **`MonitoringService` Development:** Implement the `MonitoringService` in the Payload backend to interact with the LibreNMS API.
3.  **Data Synchronization:** Develop mechanisms to synchronize device data between LibreNMS and the Payload CMS (`NetworkDevices` collection).
4.  **Alert Integration:** Configure LibreNMS to send alerts (e.g., via webhooks) to our Payload CMS, triggering the `CrisisEvents` workflow.