import { Payload } from 'payload';
import { Endpoint } from 'payload/config';

const mpesaInitiatePaymentEndpoint: Endpoint = {
  path: '/mpesa-initiate-payment',
  method: 'post',
  handler: async (req, res) => {
    const payload: Payload = req.payload;
    const { subscriberId, invoiceId, amount, phoneNumber } = req.body;
    payload.logger.info(`Initiating M-Pesa payment with subscriberId: ${subscriberId}, invoiceId: ${invoiceId}`);

    if (!subscriberId && !invoiceId) {
      payload.logger.error('Missing subscriberId or invoiceId for payment initiation');
      return res.status(400).json({ message: 'Missing subscriberId or invoiceId' });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      payload.logger.error('Invalid amount for payment initiation');
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!phoneNumber) {
      payload.logger.error('Missing phoneNumber for payment initiation');
      return res.status(400).json({ message: 'Missing phoneNumber' });
    }

    try {
      let subscriber;
      let invoice; // Declare invoice here
      if (subscriberId) {
        subscriber = await payload.findByID({
          collection: 'subscribers',
          id: subscriberId,
        });
      } else if (invoiceId) {
        invoice = await payload.findByID({
          collection: 'invoices',
          id: invoiceId,
        });
        if (invoice && invoice.subscriber) {
          subscriber = await payload.findByID({
            collection: 'subscribers',
            id: typeof invoice.subscriber === 'object' ? invoice.subscriber.id : invoice.subscriber,
          });
        }
      }

      if (!subscriber) {
        payload.logger.error(`Subscriber not found for ID: ${subscriberId || invoiceId}`);
        return res.status(404).json({ message: `Subscriber not found` });
      }

      const mpesaServiceResponse = await fetch('http://mpesa-service:5000/api/initiate-stk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'your-secret-api-key-here',
        },
        body: JSON.stringify({
          amount: amount,
          phoneNumber: phoneNumber,
          accountReference: invoice ? invoice.invoiceNumber : subscriber.accountNumber,
          callbackUrl: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/mpesa-callback`,
        }),
      });

      const data = await mpesaServiceResponse.json();

      if (!mpesaServiceResponse.ok) {
        payload.logger.error(`M-Pesa Service error: ${data.message}`);
        return res.status(mpesaServiceResponse.status).json({ message: 'M-Pesa Service error', error: data.message });
      }

      payload.logger.info(`M-Pesa STK Push initiated for subscriber ${subscriber.id} with amount ${amount}`);
      return res.status(200).json({ message: 'M-Pesa STK Push initiated successfully' });
    } catch (error: unknown) {
      payload.logger.error(`Error initiating M-Pesa payment: ${(error as Error).message}`);
      return res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
  },
};

export default mpesaInitiatePaymentEndpoint;
