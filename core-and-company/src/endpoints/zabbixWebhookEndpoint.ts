import {
	Payload
} from 'payload';
import {
	Endpoint
} from 'payload/config';

const zabbixWebhookEndpoint: Endpoint = {
	path: '/zabbix-webhook',
	method: 'post',
	handler: async (req, res) => {
		const payload: Payload = req.payload;
		const zabbixAlert = req.body; // Zabbix sends JSON payload in the body

		// Basic validation: Check if essential Zabbix alert fields are present
		if (!zabbixAlert || !zabbixAlert.trigger || !zabbixAlert.trigger.name || !zabbixAlert.trigger.severity) {
			payload.logger.error('Invalid Zabbix webhook payload');
			return res.status(400).json({ message: 'Invalid Zabbix webhook payload' });
		}

		try {
			const subject = `Zabbix Alert: ${zabbixAlert.trigger.name} (Severity: ${zabbixAlert.trigger.severity})`;
			const description = [
		{
			children: [
				{
					text: `**Problem:** ${zabbixAlert.trigger.name}\n**Severity:** ${zabbixAlert.trigger.severity}\n**Host:** ${zabbixAlert.host.name}\n**IP:** ${zabbixAlert.host.ip}\n**Time:** ${zabbixAlert.event.date} ${zabbixAlert.event.time}\n**Original Event ID:** ${zabbixAlert.event.id}\n\n${zabbixAlert.trigger.description || ''}`,
				},
			],
			type: 'p',
		},
	];

			// Create a high-priority Ticket
			const newTicket = await payload.create({
				collection: 'tickets',
				data: {
					ticketID: `ZBX-${Date.now()}`,
					subscriber: null, // Zabbix alerts might not directly map to a subscriber, needs manual assignment or lookup
					subject: subject,
					description: description,
					status: 'open',
				priority: 'high',
					assignedTo: null, // Needs manual assignment or logic to assign to a NOC staff
				},
			});

			payload.logger.info(`High-priority Ticket created from Zabbix alert: ${newTicket.id}`);

			return res.status(200).json({ message: 'Zabbix webhook processed successfully', ticketId: newTicket.id });
		} catch (error: any) {
			payload.logger.error(`Error processing Zabbix webhook: ${error.message}`);
			return res.status(500).json({ message: 'Internal server error', error: error.message });
		}
	},
};

export default zabbixWebhookEndpoint;
