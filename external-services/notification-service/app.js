const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 6000; // Using a different port to avoid conflicts

app.use(bodyParser.json());

app.post('/send-notification', (req, res) => {
  console.log('--- Push Notification Request Received ---');
  const { deviceToken, title, body, data } = req.body;

  if (!deviceToken || !title || !body) {
    console.error('Missing required fields: deviceToken, title, body');
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  // --- SIMULATION MODE ---
  console.log('SIMULATION MODE: Logging notification instead of sending.');
  console.log(`  -> To: ${deviceToken}`);
  console.log(`  -> Title: ${title}`);
  console.log(`  -> Body: ${body}`);
  if (data) {
    console.log(`  -> Data: ${JSON.stringify(data, null, 2)}`);
  }
  console.log('-------------------------------------------');

  // In a real service, you would integrate with FCM, APN, etc. here.

  res.status(200).json({ success: true, message: 'Notification logged successfully (Simulation).' });
});

app.get('/', (req, res) => {
  res.status(200).send('Notification Service is running.');
});

app.listen(PORT, () => {
  console.log(`Notification Service listening on port ${PORT}`);
});
