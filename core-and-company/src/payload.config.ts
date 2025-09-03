import { buildConfig } from 'payload/config';
import path from 'path';
import { Staff } from './payload-types'; // Import Staff type
import { seed } from './seed';

// Import collections
import AuditLogs from './collections/AuditLogs';
import Buildings from './collections/Buildings';
import BuildingUnits from './collections/BuildingUnits';
import Contacts from './collections/Contacts';
import CrisisEvents from './collections/CrisisEvents';
import Expenses from './collections/Expenses';
import Invoices from './collections/Invoices';
import IpAddresses from './collections/IpAddresses';
import IpSubnets from './collections/IpSubnets';
import Leads from './collections/Leads';
import Media from './collections/Media';
import Messages from './collections/Messages';
import MessageTemplates from './collections/MessageTemplates';
import NetworkDevices from './collections/NetworkDevices';
import Partners from './collections/Partners';
import Payments from './collections/Payments';
import Plans from './collections/Plans';
import ServiceLocations from './collections/ServiceLocations';
import StaffCollection from './collections/Staff';
import Subscribers from './collections/Subscribers';
import Tickets from './collections/Tickets';
import WorkOrders from './collections/WorkOrders';
import Company from './collections/core/Company';
import Roles from './collections/core/Roles';

export default buildConfig({
  serverURL: 'http://localhost:3001',
  admin: {
    user: StaffCollection.slug,
  },
  collections: [
    AuditLogs,
    Buildings,
    BuildingUnits,
    Contacts,
    CrisisEvents,
    Expenses,
    Invoices,
    IpAddresses,
    IpSubnets,
    Leads,
    Media,
    Messages,
    MessageTemplates,
    NetworkDevices,
    Partners,
    Payments,
    Plans,
    ServiceLocations,
    StaffCollection,
    Subscribers,
    Tickets,
    WorkOrders,
    Company,
    Roles,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  // onInit: async (payload) => {
  //   await seed(payload);
  // },
});