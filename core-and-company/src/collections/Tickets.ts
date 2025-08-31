import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { sendNotification } from '../utils/notificationService'; // Import sendNotification
import { isAdminOrHasPermission } from '../utils/access';

const Tickets: CollectionConfig = {
  slug: 'tickets',
  admin: {
    useAsTitle: 'ticketID',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'tickets' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'tickets' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'tickets' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'tickets' }),
  },
  fields: [
    {
      name: 'ticketID',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'subscribers',
      hasMany: false,
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Closed', value: 'closed' },
      ],
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
      required: true,
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'staff',
      hasMany: false,
    },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, operation, previousDoc }) => { // Changed originalDoc to previousDoc
        // Only send notifications for 'create' or 'update' operations that change status
        if (operation === 'create' || (operation === 'update' && previousDoc && previousDoc.status !== doc.status)) { // Changed originalDoc to previousDoc
          const payload = req.payload;
          const ticket = doc;

          // Fetch the subscriber to get deviceToken
          const subscriber = await payload.findByID({
            collection: 'subscribers',
            id: typeof ticket.subscriber === 'object' ? ticket.subscriber.id : ticket.subscriber,
          });

          if (!subscriber || !subscriber.deviceToken) {
            payload.logger.warn(`Subscriber or deviceToken not found for ticket ${ticket.ticketID}. Skipping push notification.`);
            return;
          }

          let title = '';
          let content = '';
          let triggerEvent = '';

          if (operation === 'create') {
            title = 'New Support Ticket Created!';
            content = `Your ticket #${ticket.ticketID} for "${ticket.subject}" has been created. We'll get back to you soon.`;
            triggerEvent = 'ticket.created';
          } else if (operation === 'update') {
            switch (ticket.status) {
              case 'in-progress':
                title = 'Ticket In Progress!';
                content = `Your ticket #${ticket.ticketID} for "${ticket.subject}" is now in progress.`;
                triggerEvent = 'ticket.status_in_progress';
                break;
              case 'resolved':
                title = 'Ticket Resolved!';
                content = `Your ticket #${ticket.ticketID} for "${ticket.subject}" has been resolved. Please let us know if you have any further issues.`;
                triggerEvent = 'ticket.status_resolved';
                break;
              case 'closed':
                title = 'Ticket Closed!';
                content = `Your ticket #${ticket.ticketID} for "${ticket.subject}" has been closed.`;
                triggerEvent = 'ticket.status_closed';
                break;
              // Add other statuses as needed
            }
          }

          if (title && content) {
            await sendNotification({
              payload: payload,
              recipient: subscriber.id,
              type: 'push',
              deviceToken: subscriber.deviceToken,
              title: title,
              content: content,
              triggerEvent: triggerEvent,
              data: {
                ticketId: ticket.id,
                ticketID: ticket.ticketID,
                subscriberId: subscriber.id,
              },
            });
            payload.logger.info(`Push notification sent for ticket ${ticket.ticketID} (event: ${triggerEvent})`);
          }
        }
      },
    ],
    afterDelete: [getAuditLogDeleteHook('tickets')],
  },
};

export default Tickets;
