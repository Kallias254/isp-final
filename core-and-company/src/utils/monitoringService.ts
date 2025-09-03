import { Payload } from 'payload';
import axios, { AxiosInstance } from 'axios';
import { NetworkDevice, Subscriber, Ticket } from '../payload-types';
import { PayloadRequest } from 'payload/dist/types';

class MonitoringService {
  private axiosInstance: AxiosInstance;
  private static instance: MonitoringService;
  private payload: Payload | null = null;

  private constructor() {
    const libreNmsUrl = process.env.LIBRENMS_API_URL;
    const libreNmsApiKey = process.env.LIBRENMS_API_KEY;

    if (!libreNmsUrl || !libreNmsApiKey) {
      console.warn('LibreNMS API URL or Key is not configured. MonitoringService may not function correctly.');
      this.axiosInstance = axios.create();
    } else {
      this.axiosInstance = axios.create({
        baseURL: libreNmsUrl,
        headers: {
          'X-Auth-Token': libreNmsApiKey,
        },
      });
      console.log('MonitoringService initialized with LibreNMS configuration.');
    }
  }

  // Allows the payload instance to be injected after initialization
  public init(payload: Payload) {
    this.payload = payload;
    console.log('MonitoringService dependency (Payload) injected.');
    this.getDevices().catch(err => console.error('Error testing LibreNMS connection on startup', err));
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // --- Public API Methods ---

  async getDevices(): Promise<any> {
    try {
      console.log('Fetching devices from LibreNMS...');
      const response = await this.axiosInstance.get('/devices');
      console.log(`Successfully fetched ${response.data.devices.length} devices from LibreNMS.`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch devices from LibreNMS:', error.response?.data || error.message);
      } else {
        console.error('An unexpected error occurred while fetching devices from LibreNMS', error);
      }
      throw error;
    }
  }

  async getDeviceStatus(deviceId: string): Promise<any> {
    console.log(`Fetching status for device ${deviceId}...`);
    const mockStatus = {
      status: 'Online',
      latency: `${Math.floor(Math.random() * 20) + 5}ms`,
      packetLoss: `${Math.floor(Math.random() * 2)}%`,
      liveThroughput: {
        download: `${(Math.random() * 10).toFixed(2)} Mbps`,
        upload: `${(Math.random() * 5).toFixed(2)} Mbps`,
      },
      signalQuality: `${-Math.floor(Math.random() * 20) + -50} dBm`,
    };
    return Promise.resolve(mockStatus);
  }

  async handleWebhook(req: PayloadRequest): Promise<void> {
    if (!this.payload) {
      console.error('Payload instance not available in MonitoringService. Cannot handle webhook.');
      return;
    }
    const payload = this.payload;
    payload.logger.info('Monitoring webhook received');

    const deviceIp = req.body?.deviceIp;

    if (!deviceIp) {
      payload.logger.error('Monitoring webhook: deviceIp not found in payload.');
      return;
    }

    const devices = await payload.find({
      collection: 'ipAddresses',
      where: { ipAddress: { equals: deviceIp } },
      depth: 1,
      limit: 1,
    });

    const rootIpAddress = devices.docs[0];

    if (!rootIpAddress || !rootIpAddress.assignedDevice || typeof rootIpAddress.assignedDevice !== 'object') {
      payload.logger.error(`Monitoring webhook: NetworkDevice not found for IP ${deviceIp}.`);
      return;
    }

    const rootDevice = rootIpAddress.assignedDevice as NetworkDevice;
    const affectedSubscriberIds = await this.getAffectedSubscribers(rootDevice.id);
    const affectedSubscriberCount = affectedSubscriberIds.length;
    const affectedSubscriberList = affectedSubscriberIds.join(', ');

    const crisisEvent = await payload.create({
      collection: 'crisis-events',
      data: {
        rootCauseDevice: rootDevice.id,
        affectedSubscribers: affectedSubscriberIds,
        status: 'ongoing',
        description: `Outage detected for ${rootDevice.deviceName}. Affects ${affectedSubscriberCount} subscribers.`,
        startTime: new Date().toISOString(),
        ispOwner: rootDevice.ispOwner,
      },
    });

    payload.logger.info(`CrisisEvent ${crisisEvent.id} created for device ${rootDevice.deviceName}.`);

    const ticketData: Partial<Ticket> = {
      ticketID: `TKT-CRISIS-${Date.now()}`,
      subject: `Network Alert: Device '${rootDevice.deviceName}' is Offline.`,
      description: `Outage detected for ${rootDevice.deviceName}. Affects ${affectedSubscriberCount} subscribers. Crisis ID: ${crisisEvent.id}`,
      status: 'open',
      priority: 'high',
      ispOwner: rootDevice.ispOwner,
    };

    if (affectedSubscriberIds.length > 0) {
      ticketData.subscriber = affectedSubscriberIds[0];
    }

    await payload.create({ collection: 'tickets', data: ticketData as Ticket });
    payload.logger.info(`High-priority Ticket created for device ${rootDevice.deviceName}.`);
  }

  async getAffectedSubscribers(rootDeviceId: string): Promise<string[]> {
    if (!this.payload) return [];
    const payload = this.payload;
    const affectedDeviceIds = new Set<string>();
    const affectedSubscriberIds = new Set<string>();
    const queue: string[] = [rootDeviceId];

    while (queue.length > 0) {
      const currentDeviceId = queue.shift();
      if (!currentDeviceId || affectedDeviceIds.has(currentDeviceId)) continue;
      affectedDeviceIds.add(currentDeviceId);

      const currentDevice = await payload.findByID({ collection: 'network-devices', id: currentDeviceId }) as NetworkDevice;
      if (!currentDevice) continue;

      if (currentDevice.deviceType === 'cpe') {
        const subscriberResult = await payload.find({ collection: 'subscribers', where: { cpeDevice: { equals: currentDevice.id } }, limit: 1 });
        if (subscriberResult.docs.length > 0) {
          affectedSubscriberIds.add(subscriberResult.docs[0].id);
        }
      }

      const childDevicesResult = await payload.find({ collection: 'network-devices', where: { parentDevice: { equals: currentDeviceId } } });
      for (const child of childDevicesResult.docs) {
        if (!affectedDeviceIds.has(child.id)) queue.push(child.id);
      }
    }
    return Array.from(affectedSubscriberIds);
  }
}

export const monitoringService = MonitoringService.getInstance();