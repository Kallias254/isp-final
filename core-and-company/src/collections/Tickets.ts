import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { sendNotification } from '../utils/notificationService'; // Import sendNotification
import { isAdminOrHasPermission } from '../utils/access';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Tickets: CollectionConfig = {
  slug: 'tickets',
  admin: {
    useAsTitle: 'ticketID',
  },
  access: {
    read: isAdminOrHasPermission('read', 'tickets'),
    create: isAdminOrHasPermission('create', 'tickets'),
    update: isAdminOrHasPermission('update', 'tickets'),
    delete: isAdminOrHasPermission('delete', 'tickets'),
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [
      getAuditLogHook('tickets'),
      async ({ req, doc, operation, previousDoc }) => {
        const payload = req.payload;
        const ticket = doc;

        // --- Work Order Creation/Update Logic ---
        if (operation === 'create' || (operation === 'update' && doc.assignedTo !== previousDoc.assignedTo)) {
          if (doc.assignedTo && typeof doc.assignedTo === 'object') {
            const assignedStaff = await payload.findByID({
              collection: 'staff',
              id: doc.assignedTo.id,
              depth: 1, // Populate assignedRole
            });

            if (assignedStaff && assignedStaff.assignedRole && typeof assignedStaff.assignedRole === 'object' && assignedStaff.assignedRole.name === 'Technician') {
              // Check if a WorkOrder already exists for this ticket
              const existingWorkOrders = await payload.find({
                collection: 'work-orders',
                where: {
                  ticket: {
                    equals: ticket.id,
                  },
                },
                limit: 1,
              });

              let workOrderDoc;
              if (existingWorkOrders.docs.length > 0) {
                // Update existing WorkOrder
                workOrderDoc = await payload.update({
                  collection: 'work-orders',
                  id: existingWorkOrders.docs[0].id,
                  data: {
                    assignedTo: assignedStaff.id,
                    // Update other fields if necessary
                  },
                });
                payload.logger.info(`Updated WorkOrder ${workOrderDoc.id} for Ticket ${ticket.ticketID}.`);
              } else {
                // Create new WorkOrder
                workOrderDoc = await payload.create({
                  collection: 'work-orders',
                  data: {
                    orderType: 'repair', // Default type
                    subscriber: ticket.subscriber ? (typeof ticket.subscriber === 'object' ? ticket.subscriber.id : ticket.subscriber) : undefined,
                    status: 'pending',
                    assignedTo: assignedStaff.id,
                    notes: `Work Order for Ticket #${ticket.ticketID}: ${ticket.subject}.\n\n${ticket.description}`,
                    ticket: ticket.id, // Link back to the ticket
                    ispOwner: ticket.ispOwner, // Assign ispOwner from the Ticket
                  },
                });
                payload.logger.info(`Created WorkOrder ${workOrderDoc.id} for Ticket ${ticket.ticketID}.`);
              }

              // Update the Ticket to link to the WorkOrder
              if (ticket.workOrder !== workOrderDoc.id) {
                await payload.update({
                  collection: 'tickets',
                  id: ticket.id,
                  data: {
                    workOrder: workOrderDoc.id,
                  },
                });
              }
            }
          }
        }

        // --- Original Notification Logic ---
        // Only send notifications for 'create' or 'update' operations that change status
        if (operation === 'create' || (operation === 'update' && previousDoc && previousDoc.status !== doc.status)) {
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
              ispOwner: ticket.ispOwner,
            });
            payload.logger.info(`Push notification sent for ticket ${ticket.ticketID} (event: ${triggerEvent})`);
          }
        }
      },
    ],
    afterDelete: [getAuditLogDeleteHook('tickets')],
  },
  fields: [
    {
        name: 'ispOwner',
        type: 'relationship',
        relationTo: 'companies',
        required: true,
        access: {
            update: () => false,
        },
        admin: {
            hidden: true,
        },
    },
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
        required: true,
    },
    {
        name: 'subject',
        type: 'text',
        required: true,
    },
    {
        name: 'description',
        type: 'textarea',
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
        defaultValue: 'open',
    },
    {
        name: 'priority',
        type: 'select',
        options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
        ],
        defaultValue: 'medium',
    },
    {
        name: 'assignedTo',
        type: 'relationship',
        relationTo: 'staff',
    },
    {
        name: 'workOrder',
        type: 'relationship',
        relationTo: 'work-orders',
        hasMany: false,
        admin: {
            readOnly: true,
        },
    },
  ],
};


export default Tickets;
