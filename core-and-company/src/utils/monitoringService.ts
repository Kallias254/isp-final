import { Payload } from 'payload';
import { NetworkDevice, Subscriber, Ticket } from '../payload-types'; // Import necessary types

interface WebhookRequest {
  body: {
    deviceIp?: string;
  };
}

export class MonitoringService {
  private payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
  }

  async handleWebhook(req: WebhookRequest): Promise<void> {
    this.payload.logger.info('Monitoring webhook received');

    // 1. Extract the device IP from the webhook body (assuming LibreNMS sends 'deviceIp')
    const deviceIp = req.body.deviceIp; // This needs to be adapted to actual LibreNMS webhook payload

    if (!deviceIp) {
      this.payload.logger.error('Monitoring webhook: deviceIp not found in payload.');
      return;
    }

    // 2. Find the NetworkDevice associated with that IP
    const devices = await this.payload.find({
      collection: 'ipAddresses',
      where: {
        ipAddress: {
          equals: deviceIp,
        },
      },
      depth: 1, // Get assignedDevice details
      limit: 1,
    });

    const rootIpAddress = devices.docs[0];

    if (!rootIpAddress || !rootIpAddress.assignedDevice || typeof rootIpAddress.assignedDevice !== 'object') {
      this.payload.logger.error(`Monitoring webhook: NetworkDevice not found for IP ${deviceIp}.`);
      return;
    }

    const rootDevice = rootIpAddress.assignedDevice as NetworkDevice;

    // 3. Perform blast radius analysis
    const affectedSubscriberIds = await this.getAffectedSubscribers(rootDevice.id);

    const affectedSubscriberCount = affectedSubscriberIds.length;
    const affectedSubscriberList = affectedSubscriberIds.join(', ');

    // 4. Create CrisisEvent
    const crisisEvent = await this.payload.create({
      collection: 'crisis-events',
      data: {
        rootCauseDevice: rootDevice.id,
        affectedSubscribers: affectedSubscriberIds,
        status: 'ongoing',
        description: `Outage detected for ${rootDevice.deviceName} (${rootDevice.deviceType}). Affects ${affectedSubscriberCount} subscribers. Affected IDs: ${affectedSubscriberList}.`,
        startTime: new Date().toISOString(),
        ispOwner: rootDevice.ispOwner, // Assign ispOwner from the root device
      },
    });

    this.payload.logger.info(`CrisisEvent ${crisisEvent.id} created for device ${rootDevice.deviceName}.`);

    // 5. Create High-Priority Ticket
    const ticketData: Partial<Ticket> = {
      ticketID: `TKT-CRISIS-${Date.now()}`,
      subject: `Network Alert: Device '${rootDevice.deviceName}' is Offline. (${rootDevice.deviceType})`,
      description: [
        {
          children: [
            {
              text: `Outage detected for ${rootDevice.deviceName} (${rootDevice.deviceType}).\n`,
            },
            {
              text: `This device affects ${affectedSubscriberCount} subscribers.\n`,
            },
            {
              text: `Affected Subscriber IDs: ${affectedSubscriberList}.\n`,
            },
            {
              text: `Crisis Event ID: ${crisisEvent.id}.`,
            },
          ],
          type: 'p',
        },
      ],
      status: 'open',
      priority: 'high',
      ispOwner: rootDevice.ispOwner, // Assign ispOwner from the root device
    };

    if (affectedSubscriberIds.length > 0) {
      ticketData.subscriber = affectedSubscriberIds[0];
    }

    await this.payload.create({
      collection: 'tickets',
      data: ticketData,
    });

    this.payload.logger.info(`High-priority Ticket created for device ${rootDevice.deviceName}.`);
  }

  /**
   * Recursively finds all subscribers affected by a device outage.
   * @param rootDeviceId The ID of the NetworkDevice that went offline.
   * @returns A Promise resolving to an array of unique Subscriber IDs.
   */
  async getAffectedSubscribers(rootDeviceId: string): Promise<string[]> {
    const affectedDeviceIds = new Set<string>();
    const affectedSubscriberIds = new Set<string>();
    const queue: string[] = [rootDeviceId];

    while (queue.length > 0) {
      const currentDeviceId = queue.shift();
      if (!currentDeviceId || affectedDeviceIds.has(currentDeviceId)) {
        continue;
      }

      affectedDeviceIds.add(currentDeviceId);

      // Fetch the current device
      const currentDevice = await this.payload.findByID({
        collection: 'network-devices',
        id: currentDeviceId,
      }) as NetworkDevice;

      if (!currentDevice) {
        continue;
      }

      // If it's a CPE, find the associated subscriber
      if (currentDevice.deviceType === 'cpe') {
        const subscriber = await this.payload.find({
          collection: 'subscribers',
          where: {
            cpeDevice: {
              equals: currentDevice.id,
            },
          },
          limit: 1,
        }) as { docs: Subscriber[] };

        if (subscriber.docs.length > 0) {
          affectedSubscriberIds.add(subscriber.docs[0].id);
        }
      }

      // Find all devices whose parent is the current device
      const childDevices = await this.payload.find({
        collection: 'network-devices',
        where: {
          parentDevice: {
            equals: currentDeviceId,
          },
        },
      }) as { docs: NetworkDevice[] };

      for (const child of childDevices.docs) {
        if (!affectedDeviceIds.has(child.id)) {
          queue.push(child.id);
        }
      }
    }

    return Array.from(affectedSubscriberIds);
  }
}
