import { CollectionConfig } from 'payload/types';
import { isAdminOrHasPermission } from '../utils/access';

const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'subscriberName',
  },
  access: {
    read: ({ req }) => isAdminOrHasPermission({ req, action: 'read', collection: 'leads' }),
    create: ({ req }) => isAdminOrHasPermission({ req, action: 'create', collection: 'leads' }),
    update: ({ req }) => isAdminOrHasPermission({ req, action: 'update', collection: 'leads' }),
    delete: ({ req }) => isAdminOrHasPermission({ req, action: 'delete', collection: 'leads' }),
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Site Survey', value: 'site-survey' },
        { label: 'Converted', value: 'converted' },
        { label: 'Lost', value: 'lost' },
      ],
      required: true,
    },
    {
      name: 'leadSource',
      type: 'select',
      options: [
        { label: 'Partner Referral', value: 'partner-referral' },
        { label: 'Website', value: 'website' },
        { label: 'Direct Call', value: 'direct-call' },
      ],
      required: true,
    },
    {
      name: 'referredBy',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: false,
      admin: {
        condition: (_, siblingData) => siblingData?.leadSource === 'partner-referral',
      },
    },
    {
      name: 'subscriberName',
      type: 'text',
      required: true,
    },
    {
      name: 'subscriberPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'serviceLocation',
      type: 'relationship',
      relationTo: 'buildingUnits',
      hasMany: false,
      required: true,
    },
    {
      name: 'notes',
      type: 'richText',
    },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, previousDoc }) => {
        // Check if status changed to 'Converted'
        if (doc.status === 'converted' && previousDoc.status !== 'converted') {
          // 1. Create a new Subscriber record
          const newSubscriber = await req.payload.create({
            collection: 'subscribers',
            data: {
              firstName: doc.subscriberName.split(' ')[0] || '', // Assuming first word is first name
              lastName: doc.subscriberName.split(' ').slice(1).join(' ') || '', // Remaining words are last name
              accountNumber: `ACC-${Date.now()}`, // Auto-generate a simple account number
              mpesaNumber: doc.subscriberPhone,
              contactPhone: doc.subscriberPhone,
              email: `${doc.subscriberName.replace(/\s/g, '').toLowerCase()}@example.com`, // Generate a dummy email
              status: 'pending-installation',
              servicePlan: null, // Will be set during provisioning
              billingCycle: 'monthly', // Default to monthly
              nextDueDate: new Date().toISOString(), // Set to today for now
              accountBalance: 0,
              addressNotes: doc.notes,
              // connectionType and assignedIp will be managed by Ops
            },
          });

          req.payload.logger.info(`New Subscriber created from Lead: ${newSubscriber.id}`);

          // 2. If the lead was from a partner, increment referralCount
          if (doc.leadSource === 'partner-referral' && doc.referredBy) {
            const partnerId = typeof doc.referredBy === 'object' ? doc.referredBy.id : doc.referredBy;
            const partner = await req.payload.findByID({
              collection: 'partners',
              id: partnerId,
            });

            if (partner) {
              await req.payload.update({
                collection: 'partners',
                id: partnerId,
                data: {
                  referralCount: (partner.referralCount || 0) + 1,
                },
              });
              req.payload.logger.info(`Referral count incremented for Partner: ${partner.id}`);
            }
          }

          // TODO: Publish subscriber.created event (requires event system setup)
        }
        return doc;
      },
    ],
  },
};

export default Leads;
