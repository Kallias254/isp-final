import { Endpoint } from 'payload/config';
import { monitoringService } from '../utils/monitoringService';

export const getSubscriberConnectionStatus: Endpoint = {
  path: '/subscribers/:id/connection-status',
  method: 'get',
  custom: {
    public: true,
  },
  handler: async (req, res, next) => {
    const { payload, params } = req;

    const subscribers = await payload.find({ collection: 'subscribers' });
    console.log('All subscribers:', JSON.stringify(subscribers, null, 2));

    console.log('Fetching connection status for subscriber with id:', params.id, typeof params.id);

    if (!params.id) {
      return res.status(400).json({ error: 'Subscriber ID is required' });
    }

    try {
      const subscriber = await payload.findByID({
        collection: 'subscribers',
        id: params.id,
        depth: 1, // to get the cpeDevice object
      });

      if (!subscriber) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }

      if (!subscriber.cpeDevice || typeof subscriber.cpeDevice !== 'object') {
        return res.status(404).json({ error: 'No CPE device assigned to this subscriber.' });
      }

      const cpeDevice = subscriber.cpeDevice;

      // Use the singleton monitoringService to get the device status
      const status = await monitoringService.getDeviceStatus(cpeDevice.id);

      return res.status(200).json(status);

    } catch (error) {
      payload.logger.error(error, `Error fetching connection status for subscriber ${params.id}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
