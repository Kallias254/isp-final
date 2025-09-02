import { Payload } from 'payload';
import { Endpoint } from 'payload/config';
import { sendNotification } from '../utils/notificationService';

const sendBulkMessageEndpoint: Endpoint = {
  path: '/send-bulk-message',
  method: 'post',
  handler: async (req, res) => {
    const payload: Payload = req.payload;
    const { messageType, messageContent, audienceType, filters, contactPhoneNumbers } = req.body;
    const user = req.user; // The staff user sending the message

    if (!messageType || !messageContent || !audienceType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let recipients: any[] = [];

    try {
      if (audienceType === 'registered') {
        // Build query for Subscribers based on filters
        const whereClause: any = {};
        if (filters) {
          if (filters.plans && filters.plans.length > 0) {
            whereClause['servicePlan'] = { in: filters.plans };
          }
          if (filters.routers && filters.routers.length > 0) {
            whereClause['router'] = { in: filters.routers };
          }
          if (filters.buildings && filters.buildings.length > 0) {
            whereClause['serviceLocation.building'] = { in: filters.buildings };
          }
        }

        const subscribers = await payload.find({
          collection: 'subscribers',
          where: whereClause,
          limit: 0, // Fetch all matching subscribers
        });
        recipients = subscribers.docs.map(sub => sub.contactPhone || sub.email).filter(Boolean);

      } else if (audienceType === 'unregistered') {
        recipients = contactPhoneNumbers || [];
      } else {
        return res.status(400).json({ message: 'Invalid audience type' });
      }

      if (recipients.length === 0) {
        return res.status(200).json({ message: 'No recipients found for bulk message' });
      }

      // Create a single parent Message log for the bulk send
      const parentMessage = await payload.create({
        collection: 'messages',
        data: {
          recipient: 'Bulk Send',
          type: messageType,
          content: messageContent,
          status: 'sent',
          triggerEvent: 'bulk.send',
          sentBy: user ? user.id : undefined,
          bulkSend: true,
          ispOwner: user.ispOwner, // Assign ispOwner from the Staff user
        },
      });

      // Send notifications to each recipient
      for (const recipient of recipients) {
        await sendNotification({
          payload,
          recipient,
          type: messageType,
          content: messageContent,
          triggerEvent: 'bulk.send.individual',
          sentBy: user ? user.id : undefined,
          bulkSend: true,
          ispOwner: user.ispOwner, // Assign ispOwner from the Staff user
        });
      }

      return res.status(200).json({ message: `Bulk message sent to ${recipients.length} recipients` });
    } catch (error: any) {
      payload.logger.error(`Error sending bulk message: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },
};

export default sendBulkMessageEndpoint;
