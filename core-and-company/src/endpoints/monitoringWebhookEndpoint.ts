import { Endpoint } from 'payload/config';
import { MonitoringService } from '../utils/monitoringService';

const monitoringWebhookEndpoint: Endpoint = {
  path: '/api/monitoring/webhook',
  method: 'post',
  handler: async (req, res, next) => {
    try {
      const monitoringService = new MonitoringService(req.payload);
      await monitoringService.handleWebhook(req);
      res.status(200).send({ message: 'Webhook received' });
    } catch (error) {
      req.payload.logger.error(`Error in monitoring webhook: ${error.message}`);
      res.status(500).send({ error: 'Internal server error' });
    }
  },
};

export default monitoringWebhookEndpoint;
