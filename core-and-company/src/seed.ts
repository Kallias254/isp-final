import { Payload } from 'payload';

export const seed = async (payload: Payload) => {
  // Check if Admin role already exists
  const existingAdminRoles = await payload.find({
    collection: 'roles',
    where: {
      name: { equals: 'Admin' },
    },
    limit: 1,
  });

  let adminRole;
  if (existingAdminRoles.docs.length === 0) {
    adminRole = await payload.create({
      collection: 'roles',
      data: {
        name: 'Admin',
        permissions: [
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
  } else {
    adminRole = existingAdminRoles.docs[0];
    payload.logger.info('Admin role already exists, skipping seed.');
  }

  // Check if Company already exists
  const existingCompanies = await payload.find({
    collection: 'companies',
    where: {
      name: { equals: 'Vantage' },
    },
    limit: 1,
  });

  let company;
  if (existingCompanies.docs.length === 0) {
    company = await payload.create({
      collection: 'companies',
      data: {
        name: 'Vantage',
      },
    });
    payload.logger.info('Vantage company seeded.');
  } else {
    company = existingCompanies.docs[0];
    payload.logger.info('Vantage company already exists, skipping seed.');
  }

  // Check if Admin user already exists
  const existingAdminUsers = await payload.find({
    collection: 'staff',
    where: {
      email: { equals: 'admin@vantage.co.ke' },
    },
    limit: 1,
  });

  if (existingAdminUsers.docs.length === 0) {
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
  } else {
    payload.logger.info('Admin user already exists, skipping seed.');
  }
};