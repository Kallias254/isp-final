import { CollectionBeforeChangeHook } from 'payload/types';

// This hook automatically sets the ispOwner on a document
// based on the logged-in user's ispOwner.
export const setIspOwnerHook: CollectionBeforeChangeHook = async ({ req, data, operation }) => {
  // We only want to set this on create
  if (operation === 'create' && req.user && req.user.ispOwner) {
    return {
      ...data,
      ispOwner: req.user.ispOwner,
    };
  }
  return data;
};
