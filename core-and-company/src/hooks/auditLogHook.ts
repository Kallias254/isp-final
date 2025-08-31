import payload from 'payload';
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload/types';

export const getAuditLogHook = (collectionSlug: string): CollectionAfterChangeHook => {
    return async ({ doc, req, previousDoc, operation }) => {
        const { user } = req;

        if (operation === 'create' || operation === 'update') {
            await payload.create({
                collection: 'audit-logs',
                data: {
                    timestamp: new Date().toISOString(),
                    user: user?.id,
                    action: operation,
                    collectionSlug: collectionSlug,
                    documentId: doc.id,
                    before: previousDoc,
                    after: doc,
                },
            });
        }
        return doc;
    };
}

export const getAuditLogDeleteHook = (collectionSlug: string): CollectionAfterDeleteHook => {
    return async ({ req, doc }) => {
        const { user } = req;

        await payload.create({
            collection: 'audit-logs',
            data: {
                timestamp: new Date().toISOString(),
                user: user?.id,
                action: 'delete',
                collectionSlug: collectionSlug,
                documentId: doc.id,
                before: doc,
            },
        });
    };
}
