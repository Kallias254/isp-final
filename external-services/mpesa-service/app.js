const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000; // Using a different port to avoid conflicts

app.use(bodyParser.json());

// --- DARAJA API CONFIGURATION (PLACEHOLDERS) ---
const DARAJA_API_BASE_URL = 'https://sandbox.safaricom.co.ke'; // Use sandbox for testing
const DARAJA_CONSUMER_KEY = process.env.DARAJA_CONSUMER_KEY || 'YOUR_CONSUMER_KEY';
const DARAJA_CONSUMER_SECRET = process.env.DARAJA_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET';
const DARAJA_BUSINESS_SHORT_CODE = process.env.DARAJA_BUSINESS_SHORT_CODE || '174379';
const DARAJA_PASSKEY = process.env.DARAJA_PASSKEY || 'YOUR_PASSKEY';

// --- UTILITY FUNCTIONS ---

/**
 * Gets an OAuth token from the Daraja API.
 */
const getDarajaToken = async () => {
  const auth = Buffer.from(`${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`).toString('base64');
  try {
    const response = await axios.get(`${DARAJA_API_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Daraja token:', error.response ? error.response.data : error.message);
    throw new Error('Could not retrieve Daraja API token.');
  }
};

/**
 * Sends the final, standardized callback to the main Payload CMS application.
 * @param {object} data - The data to send.
 */
const sendCallbackToPayload = async (data) => {
  const payloadCallbackUrl = process.env.PAYLOAD_CALLBACK_URL || 'http://payload:3000/api/mpesa-callback';
  console.log(`Sending final confirmation to Payload CMS at: ${payloadCallbackUrl}`);
  try {
    await axios.post(payloadCallbackUrl, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Successfully sent confirmation to Payload CMS.');
  } catch (error) {
    console.error('Error sending callback to Payload CMS:', error.response ? error.response.data : error.message);
  }
};

// --- API ENDPOINTS ---

/**
 * Endpoint to initiate an STK Push request.
 * Called by the main Payload application.
 */
app.post('/api/initiate-stk', async (req, res) => {
  console.log('--- STK Push Initiation Request Received ---');
  const { amount, phoneNumber, accountReference } = req.body;

  if (!amount || !phoneNumber || !accountReference) {
    return res.status(400).json({ success: false, message: 'Missing required fields: amount, phoneNumber, accountReference.' });
  }

  // --- SIMULATION MODE ---
  console.log('SIMULATION MODE: Bypassing real Daraja API call.');

  // 1. Immediately respond to the main Payload app that the request was accepted.
  res.status(200).json({
    success: true,
    message: 'STK Push initiated successfully (Simulation).',
    ResponseCode: "0",
    CustomerMessage: "Success. Request accepted for processing",
  });

  // 2. After a delay, simulate a callback from Daraja to this service's own callback URL.
  setTimeout(() => {
    console.log('SIMULATION: Triggering STK callback...');

    const simulatedDarajaCallback = {
      Body: {
        stkCallback: {
          MerchantRequestID: `MOCK_MERCH_${Date.now()}`,
          CheckoutRequestID: `MOCK_CHECKOUT_${Date.now()}`,
          ResultCode: 0,
          ResultDesc: 'The service request is processed successfully.',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: amount },
              { Name: 'MpesaReceiptNumber', Value: `MOCK_RCPT_${Date.now()}` },
              { Name: 'TransactionDate', Value: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3) },
              { Name: 'PhoneNumber', Value: phoneNumber },
              { Name: 'BillRefNumber', Value: accountReference },
            ],
          },
        },
      },
    };

    axios.post(`http://localhost:${PORT}/api/stk-callback`, simulatedDarajaCallback)
      .catch(error => {
        console.error('SIMULATION: Error sending simulated STK callback:', error.message);
      });

  }, 5000); // 5-second delay to mimic network latency
});

/**
 * Callback endpoint for the STK Push.
 * Called by the Daraja API.
 */
app.post('/api/stk-callback', (req, res) => {
  console.log('--- STK Push Callback Received ---');
  console.log(JSON.stringify(req.body, null, 2));

  const stkCallback = req.body.Body.stkCallback;

  // Acknowledge receipt to Daraja immediately
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  // Process the callback and send to Payload CMS
  if (stkCallback.ResultCode === 0) {
    console.log('STK Push was successful. Sending confirmation to Payload...');
    sendCallbackToPayload(req.body); // Forward the entire callback body
  } else {
    console.error('STK Push failed:', stkCallback.ResultDesc);
    // Optionally, you could still send a failure notification to Payload
  }
});

/**
 * C2B Confirmation URL.
 * Called by the Daraja API for Paybill payments.
 */
app.post('/api/c2b-confirmation', (req, res) => {
  console.log('--- C2B Confirmation Received ---');
  console.log(JSON.stringify(req.body, null, 2));

  // Acknowledge receipt to Daraja immediately
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  // Process the C2B data and send a standardized callback to Payload
  // Note: The C2B payload structure is different from STK Push.
  // We need to map it to the format our main Payload app expects.
  const standardizedData = {
    Body: {
      stkCallback: {
        MerchantRequestID: req.body.TransID, // Map fields
        CheckoutRequestID: req.body.TransID, // Map fields
        ResultCode: 0,
        ResultDesc: 'The service request is processed successfully.',
        CallbackMetadata: {
          Item: [
            { Name: 'Amount', Value: req.body.TransAmount },
            { Name: 'MpesaReceiptNumber', Value: req.body.TransID },
            { Name: 'TransactionDate', Value: req.body.TransTime },
            { Name: 'PhoneNumber', Value: req.body.MSISDN },
            { Name: 'BillRefNumber', Value: req.body.BillRefNumber },
          ],
        },
      },
    },
  };

  console.log('C2B payment was successful. Sending confirmation to Payload...');
  sendCallbackToPayload(standardizedData);
});

/**
 * C2B Validation URL.
 * Called by the Daraja API before processing a C2B payment.
 */
app.post('/api/c2b-validation', (req, res) => {
  console.log('--- C2B Validation Request Received ---');
  console.log(JSON.stringify(req.body, null, 2));

  // For now, we will accept all payments.
  // In a real scenario, you would validate the account number (BillRefNumber)
  // against your database before accepting.
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
});


app.get('/', (req, res) => {
  res.status(200).send('M-Pesa Service is running.');
});

app.listen(PORT, () => {
  console.log(`M-Pesa Service listening on port ${PORT}`);
});
