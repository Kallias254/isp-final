import { buildConfig } from 'payload/config';
import path from 'path';

// Core and Company Collections
import Staff from './collections/Staff';
import Plans from './collections/Plans';
import Partners from './collections/Partners';
import Roles from './collections/core/Roles'; // New import
import AuditLogs from './collections/AuditLogs';

// Billing and Finance Collections
import Invoices from './collections/Invoices';
import Payments from './collections/Payments';
import Expenses from './collections/Expenses';
import Media from './collections/Media'; // New import for Media collection

// CRM and Sales Collections
import Buildings from './collections/Buildings';
import BuildingUnits from './collections/BuildingUnits';
import Leads from './collections/Leads';

// Operations and Network Management Collections
import Subscribers from './collections/Subscribers';
import Resources from './collections/Resources';
import IpSubnets from './collections/IpSubnets';
import IpAddresses from './collections/IpAddresses';
import WorkOrders from './collections/WorkOrders';

// Support and Communications Collections
import Tickets from './collections/Tickets';
import Messages from './collections/Messages';
import Contacts from './collections/Contacts';
import MessageTemplates from './collections/MessageTemplates';

import whatsappLeadEndpoint from './endpoints/whatsappLeadEndpoint';
import billingCronEndpoint from './endpoints/billingCronEndpoint';
import mpesaCallbackEndpoint from './endpoints/mpesaCallbackEndpoint';
import mpesaInitiatePaymentEndpoint from './endpoints/mpesaInitiatePaymentEndpoint'; // New import
import zabbixWebhookEndpoint from './endpoints/zabbixWebhookEndpoint';
import sendManualMessageEndpoint from './endpoints/sendManualMessageEndpoint';
import sendBulkMessageEndpoint from './endpoints/sendBulkMessageEndpoint';

import { payloadCloud } from '@payloadcms/plugin-cloud';
import BeforeDashboard from './components/BeforeDashboard';

export default buildConfig({
  cors: ['http://localhost:3002'],
  admin: {
    user: Staff.slug,
    
    components: {
      beforeDashboard: [BeforeDashboard],
    }
  },
  endpoints: [
    whatsappLeadEndpoint,
    billingCronEndpoint,
    mpesaCallbackEndpoint,
    mpesaInitiatePaymentEndpoint, // New endpoint
    zabbixWebhookEndpoint,
    sendManualMessageEndpoint,
    sendBulkMessageEndpoint,
  ],
  collections: [
    AuditLogs,
    Staff,
    Roles, // New collection
    Plans,
    Partners,
    Invoices,
    Payments,
    Expenses,
    Media, // New Media collection
    Buildings,
    BuildingUnits,
    Leads,
    Subscribers,
    Resources,
    IpSubnets,
    IpAddresses,
    WorkOrders,
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
