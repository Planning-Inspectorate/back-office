import { databaseConnector } from '#utils/database-connector.js';
import { getSkipValue } from '#utils/database-pagination.js';
import { Subscription } from '@pins/applications/lib/application/subscription.js';

/**
 * @typedef {Object} ListSubscriptionOptions
 * @property {number} page
 * @property {number} pageSize
 * @property {string} [caseReference] - filter option
 * @property {string} [type] - filter option
 */

/**
 * List subscriptions
 *
 * @param {ListSubscriptionOptions} options
 * @returns {Promise<{count: number, items: import('@prisma/client').Subscription[]}>}
 */
export async function list({ page, pageSize, caseReference, type }) {
	/** @type {import('@prisma/client').Prisma.SubscriptionWhereInput} */
	const where = {};
	if (caseReference) {
		where.caseReference = caseReference;
	}
	if (type) {
		switch (type) {
			case Subscription.Type.AllUpdates:
				where.subscribedToAllUpdates = true;
				break;
			case Subscription.Type.ApplicationSubmitted:
				where.subscribedToApplicationSubmitted = true;
				break;
			case Subscription.Type.ApplicationDecided:
				where.subscribedToApplicationDecided = true;
				break;
			case Subscription.Type.RegistrationOpen:
				where.subscribedToRegistrationOpen = true;
				break;
		}
	}

	const result = await databaseConnector.$transaction([
		databaseConnector.subscription.count({
			where
		}),
		databaseConnector.subscription.findMany({
			where,
			skip: getSkipValue(page, pageSize),
			take: pageSize
		})
	]);

	return {
		count: result[0],
		items: result[1]
	};
}

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
