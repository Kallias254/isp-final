import { Payload } from 'payload';
import { Endpoint } from 'payload/config';

const whatsappLeadEndpoint: Endpoint = {
  path: '/whatsapp-lead',
  method: 'post',
  handler: async (req, res) => {
    const payload: Payload = req.payload;
    const { phoneNumber, subscriberName, buildingUnit, notes } = req.body;

    if (!phoneNumber || !subscriberName || !buildingUnit) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // 1. Find the Partner by phoneNumber
      const partners = await payload.find({
        collection: 'partners',
        where: {
          phoneNumber: {
            equals: phoneNumber,
          },
        },
      });

      const partner = partners.docs[0];

      if (!partner) {
        return res.status(404).json({ message: 'Partner not found for this phone number' });
      }

      // 2. Create a new Lead
      const newLead = await payload.create({
        collection: 'leads',
        data: {
          status: 'new',
          leadSource: 'partner-referral',
          referredBy: partner.id,
          subscriberName,
          subscriberPhone: phoneNumber,
          buildingUnit: buildingUnit,
          notes,
          ispOwner: partner.ispOwner, // Assign ispOwner from the Partner
        },
      });

      return res.status(200).json({ message: 'Lead created successfully', lead: newLead });
    } catch (error: unknown) {
      payload.logger.error(`Error creating lead from WhatsApp: ${(error as Error).message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};

export default whatsappLeadEndpoint;
