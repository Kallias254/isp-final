import { Endpoint } from 'payload/config';
import { Response } from 'express';
import { monitoringService } from '../utils/monitoringService';
import { PayloadRequest } from 'payload/dist/types';

const monitoringWebhookEndpoint: Endpoint = {
  path: '/monitoring-webhook',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response) => {
    try {
      // Use the singleton instance of the monitoring service
      await monitoringService.handleWebhook(req);
      res.status(200).send('Webhook received');
    } catch (error: unknown) {
      req.payload.logger.error(`Error in monitoring webhook: ${(error as Error).message}`);
      res.status(500).send('Internal Server Error');
    }
  },
};

export default monitoringWebhookEndpoint;