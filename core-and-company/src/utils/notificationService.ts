import { Payload } from 'payload';
import axios from 'axios'; // Import axios

interface SendNotificationArgs {
  payload: Payload;
  recipient: string; // Phone number or email for SMS/Email/Telegram, or user ID for push
  type: 'sms' | 'email' | 'push'; // Removed 'telegram' as it's not in Messages collection
  content: string; // Message content for SMS/Email/Telegram, or body for push
  triggerEvent: string;
  sentBy?: string; // Staff ID if manual
  bulkSend?: boolean;
  deviceToken?: string; // Required for 'push' notifications
  title?: string; // Optional title for push notifications
  data?: Record<string, any>; // Optional data payload for push notifications
  ispOwner: string | { id: string }; // Add ispOwner here
}

export const sendNotification = async ({ payload, recipient, type, content, triggerEvent, sentBy, bulkSend, deviceToken, title, data, ispOwner }: SendNotificationArgs) => {
  try {
    let status: 'sent' | 'failed' = 'sent';
    let externalServiceResponse: any;

    if (type === 'push') {
      if (!deviceToken) {
        payload.logger.error('Device token is required for push notifications.');
        status = 'failed';
      } else {
        // Placeholder for calling external Push Notification Service API
        payload.logger.info(`Simulating sending push notification to device ${deviceToken} for event ${triggerEvent}`);
        payload.logger.info(`Title: ${title || 'N/A'}, Body: ${content}`);

        try {
          externalServiceResponse = await axios.post('http://notification-service:6000/send-notification', {
            deviceToken,
            title: title || 'Notification',
            body: content,
            data: {
              triggerEvent,
              ...data,
            },
          });

          if (externalServiceResponse.status !== 200) { // Check status code for axios
            payload.logger.error(`Push Notification Service error: ${externalServiceResponse.data.message}`);
            status = 'failed';
          }
        } catch (fetchError: any) {
          payload.logger.error(`Error calling Push Notification Service:`);
          payload.logger.error(fetchError);
          status = 'failed';
        }
      }
    } else {
      // Existing logic for SMS, Email, Telegram
      payload.logger.info(`Simulating sending ${type} notification to ${recipient} for event ${triggerEvent}`);
      payload.logger.info(`Content: ${content}`);
    }

    // Log action in Messages collection
    if (!ispOwner) {
      payload.logger.error('ispOwner is required to send a notification');
      return;
    }
    const messageData = {
      recipient,
      type,
      content,
      status,
      triggerEvent,
      sentBy,
      bulkSend,
      ispOwner: typeof ispOwner === 'object' ? ispOwner.id : ispOwner,
    };
    await payload.create({
      collection: 'messages',
      data: messageData,
    });

    payload.logger.info(`Notification logged in Messages collection for ${recipient} with status ${status}`);
  } catch (error: any) {
    payload.logger.error(`Error sending or logging notification to ${recipient} for event ${triggerEvent}: ${error.message}`);
  }
};
