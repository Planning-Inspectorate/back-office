import { databaseConnector } from '../utils/database-connector.js';

/**
 * Get an existing subscription entry
 *
 * @param {number} id
 * @returns {Promise<import('@prisma/client').Subscription|null>}
 */
export function get(id) {
	return databaseConnector.subscription.findUnique({
		where: {
			id
		}
	});
}

/**
 * Find an existing subscription entry
 *
 * @param {string} caseReference
 * @param {string} emailAddress
 * @returns {Promise<import('@prisma/client').Subscription|null>}
 */
export function findUnique(caseReference, emailAddress) {
	return databaseConnector.subscription.findUnique({
		where: {
			emailAddress_caseReference: {
				caseReference,
				emailAddress
			}
		}
	});
}

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

/**
 * Update an existing subscription entry
 *
 * @param {number} id
 * @param {import('@prisma/client').Prisma.SubscriptionUncheckedUpdateInput} payload
 * @returns {Promise<import('@prisma/client').Subscription>}
 */
export function update(id, payload) {
	return databaseConnector.subscription.update({
		where: {
			id
		},
		data: payload
	});
}
