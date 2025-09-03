import { Payload } from 'payload';

export const seed = async (payload: Payload) => {
  await payload.create({
    collection: 'roles',
    data: {
      name: 'Admin',
      permissions: [
        { collection: 'users', read: true, create: true, update: true, delete: true },
        { collection: 'companies', read: true, create: true, update: true, delete: true },
        { collection: 'subscribers', read: true, create: true, update: true, delete: true },
        { collection: 'invoices', read: true, create: true, update: true, delete: true },
        { collection: 'tickets', read: true, create: true, update: true, delete: true },
        { collection: 'plans', read: true, create: true, update: true, delete: true },
        { collection: 'buildings', read: true, create: true, update: true, delete: true },
        { collection: 'building-units', read: true, create: true, update: true, delete: true },
        { collection: 'leads', read: true, create: true, update: true, delete: true },
        { collection: 'payments', read: true, create: true, update: true, delete: true },
        { collection: 'expenses', read: true, create: true, update: true, delete: true },
        { collection: 'partners', read: true, create: true, update: true, delete: true },
        { collection: 'contacts', read: true, create: true, update: true, delete: true },
        { collection: 'messages', read: true, create: true, update: true, delete: true },
        { collection: 'message-templates', read: true, create: true, update: true, delete: true },
        { collection: 'work-orders', read: true, create: true, update: true, delete: true },
        { collection: 'ip-subnets', read: true, create: true, update: true, delete: true },
        { collection: 'ip-addresses', read: true, create: true, update: true, delete: true },
        { collection: 'network-devices', read: true, create: true, update: true, delete: true },
        { collection: 'service-locations', read: true, create: true, update: true, delete: true },
        { collection: 'crisis-events', read: true, create: true, update: true, delete: true },
        { collection: 'audit-logs', read: true, create: true, update: true, delete: true },
        { collection: 'media', read: true, create: true, update: true, delete: true },
      ],
    },
  });

  const company = await payload.create({
    collection: 'companies',
    data: {
      name: 'Vantage',
    },
  });

  const adminRole = await payload.find({
    collection: 'roles',
    where: {
      name: { equals: 'Admin' },
    },
  });

  await payload.create({
    collection: 'staff',
    data: {
      email: 'admin@vantage.co.ke',
      password: 'password',
      fullName: 'Vantage Admin',
      assignedRole: adminRole.docs[0].id,
      ispOwner: company.id,
    },
  });
};