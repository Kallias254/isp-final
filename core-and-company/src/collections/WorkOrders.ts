import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';

const WorkOrders: CollectionConfig = {
  slug: 'workOrders',
  admin: {
    useAsTitle: 'orderType',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'workOrders' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'workOrders' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'workOrders' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'workOrders' }),
  },
  fields: [
    {
      name: 'orderType',
      type: 'select',
      options: [
        { label: 'New Installation', value: 'new-installation' },
        { label: 'Repair', value: 'repair' },
        { label: 'Site Survey', value: 'site-survey' },
      ],
      required: true,
    },
    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'subscribers',
      hasMany: false,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      required: true,
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'staff',
      hasMany: false,
    },
    {
      name: 'notes',
      type: 'richText',
    },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, previousDoc }) => {
        // Check if WorkOrder is for New Installation and status changed to Completed
        if (
          doc.orderType === 'new-installation' &&
          doc.status === 'completed' &&
          previousDoc.status !== 'completed'
        ) {
          const payload = req.payload;
          const subscriberId = typeof doc.subscriber === 'object' ? doc.subscriber.id : doc.subscriber;

          // Fetch the full Subscriber record with servicePlan and assignedIp details
          const subscriber = await payload.findByID({
            collection: 'subscribers',
            id: subscriberId,
            depth: 2, // Fetch servicePlan and IpAddresses
          });

          if (!subscriber) {
            payload.logger.error(`Subscriber not found for WorkOrder ${doc.id}`);
            return doc;
          }

          const servicePlan = subscriber.servicePlan;

          if (!servicePlan || typeof servicePlan !== 'object' || !('ipAssignmentType' in servicePlan)) {
            payload.logger.error(`Service Plan or ipAssignmentType not found for Subscriber ${subscriber.id}`);
            return doc;
          }

          let assignedIpAddress = null;

          // IP Assignment Logic
          if (servicePlan.ipAssignmentType === 'static-public') {
            // Query for an Available IP from the plan's linked staticIpPool
            const ipSubnetId = typeof servicePlan.staticIpPool === 'object' ? servicePlan.staticIpPool.id : servicePlan.staticIpPool;

            const availableIps = await payload.find({
              collection: 'ipAddresses',
              where: {
                and: [
                  {
                    subnet: {
                      equals: ipSubnetId,
                    },
                  },
                  {
                    status: {
                      equals: 'available',
                    },
                  },
                ],
              },
              limit: 1,
            });

            const ipAddressToAssign = availableIps.docs[0];

            if (ipAddressToAssign) {
              // Update IP's status to Assigned and link it to the subscriber
              await payload.update({
                collection: 'ipAddresses',
                id: ipAddressToAssign.id,
                data: {
                  status: 'assigned',
                  assignedTo: subscriber.id,
                },
              });
              assignedIpAddress = ipAddressToAssign.ipAddress;
              payload.logger.info(`Assigned IP ${assignedIpAddress} to Subscriber ${subscriber.id}`);
            } else {
              payload.logger.error(`No available static IP found for Subscriber ${subscriber.id} in subnet ${ipSubnetId}`);
              // Consider changing WorkOrder status to 'Failed' or sending notification
              return doc;
            }
          }
          // For Dynamic IP, FreeRADIUS will handle assignment

          // Send API call to FreeRADIUS server
          // This is a placeholder. Actual FreeRADIUS integration would involve an HTTP client.
          try {
            // Example: axios.post('http://freeradius-api.example.com/reconnect', {
            //   username: subscriber.accountNumber,
            //   password: subscriber.radiusPassword, // Ensure this is securely handled
            //   ipAddress: assignedIpAddress,
            //   planDetails: {
            //     downloadSpeed: servicePlan.downloadSpeed,
            //     uploadSpeed: servicePlan.uploadSpeed,
            //   },
            // });
            payload.logger.info(`FreeRADIUS API call simulated for Subscriber ${subscriber.id}`);
          } catch (radiusError: any) {
            payload.logger.error(`Error calling FreeRADIUS API for Subscriber ${subscriber.id}: ${radiusError.message}`);
            // Consider changing WorkOrder status to 'Failed' or sending notification
            return doc;
          }

          // Change Subscriber status to Active
          await payload.update({
            collection: 'subscribers',
            id: subscriber.id,
            data: {
              status: 'active',
              assignedIp: assignedIpAddress, // Update assigned IP in subscriber record
            },
          });

          payload.logger.info(`Subscriber ${subscriber.id} status changed to Active.`);
        }
        return doc;
      },
    ],
  },
};

export default WorkOrders;
