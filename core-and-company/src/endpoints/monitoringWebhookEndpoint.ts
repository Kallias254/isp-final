import { Endpoint } from 'payload/config';
import { Response } from 'express';
import { MonitoringService } from '../utils/monitoringService';
import { PayloadRequest } from 'payload/dist/types';

const monitoringWebhookEndpoint: Endpoint = {
  path: '/monitoring-webhook',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response) => {
    const payload = req.payload;
    try {
      const monitoringService = new MonitoringService(payload);
      await monitoringService.handleWebhook(req);
      res.status(200).send('Webhook received');
    } catch (error: unknown) {
      payload.logger.error(`Error in monitoring webhook: ${(error as Error).message}`);
      res.status(500).send('Internal Server Error');
    }
  },
};

export default monitoringWebhookEndpoint;
