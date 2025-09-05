import { CollectionBeforeChangeHook } from 'payload/types';

export const unitStatusAutomationHook: CollectionBeforeChangeHook = async ({ data, operation, originalDoc }) => {
  // On create or update, if a subscriber is linked, set status to 'Active Subscriber'
  if ('subscriber' in data && data.subscriber) {
    data.status = 'active-subscriber';
    data.lead = null; // Ensure lead is cleared
    return data;
  }

  // If a lead is linked, set status to 'Lead'
  if ('lead' in data && data.lead) {
    data.status = 'lead';
    return data;
  }

  // If both are removed on an update, handle status change
  if (operation === 'update' && 'subscriber' in data && !data.subscriber && 'lead' in data && !data.lead) {
    // If the unit previously had a subscriber, it's now a 'Former Subscriber'
    if (originalDoc.subscriber) {
      data.status = 'former-subscriber';
    }
    // If it only had a lead, it's now 'Vacant / Unsurveyed'
    else if (originalDoc.lead) {
      data.status = 'vacant-unsurveyed';
    }
  }
  
  return data;
};
