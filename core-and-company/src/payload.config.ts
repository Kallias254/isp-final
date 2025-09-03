import { buildConfig } from 'payload/config';
import path from 'path';
import { Staff } from './payload-types'; // Import Staff type
import { seed } from './seed';

// Core and Company Collections
import StaffCollection from './collections/Staff'; // Renamed to avoid conflict with type
import Plans from './collections/Plans';
import Partners from './collections/Partners';
import Roles from './collections/core/Roles';
import Company from './collections/core/Company';
import AuditLogs from './collections/AuditLogs';

// Billing and Finance Collections
import Invoices from './collections/Invoices';
import Payments from './collections/Payments';
import Expenses from './collections/Expenses';
import Media from './collections/Media';

// CRM and Sales Collections
import Buildings from './collections/Buildings';
import BuildingUnits from './collections/BuildingUnits';
import Leads from './collections/Leads';

// Operations and Network Management Collections
import Subscribers from './collections/Subscribers';
import NetworkDevices from './collections/NetworkDevices';
import IpSubnets from './collections/IpSubnets';
import IpAddresses from './collections/IpAddresses';
import WorkOrders from './collections/WorkOrders';
import CrisisEvents from './collections/CrisisEvents';
import ServiceLocations from './collections/ServiceLocations';

// Support and Communications Collections
import Tickets from './collections/Tickets';
import Messages from './collections/Messages';
import Contacts from './collections/Contacts';
import MessageTemplates from './collections/MessageTemplates';

import whatsappLeadEndpoint from './endpoints/whatsappLeadEndpoint';
import billingCronEndpoint from './endpoints/billingCronEndpoint';
import mpesaCallbackEndpoint from './endpoints/mpesaCallbackEndpoint';
import mpesaInitiatePaymentEndpoint from './endpoints/mpesaInitiatePaymentEndpoint';
import monitoringWebhookEndpoint from './endpoints/monitoringWebhookEndpoint';
import sendManualMessageEndpoint from './endpoints/sendManualMessageEndpoint';
import sendBulkMessageEndpoint from './endpoints/sendBulkMessageEndpoint';
import subscriberConnectionStatusEndpoint from './endpoints/subscriberConnectionStatusEndpoint';

import { payloadCloud } from '@payloadcms/plugin-cloud';
import BeforeDashboard from './components/BeforeDashboard';

export default buildConfig({
  onInit: async (payload) => {
    await seed(payload);
  },
  cors: ['http://localhost:3000'],
  admin: {
    user: StaffCollection.slug, // Use the renamed import
    
    components: {
      beforeDashboard: [BeforeDashboard],
    }
  },
  endpoints: [
    whatsappLeadEndpoint,
    billingCronEndpoint,
    mpesaCallbackEndpoint,
    mpesaInitiatePaymentEndpoint,
    monitoringWebhookEndpoint,
    sendManualMessageEndpoint,
    sendBulkMessageEndpoint,
    subscriberConnectionStatusEndpoint,
  ],
  collections: [
    AuditLogs,
    StaffCollection, // Use the renamed import
    Roles,
    Company,
    Plans,
    Partners,
    Invoices,
    Payments,
    Expenses,
    Media,
    Buildings,
    BuildingUnits,
    Leads,
    Subscribers,
    NetworkDevices,
    IpSubnets,
    IpAddresses,
    WorkOrders,
    CrisisEvents,
    ServiceLocations,
    Tickets,
    Messages,
    Contacts,
    MessageTemplates,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    payloadCloud()
  ]
});
