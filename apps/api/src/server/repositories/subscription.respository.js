import { databaseConnector } from '../utils/database-connector.js';

/**
 * Create a new subscription entry
 *
 * @param {import('@prisma/client').Prisma.SubscriptionUncheckedCreateInput} payload
 * @returns {Promise<import('@prisma/client').Subscription>}
 */
export function create(payload) {
	return databaseConnector.subscription.create({
		data: payload
	});
}
