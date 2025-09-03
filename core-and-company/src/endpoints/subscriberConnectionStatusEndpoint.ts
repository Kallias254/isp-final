import { Endpoint } from 'payload/config';

const subscriberConnectionStatusEndpoint: Endpoint = {
  path: '/api/subscribers/:id/connection-status',
  method: 'get',
  handler: async (req, res) => {
    try {
      const subscriberId = req.params.id;
      const { payload } = req;

      // 1. Fetch the subscriber to get their CPE device
      const subscriber = await payload.findByID({
        collection: 'subscribers',
        id: subscriberId,
        depth: 1, // Ensure cpeDevice is populated
      });

      if (!subscriber) {
        return res.status(404).send({ error: 'Subscriber not found' });
      }

      if (!subscriber.cpeDevice || typeof subscriber.cpeDevice !== 'object') {
        return res.status(404).send({ error: 'Subscriber does not have an assigned CPE device' });
      }

      // 2. Use MonitoringService to get real-time metrics for the CPE device
      // TODO: Implement a method in MonitoringService to fetch real-time metrics from LibreNMS
      // For now, return dummy data
      const metrics = {
        status: 'Online',
        latency: '20ms',
        packetLoss: '0%',
        throughput: '50Mbps',
        signalQuality: '-60dBm',
      };

      return res.status(200).send(metrics);

    } catch (error: unknown) {
      req.payload.logger.error(`Error fetching subscriber connection status: ${(error as Error).message}`);
      return res.status(500).send({ error: 'Internal server error' });
    }
  },
};

export default subscriberConnectionStatusEndpoint;
