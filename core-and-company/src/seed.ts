import payload from 'payload';
import dotenv from 'dotenv';
import path from 'path';
import { Role, Plan, Subscriber, Invoice, Ticket, Expense } from './payload-types';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const seed = async () => {
  try { // Added try...catch around the entire seed function
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || '',
      mongoURL: process.env.MONGODB_URI || '',
      local: true, // Use local mode for seeding
    });

    payload.logger.info('Seeding data...');

    // 1. Create Roles
    const adminRole = await payload.find({
      collection: 'roles',
      where: {
        name: {
          equals: 'Admin',
        },
      },
    });

    let adminRoleId;
    if (adminRole.docs.length === 0) {
      const newAdminRole = await payload.create({
        collection: 'roles',
        data: {
          name: 'Admin',
          permissions: [
            // Grant all permissions for Admin role
            
            { collection: 'staff', read: true, create: true, update: true, delete: true },
            { collection: 'roles', read: true, create: true, update: true, delete: true },
            { collection: 'plans', read: true, create: true, update: true, delete: true },
            { collection: 'partners', read: true, create: true, update: true, delete: true },
            { collection: 'invoices', read: true, create: true, update: true, delete: true },
            { collection: 'payments', read: true, create: true, update: true, delete: true },
            { collection: 'expenses', read: true, create: true, update: true, delete: true },
            { collection: 'media', read: true, create: true, update: true, delete: true },
            { collection: 'buildings', read: true, create: true, update: true, delete: true },
            { collection: 'buildingUnits', read: true, create: true, update: true, delete: true },
            { collection: 'leads', read: true, create: true, update: true, delete: true },
            { collection: 'subscribers', read: true, create: true, update: true, delete: true },
            { collection: 'resources', read: true, create: true, update: true, delete: true },
            { collection: 'ipSubnets', read: true, create: true, update: true, delete: true },
            { collection: 'ipAddresses', read: true, create: true, update: true, delete: true },
            { collection: 'workOrders', read: true, create: true, update: true, delete: true },
            { collection: 'tickets', read: true, create: true, update: true, delete: true },
            { collection: 'messages', read: true, create: true, update: true, delete: true },
            { collection: 'contacts', read: true, create: true, update: true, delete: true },
            { collection: 'messageTemplates', read: true, create: true, update: true, delete: true },
          ],
        },
      });
      adminRoleId = newAdminRole.id;
      payload.logger.info('Admin role created.');
    } else {
      adminRoleId = adminRole.docs[0].id;
      payload.logger.info('Admin role already exists.');
    }

    // 2. Create Users (Admin and regular)
    const adminUser = await payload.find({
      collection: 'staff', // Changed to 'staff'
      where: {
        email: {
          equals: 'admin@example.com',
        },
      },
    });

    if (adminUser.docs.length === 0) {
      await payload.create({
        collection: 'staff', // Changed to 'staff'
        data: {
          email: 'admin@example.com',
          password: 'password',
          fullName: 'Admin User', // Added required field
          status: 'active',      // Added required field
          assignedRole: adminRoleId, // Assign the Admin role
        },
      });
      payload.logger.info('Admin user created.');
    } else {
      payload.logger.info('Admin user already exists.');
    }

    const testAdminUser = await payload.find({
        collection: 'staff',
        where: {
            email: {
                equals: 'testadmin@example.com',
            },
        },
    });

    if (testAdminUser.docs.length === 0) {
        await payload.create({
            collection: 'staff',
            data: {
                email: 'testadmin@example.com',
                password: 'password',
                fullName: 'Test Admin User',
                status: 'active',
                assignedRole: adminRoleId,
            },
        });
        payload.logger.info('Test admin user created.');
    } else {
        payload.logger.info('Test admin user already exists.');
    }

    // 3. Create Plans
    const monthlyPlan = await payload.create({
      collection: 'plans',
      data: {
        name: 'Basic Monthly',
        price: 1500,
        billingCycle: 'monthly',
        downloadSpeed: 10,
        uploadSpeed: 10,
        ipAssignmentType: 'dynamic', // Added required field
      },
    });
    payload.logger.info('Monthly plan created.');

    const quarterlyPlan = await payload.create({
      collection: 'plans',
      data: {
        name: 'Standard Quarterly',
        price: 4000,
        billingCycle: 'quarterly',
        downloadSpeed: 25,
        uploadSpeed: 25,
        ipAssignmentType: 'dynamic', // Added required field
      },
    });
    payload.logger.info('Quarterly plan created.');

    // 4. Create Subscribers
    const subscriber1 = await payload.create({
      collection: 'subscribers',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        accountNumber: `SUB001-${Date.now()}`,
        mpesaNumber: '254712345678',
        contactPhone: '254712345678',
        email: 'john.doe@example.com',
        status: 'active',
        servicePlan: monthlyPlan.id,
        billingCycle: 'monthly',
        nextDueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        accountBalance: 0,
        deviceToken: 'test-device-token-john',
        upfrontCharges: [], // Added required field
      },
    });
    payload.logger.info('Subscriber 1 created.');

    const subscriber2 = await payload.create({
      collection: 'subscribers',
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        accountNumber: `SUB002-${Date.now()}`,
        mpesaNumber: '254722334455',
        contactPhone: '254722334455',
        email: 'jane.smith@example.com',
        status: 'suspended',
        servicePlan: quarterlyPlan.id,
        billingCycle: 'quarterly',
        nextDueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // Overdue
        accountBalance: 4000, // Overdue amount
        deviceToken: 'test-device-token-jane',
        upfrontCharges: [], // Added required field
      },
    });
    payload.logger.info('Subscriber 2 created (suspended).');

    // 4. Create Invoices
    await payload.create({
      collection: 'invoices',
      data: {
        invoiceNumber: `INV-SUB001-001-${Date.now()}`,
        subscriber: subscriber1.id,
        amountDue: 1500,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        status: 'unpaid',
        lineItems: [
          { description: 'Monthly Internet Service', quantity: 1, price: 1500 },
        ],
    },
  });
  payload.logger.info('Invoice for SUB001 created.');

  await payload.create({
    collection: 'invoices',
    data: {
      invoiceNumber: `INV-SUB002-001-${Date.now()}`,
      subscriber: subscriber2.id,
      amountDue: 4000,
      dueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      status: 'overdue',
      lineItems: [
        { description: 'Quarterly Internet Service', quantity: 1, price: 4000 },
      ],
    },
  });
  payload.logger.info('Overdue Invoice for SUB002 created.');

  // 5. Create Tickets
  await payload.create({
    collection: 'tickets',
    data: {
      ticketID: `TKT001-${Date.now()}`,
      subscriber: subscriber1.id,
      subject: 'Internet intermittent',
      description: [
        {
          children: [
            {
              text: 'Internet connection keeps dropping every few minutes.',
            },
          ],
          type: 'p',
        },
      ],
      status: 'open',
      priority: 'high',
    },
  });
  payload.logger.info('Ticket TKT001 created.');

  await payload.create({
    collection: 'tickets',
    data: {
      ticketID: `TKT002-${Date.now()}`,
      subscriber: subscriber2.id,
      subject: 'Cannot access certain websites',
      description: [
        {
          children: [
            {
              text: 'Some websites are not loading, others are fine.',
            },
          ],
          type: 'p',
        },
      ],
      status: 'in-progress',
      priority: 'medium',
    },
  });
  payload.logger.info('Ticket TKT002 created.');

  // 6. Create Expenses
  await payload.create({
    collection: 'expenses',
    data: {
      expenseDate: new Date().toISOString(),
      category: 'equipment',
      vendor: 'Router Supplier',
      amount: 5000,
      description: 'Purchase of 10 new routers',
      // receipt: (assuming media collection is populated with an ID)
    },
  });
  payload.logger.info('Expense created.');

  payload.logger.info('Seeding complete!');
  process.exit(0); // Exit successfully
  } catch (error: any) {
    console.error(`Error during seeding: ${error.message}`); // Use console.error for absolute fallback
    process.exit(1);
  }
};

seed();