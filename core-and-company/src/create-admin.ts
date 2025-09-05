import payload from 'payload';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const createAdmin = async () => {
  process.env.PAYLOAD_CONFIG_PATH = path.resolve(__dirname, './payload.config.ts');

  await payload.init({
    local: true,
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/payload',
  });

  try {
    // Create Admin Role
    const adminRole = await payload.create({
      collection: 'roles',
      data: {
        name: 'Admin',
        permissions: [
          { collection: 'roles', read: true, create: true, update: true, delete: true },
          { collection: 'staff', read: true, create: true, update: true, delete: true },
          { collection: 'companies', read: true, create: true, update: true, delete: true },
          { collection: 'plans', read: true, create: true, update: true, delete: true },
          { collection: 'partners', read: true, create: true, update: true, delete: true },
          { collection: 'subscribers', read: true, create: true, update: true, delete: true },
          { collection: 'leads', read: true, create: true, update: true, delete: true },
          { collection: 'buildings', read: true, create: true, update: true, delete: true },
          { collection: 'buildingUnits', read: true, create: true, update: true, delete: true },
          { collection: 'invoices', read: true, create: true, update: true, delete: true },
          { collection: 'payments', read: true, create: true, update: true, delete: true },
          { collection: 'expenses', read: true, create: true, update: true, delete: true },
          { collection: 'service-locations', read: true, create: true, update: true, delete: true },
          { collection: 'network-devices', read: true, create: true, update: true, delete: true },
          { collection: 'ipSubnets', read: true, create: true, update: true, delete: true },
          { collection: 'ipAddresses', read: true, create: true, update: true, delete: true },
          { collection: 'work-orders', read: true, create: true, update: true, delete: true },
          { collection: 'crisis-events', read: true, create: true, update: true, delete: true },
          { collection: 'tickets', read: true, create: true, update: true, delete: true },
          { collection: 'messages', read: true, create: true, update: true, delete: true },
          { collection: 'contacts', read: true, create: true, update: true, delete: true },
          { collection: 'messageTemplates', read: true, create: true, update: true, delete: true },
          { collection: 'audit-logs', read: true, create: false, update: false, delete: false },
          { collection: 'media', read: true, create: true, update: true, delete: true },
        ],
      },
    });
    console.log('Admin role created.');

    // Create Company
    const company = await payload.create({
      collection: 'companies',
      data: {
        name: 'Vantage',
      },
    });
    console.log('Company created.');

    // Create Admin User
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
    console.log('Admin user created.');

    console.log('Superadmin and ISP admin created successfully!');
  } catch (error) {
    console.error('Error creating superadmin and ISP admin:', error);
  } finally {
    // payload.shutdown(); // Removed shutdown call
  }
};

createAdmin();