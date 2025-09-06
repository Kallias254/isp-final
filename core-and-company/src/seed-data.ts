import payload from 'payload';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const seedData = async () => {
  process.env.PAYLOAD_CONFIG_PATH = path.resolve(__dirname, './payload.config.ts');

  await payload.init({
    local: true,
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/payload',
  });

  try {
    console.log('Seeding data...');

    // Get the company
    const company = await payload.find({
        collection: 'companies',
        where: { name: { equals: 'Vantage' } },
        limit: 1
    });

    if (company.docs.length === 0) {
        throw new Error('Could not find company Vantage. Please ensure the admin user has been created first.');
    }
    const companyId = company.docs[0].id;
    console.log('Found company Vantage.');

    // Create a default IP Subnet for the dynamic pool
    const ipSubnet = await payload.create({
        collection: 'ipSubnets',
        data: {
          network: '10.10.0.0/24',
          description: 'Default Dynamic Pool',
          ispOwner: companyId,
        },
      });
    console.log('- Default IP Subnet created.');

    // 1. Create Plans
    console.log('Creating service plans...');
    const pppoePlan = await payload.create({
      collection: 'plans',
      data: {
        name: 'Fibre 20Mbps PPPoE',
        downloadSpeed: 20,
        uploadSpeed: 20,
        price: 3500,
        ipAssignmentType: 'dynamic-pool',
        dynamicIpPool: ipSubnet.id,
        ispOwner: companyId,
      },
    });
    console.log('- PPPoE plan created.');

    const ipoePlan = await payload.create({
        collection: 'plans',
        data: {
          name: 'Business 50Mbps IPoE',
          downloadSpeed: 50,
          uploadSpeed: 50,
          price: 7000,
          ipAssignmentType: 'static-individual',
          ispOwner: companyId,
        },
      });
    console.log('- IPoE (Static IP) plan created.');

    // 2. Create Subscribers
    console.log('Creating subscribers...');
    await payload.create({
        collection: 'subscribers',
        data: {
            firstName: 'John',
            lastName: 'Doe',
            status: 'active',
            servicePlan: pppoePlan.id,
            ispOwner: companyId,
            accountNumber: `ACC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            mpesaNumber: '254712345678',
            nextDueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        }
    });
    console.log('- John Doe (PPPoE) created.');

    await payload.create({
        collection: 'subscribers',
        data: {
            firstName: 'Jane',
            lastName: 'Smith',
            status: 'active',
            servicePlan: ipoePlan.id,
            ispOwner: companyId,
            accountNumber: `ACC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            mpesaNumber: '254723456789',
            nextDueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        }
    });
    console.log('- Jane Smith (IPoE) created.');

    console.log('\nData seeded successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seedData();