const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('OK');
});


// Endpoint to simulate STK Push initiation from Payload CMS
app.post('/api/initiate-stk', (req, res) => {
  console.log('--- M-Pesa Mock Service: STK Push Initiation Request Received ---');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));

  const { amount, phoneNumber, accountReference, callbackUrl } = req.body;

  if (!amount || !phoneNumber || !accountReference || !callbackUrl) {
    console.error('Missing required fields in STK Push request');
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  console.log(`Simulating STK Push for ${phoneNumber} with amount ${amount} for account ${accountReference}`);

  // Simulate a successful STK Push response to Payload
  res.status(200).json({
    success: true,
    message: 'STK Push simulated successfully. Waiting for callback.',
    CheckoutRequestID: `ws_CO_` + Date.now(),
    CustomerMessage: 'Success. Please enter your M-Pesa PIN to complete the transaction.',
  });

  // --- Simulate M-Pesa Callback to Payload CMS after a delay ---
  // In a real scenario, Safaricom would send this callback.
  // Here, we simulate it for testing purposes.
  /*
    console.log('\n--- M-Pesa Mock Service: Simulating Callback to Payload CMS ---');
    const simulatedCallbackData = {
      Body: {
        stkCallback: {
          MerchantRequestID: `req_${Date.now()}`,
          CheckoutRequestID: `ws_CO_` + Date.now(),
          ResultCode: 0,
          ResultDesc: 'The service request is processed successfully.',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: amount },
              { Name: 'MpesaReceiptNumber', Value: `MPESA${Date.now()}` },
              { Name: 'TransactionDate', Value: '20250829120000' }, // Placeholder date
              { Name: 'PhoneNumber', Value: phoneNumber },
              { Name: 'BillRefNumber', Value: accountReference }, // Use accountReference as BillRefNumber
              { Name: 'TransID', Value: `TRANS${Date.now()}` },
              { Name: 'TransTime', Value: '20250829120000' },
              { Name: 'TransAmount', Value: amount },
              { Name: 'BusinessShortCode', Value: '600999' },
              { Name: 'OrgAccountBalance', Value: '99999.00' },
              { Name: 'ThirdPartyTransID', Value: 'T' + Date.now() },
              { Name: 'MSISDN', Value: phoneNumber },
              { Name: 'FirstName', Value: 'Mock' },
              { Name: 'MiddleName', Value: 'User' },
              { Name: 'LastName', Value: 'Test' },
            ],
          },
        },
      },
    };

    try {
      console.log('Sending callback to:', callbackUrl);
      const callbackRes = await axios.post(callbackUrl, simulatedCallbackData);

      if (callbackRes.ok) {
        console.log('Callback successfully sent to Payload CMS.');
      } else {
        const errorText = await callbackRes.text();
        console.error('Failed to send callback to Payload CMS:', callbackRes.status, errorText);
      }
    } catch (error) {
      console.error('Error during callback simulation:', error);
    }
  */
});

app.listen(PORT, '0.0.0.0', () => { // Listen on all network interfaces
  console.log(`M-Pesa Mock Service listening on port ${PORT}`);
  console.log(`STK Push Endpoint: http://0.0.0.0:${PORT}/api/initiate-stk`); // Updated log for clarity
});
