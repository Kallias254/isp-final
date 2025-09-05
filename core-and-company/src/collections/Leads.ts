import { CollectionConfig } from 'payload/types';
import { getAuditLogHook, getAuditLogDeleteHook } from '../hooks/auditLogHook';
import { isAdminOrHasPermission } from '../utils/access';
import { setIspOwnerHook } from '../hooks/setIspOwner';

const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'subscriberName',
  },
  access: {
    read: isAdminOrHasPermission('read', 'leads'),
    create: isAdminOrHasPermission('create', 'leads'),
    update: isAdminOrHasPermission('update', 'leads'),
    delete: isAdminOrHasPermission('delete', 'leads'),
  },
  hooks: {
    beforeChange: [setIspOwnerHook],
    afterChange: [
      getAuditLogHook('leads'),
      async ({ req, doc, previousDoc }) => {
        // Check if status changed to 'Converted'
        if (doc.status === 'converted' && previousDoc.status !== 'converted') {
          // 1. Create a new Subscriber record
          const newSubscriber = await req.payload.create({
            collection: 'subscribers',
            data: {
              firstName: doc.subscriberName.split(' ')[0] || '',
              lastName: doc.subscriberName.split(' ').slice(1).join(' ') || '',
              accountNumber: `ACC-${Date.now()}`,
              mpesaNumber: doc.subscriberPhone,
              contactPhone: doc.subscriberPhone,
              email: `${doc.subscriberName.replace(/\s/g, '').toLowerCase()}@example.com`,
              status: 'pending-installation',
              servicePlan: doc.preferredPlan,
              isTrial: false,
              nextDueDate: new Date().toISOString(),
              accountBalance: 0,
              internalNotes: doc.notes,
              ispOwner: doc.ispOwner,
            },
          });

          req.payload.logger.info(`New Subscriber created from Lead: ${newSubscriber.id}`);

          // 3. Update the BuildingUnit
          if (doc.buildingUnit) {
            const buildingUnitId = typeof doc.buildingUnit === 'object' ? doc.buildingUnit.id : doc.buildingUnit;
            await req.payload.update({
              collection: 'building-units',
              id: buildingUnitId,
              data: {
                status: 'active-subscriber',
                subscriber: newSubscriber.id,
                lead: null,
              },
            });
            req.payload.logger.info(`BuildingUnit ${buildingUnitId} updated to Active Subscriber.`);
          }

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
    afterDelete: [getAuditLogDeleteHook('leads')],
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
        name: 'status',
        type: 'select',
        options: [
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'Converted', value: 'converted' },
            { label: 'Lost', value: 'lost' },
        ],
        defaultValue: 'new',
    },
    {
        name: 'leadSource',
        type: 'select',
        options: [
            { label: 'Partner Referral', value: 'partner-referral' },
            { label: 'Direct', value: 'direct' },
            { label: 'Marketing Campaign', value: 'marketing-campaign' },
        ],
    },
    {
        name: 'referredBy',
        type: 'relationship',
        relationTo: 'partners',
        admin: {
            condition: data => data.leadSource === 'partner-referral',
        },
    },
    {
        name: 'preferredPlan',
        type: 'relationship',
        relationTo: 'plans',
    },
    
    {
        name: 'notes',
        type: 'textarea',
    },
    {
        name: 'buildingUnit',
        type: 'relationship',
        relationTo: 'building-units',
        hasMany: false,
    },
  ],
};

export default Leads;
