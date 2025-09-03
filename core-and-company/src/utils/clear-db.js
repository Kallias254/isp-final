const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://mongodb:27017';
const client = new MongoClient(mongoUrl);

async function run() {
  let retries = 15;
  console.log('Starting DB clear script...');
  while (retries > 0) {
    try {
      await client.connect();
      // console.log('MongoDB connection successful. Pinging...');
      await client.db('admin').command({ ping: 1 });
      // console.log('Ping successful. MongoDB is ready.');
      break; // Exit loop on success
    } catch (e) {
      retries--;
      console.log(`Waiting for MongoDB... (${15 - retries})`);
      if (retries === 0) {
        console.error('Could not connect to MongoDB after multiple retries.', e);
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 2000));
    }
  }

  try {
    console.log('Clearing database...');
    const dbs = await client.db().admin().listDatabases();
    const userDbs = dbs.databases.filter(db => !['admin', 'local', 'config'].includes(db.name));

    for (const dbInfo of userDbs) {
      if (dbInfo.name) {
        console.log(`Dropping database: ${dbInfo.name}`);
        const db = client.db(dbInfo.name);
        await db.dropDatabase();
      }
    }
    console.log('Database cleared successfully.');
  } catch (err) {
    console.error('Error clearing database:', err);
    // process.exit(1); // Don't exit on error, allow payload to start
  } finally {
    await client.close();
    // console.log('MongoDB connection closed.');
  }
}

run();
