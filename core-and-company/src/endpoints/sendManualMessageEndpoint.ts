import { Payload } from 'payload';
import { Endpoint } from 'payload/config';
import { sendNotification } from '../utils/notificationService';
import { Subscriber } from '../payload-types'; // Import Subscriber type

const sendManualMessageEndpoint: Endpoint = {
  path: '/send-manual-message',
  method: 'post',
  handler: async (req, res) => {
    const payload: Payload = req.payload;
    const { ticketId, messageType, messageContent } = req.body;
    const user = req.user; // The staff user sending the message

    if (!ticketId || !messageType || !messageContent) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // 1. Fetch the Ticket to get the associated Subscriber's contact information
      const ticket = await payload.findByID({
        collection: 'tickets',
        id: ticketId,
        depth: 1, // Fetch subscriber details
      });

      if (!ticket || !ticket.subscriber) {
        payload.logger.error(`Ticket or Subscriber not found for ticket ID: ${ticketId}`);
        return res.status(404).json({ message: `Ticket or Subscriber not found for ticket ID: ${ticketId}` });
      }

      const subscriber = ticket.subscriber as Subscriber; // Cast to Subscriber type
      const recipient = subscriber.contactPhone || subscriber.email; // Prioritize phone, then email

      if (!recipient) {
        payload.logger.error(`No contact information found for Subscriber ${subscriber.id} associated with ticket ${ticketId}`);
        return res.status(400).json({ message: 'No contact information found for subscriber' });
      }

      // 2. Use the sendNotification utility to send the message
      await sendNotification({
        payload,
        recipient,
        type: messageType, // 'sms' or 'email'
        content: messageContent,
        triggerEvent: 'manual.reply',
        sentBy: user ? user.id : undefined, // Log the staff user who sent it
        ispOwner: typeof subscriber.ispOwner === 'object' ? subscriber.ispOwner.id : subscriber.ispOwner, // Assign ispOwner from the Subscriber
      });

      return res.status(200).json({ message: 'Manual message sent and logged successfully' });
    } catch (error: any) {
      payload.logger.error(`Error sending manual message for ticket ${ticketId}: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },
};

export default sendManualMessageEndpoint;
