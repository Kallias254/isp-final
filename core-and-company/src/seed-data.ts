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
        throw new Error('Could not find company Vantage');
    }

    const companyId = company.docs[0].id;

    // Create IP Subnet
    const ipSubnet = await payload.create({
      collection: 'ipSubnets',
      data: {
        network: '10.10.0.0/24',
        description: 'Default Dynamic Pool',
        ispOwner: companyId,
      },
    });
    console.log('IP Subnet created.');

    // Create Service Plan
    await payload.create({
      collection: 'plans',
      data: {
        name: 'Home Basic 10Mbps',
        downloadSpeed: 10,
        uploadSpeed: 10,
        price: 2500,
        ipAssignmentType: 'dynamic-pool',
        dynamicIpPool: ipSubnet.id,
        ispOwner: companyId,
      },
    });
    console.log('Service plan created.');

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
};

seedData();
