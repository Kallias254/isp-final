import { Payload } from 'payload';

export const seed = async (payload: Payload) => {
  let adminRole = await payload.create({
    collection: 'roles',
    data: {
      name: 'Admin',
      permissions: [
        { collection: 'roles', read: true, create: true, update: true, delete: true },
        { collection: 'staff', read: true, create: true, update: true, delete: true },
        { collection: 'companies', read: true, create: true, update: true, delete: true },
        { collection: 'subscribers', read: true, create: true, update: true, delete: true },
        { collection: 'invoices', read: true, create: true, update: true, delete: true },
        { collection: 'tickets', read: true, create: true, update: true, delete: true },
        { collection: 'plans', read: true, create: true, update: true, delete: true },
        { collection: 'buildings', read: true, create: true, update: true, delete: true },
        { collection: 'buildingUnits', read: true, create: true, update: true, delete: true },
        { collection: 'leads', read: true, create: true, update: true, delete: true },
        { collection: 'payments', read: true, create: true, update: true, delete: true },
        { collection: 'expenses', read: true, create: true, update: true, delete: true },
        { collection: 'partners', read: true, create: true, update: true, delete: true },
        { collection: 'contacts', read: true, create: true, update: true, delete: true },
        { collection: 'messages', read: true, create: true, update: true, delete: true },
        { collection: 'messageTemplates', read: true, create: true, update: true, delete: true },
        { collection: 'work-orders', read: true, create: true, update: true, delete: true },
        { collection: 'ipSubnets', read: true, create: true, update: true, delete: true },
        { collection: 'ipAddresses', read: true, create: true, update: true, delete: true },
        { collection: 'network-devices', read: true, create: true, update: true, delete: true },
        { collection: 'service-locations', read: true, create: true, update: true, delete: true },
        { collection: 'crisis-events', read: true, create: true, update: true, delete: true },
        { collection: 'audit-logs', read: true, create: true, update: true, delete: true },
        { collection: 'media', read: true, create: true, update: true, delete: true },
      ],
    },
  });
  payload.logger.info('Admin role seeded.');

  let company = await payload.create({
    collection: 'companies',
    data: {
      name: 'Vantage',
    },
  });
  payload.logger.info('Vantage company seeded.');

  await payload.create({
    collection: 'staff',
    data: {
      email: 'admin@vantage.co.ke',
      password: 'password',
      fullName: 'Vantage Admin',
      assignedRole: adminRole.id,
      ispOwner: company.id,
      status: 'active',
    },
  });
  payload.logger.info('Admin user seeded.');

  // Seed Plans
  const plan1 = await payload.create({
    collection: 'plans',
    data: {
      name: 'Basic Home 50 Mbps',
      downloadSpeed: 50,
      uploadSpeed: 20,
      price: 1500,
      billingCycle: 'monthly',
      notes: 'Standard home internet plan.',
      planEnabled: true,
      activeForNewSignups: true,
      ipAssignmentType: 'dynamic',
      ispOwner: company.id,
    },
  });
  payload.logger.info('Plan 1 seeded.');

  const plan2 = await payload.create({
    collection: 'plans',
    data: {
      name: 'Pro Business 200 Mbps',
      downloadSpeed: 200,
      uploadSpeed: 100,
      price: 5000,
      billingCycle: 'monthly',
      notes: 'High-speed business internet.',
      planEnabled: true,
      activeForNewSignups: true,
      ipAssignmentType: 'static-public',
      ispOwner: company.id,
    },
  });
  payload.logger.info('Plan 2 seeded.');

  // Seed Subscribers
  await payload.create({
    collection: 'subscribers',
    data: {
      ispOwner: company.id,
      accountNumber: 'SUB001',
      firstName: 'Alice',
      lastName: 'Smith',
      contactPhone: '+254712345678',
      email: 'alice.smith@example.com',
      status: 'active',
      servicePlan: plan1.id,
      billingCycle: 'monthly',
      nextDueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      accountBalance: 0,
    },
  });
  payload.logger.info('Subscriber 1 seeded.');

  await payload.create({
    collection: 'subscribers',
    data: {
      ispOwner: company.id,
      accountNumber: 'SUB002',
      firstName: 'Bob',
      lastName: 'Johnson',
      contactPhone: '+254723456789',
      email: 'bob.johnson@example.com',
      status: 'pending-installation',
      servicePlan: plan2.id,
      billingCycle: 'quarterly',
      nextDueDate: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString(),
      accountBalance: 0,
    },
  });
  payload.logger.info('Subscriber 2 seeded.');

  // Seed Buildings
  const building1 = await payload.create({
    collection: 'buildings',
    data: {
      name: 'Tech Hub Tower',
      address: '123 Tech Lane, Nairobi',
      status: 'active',
      ispOwner: company.id,
    },
  });
  payload.logger.info('Building 1 seeded.');

  const building2 = await payload.create({
    collection: 'buildings',
    data: {
      name: 'Innovation Center',
      address: '456 Innovation Drive, Nairobi',
      status: 'prospecting',
      ispOwner: company.id,
    },
  });
  payload.logger.info('Building 2 seeded.');

  // Seed BuildingUnits
  await payload.create({
    collection: 'buildingUnits',
    data: {
      unitNumber: 'A101',
      building: building1.id,
      status: 'vacant',
      ispOwner: company.id,
    },
  });
  payload.logger.info('Building Unit 1 seeded.');

  await payload.create({
    collection: 'buildingUnits',
    data: {
      unitNumber: 'B205',
      building: building2.id,
      status: 'occupied',
      ispOwner: company.id,
    },
  });
  payload.logger.info('Building Unit 2 seeded.');

  // Seed Leads
  await payload.create({
    collection: 'leads',
    data: {
      ispOwner: company.id,
      subscriberName: 'Charlie Brown',
      subscriberPhone: '+254733445566',
      status: 'new',
      leadSource: 'direct',
      preferredPlan: plan1.id,
      serviceLocation: 'Apartment C3, Tech Hub Tower',
    },
  });
  payload.logger.info('Lead 1 seeded.');

  await payload.create({
    collection: 'leads',
    data: {
      ispOwner: company.id,
      subscriberName: 'Diana Prince',
      subscriberPhone: '+254744556677',
      status: 'contacted',
      leadSource: 'marketing-campaign',
      preferredPlan: plan2.id,
      serviceLocation: 'Office 10, Innovation Center',
    },
  });
  payload.logger.info('Lead 2 seeded.');
};