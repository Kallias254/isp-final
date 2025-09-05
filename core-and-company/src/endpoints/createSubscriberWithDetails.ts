import { Endpoint } from 'payload/config';
import { Payload } from 'payload';

// Define the expected shape of the request body
interface CreateSubscriberRequest {
  subscriberData: {
    firstName: string;
    lastName: string;
    mpesaNumber: string;
    servicePlan: string;
    status: 'pending-installation' | 'active' | 'suspended' | 'deactivated';
    isTrial?: boolean;
    trialDays?: number;
    addressNotes?: string;
    internalNotes?: string;
  };
  technicalData: {
    connectionType: 'pppoe' | 'ipoe-dhcp';
    radiusUsername?: string;
    radiusPassword?: string;
    macAddress?: string;
    assignedIp?: string;
  };
  unitId?: string;
}

async function createSubscriberWithDetails(req: any, res: any) {
  const { payload, body, user }: { payload: Payload; body: CreateSubscriberRequest, user: any } = req;
  const { subscriberData, technicalData, unitId } = body;

  if (!subscriberData || !technicalData) {
    return res.status(400).json({ message: 'Missing subscriberData or technicalData in request body.' });
  }

  try {
    // --- Start Transaction ---
    // Ensure ispOwner is a valid ID from the authenticated user
    let ispOwnerId: string;
    if (typeof user.ispOwner === 'object' && user.ispOwner !== null) {
        ispOwnerId = user.ispOwner.id;
    } else if (typeof user.ispOwner === 'string') {
        ispOwnerId = user.ispOwner;
    } else {
        // If ispOwner is not available or invalid on the user object, fetch it from the database
        const staffUser = await payload.findByID({
            collection: 'staff',
            id: user.id,
            depth: 1, // Fetch related ispOwner object
        });
        if (!staffUser || typeof staffUser.ispOwner !== 'object' || staffUser.ispOwner === null) {
            throw new Error('Authenticated user does not have a valid ISP owner assigned.');
        }
        ispOwnerId = staffUser.ispOwner.id;
    }

    // Auto-generate fields for subscriber
    const augmentedSubscriberData = {
        ...subscriberData,
        internalNotes: subscriberData.internalNotes ? JSON.parse(subscriberData.internalNotes) : undefined,
        ispOwner: ispOwnerId,
        accountNumber: `ACC-${Math.random().toString().substring(2, 8)}`,
        nextDueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    };

    // 1. Create Subscriber
    const newSubscriber = await payload.create({
      collection: 'subscribers',
      data: augmentedSubscriberData,
    });

    // Auto-generate fields for technical details
    const augmentedTechnicalData = {
        ...technicalData,
        ispOwner: ispOwnerId,
        vlanId: Math.floor(Math.random() * (4094 - 100 + 1) + 100), // Random VLAN
        subscriber: newSubscriber.id,
    };

    // 2. Create Technical Details, linking the new subscriber
    await payload.create({
      collection: 'subscriber-technical-details',
      data: augmentedTechnicalData,
    });

    // 3. (Optional) Link Building Unit
    if (unitId) {
      await payload.update({
        collection: 'building-units',
        id: unitId,
        data: {
          subscriber: newSubscriber.id,
        },
      });
    }

    // --- Commit Transaction ---
    return res.status(201).json({ message: 'Subscriber created successfully', subscriber: newSubscriber });

  } catch (error) {
    // --- Rollback Transaction ---
    payload.logger.error(`Error creating subscriber transactionally: ${error.message}`);
    return res.status(500).json({ message: 'An error occurred during subscriber creation.', error: error.message });
  }
}

export const createSubscriberEndpoint: Endpoint = {
  path: '/transactions/create-subscriber-with-details',
  method: 'post',
  handler: createSubscriberWithDetails,
};