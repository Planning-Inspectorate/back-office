import { databaseConnector } from '#utils/database-connector.js';
import { getSkipValue } from '#utils/database-pagination.js';
import { Subscription } from '@pins/applications/lib/application/subscription.js';

/**
 * @typedef {Object} ListSubscriptionOptions
 * @property {number} page
 * @property {number} pageSize
 * @property {string} [caseReference] - filter option
 * @property {string} [type] - filter option
 * @property {Date} [endAfter] - filter option
 */

const include = { serviceUser: true };

/**
 * List subscriptions
 *
 * @param {ListSubscriptionOptions} options
 * @returns {Promise<{count: number, items: import('@prisma/client').Subscription[]}>}
 */
export async function list({ page, pageSize, caseReference, type, endAfter }) {
	/** @type {import('@prisma/client').Prisma.SubscriptionWhereInput} */
	const where = {};
	if (caseReference) {
		where.caseReference = caseReference;
	}
	if (type) {
		subscriptionTypeToWhere(type, where);
	}
	if (endAfter) {
		// don't include updates that have a non-null endDate that is before (or equal) endAfter
		where.NOT = [
			{
				AND: [{ endDate: { not: null } }, { endDate: { lte: endAfter } }]
			}
		];
	}

	const result = await databaseConnector.$transaction([
		databaseConnector.subscription.count({
			where
		}),
		databaseConnector.subscription.findMany({
			where,
			skip: getSkipValue(page, pageSize),
			take: pageSize,
			include
		})
	]);

	return {
		count: result[0],
		items: result[1]
	};
}

/**
 * Amend a where clause to include the given subscription type
 * Any given type should include allUpdates.
 *
 * @param {string} type
 * @param {import('@prisma/client').Prisma.SubscriptionWhereInput} where
 */
export function subscriptionTypeToWhere(type, where) {
	switch (type) {
		case Subscription.Type.allUpdates:
			where.subscribedToAllUpdates = true;
			break;
		case Subscription.Type.applicationSubmitted:
			where.OR = [{ subscribedToAllUpdates: true }, { subscribedToApplicationSubmitted: true }];
			break;
		case Subscription.Type.applicationDecided:
			where.OR = [{ subscribedToAllUpdates: true }, { subscribedToApplicationDecided: true }];
			break;
		case Subscription.Type.registrationOpen:
			where.OR = [{ subscribedToAllUpdates: true }, { subscribedToRegistrationOpen: true }];
			break;
	}
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
		},
		include
	});
}

/**
 * Find an existing subscription entry
 *
 * @param {string} caseReference
 * @param {string} email
 * @returns {Promise<import('@prisma/client').Subscription|null>}
 */
export function findUnique(caseReference, email) {
	return databaseConnector.subscription.findFirst({
		where: {
			caseReference,
			serviceUser: {
				email
			}
		},
		include: {
			serviceUser: {
				select: {
					email: true
				}
			}
		}
	});
}

/**
 * Create a new subscription entry
 *
 * @param {import('@prisma/client').Prisma.SubscriptionUncheckedCreateInput} payload
 * @returns {Promise<import('@pins/applications.api').Schema.SubscriptionWithServiceUser>}
 */
export function create(payload) {
	return databaseConnector.subscription.create({
		data: payload,
		include
	});
}

/**
 * Update an existing subscription entry
 *
 * @param {number} id
 * @param {import('@prisma/client').Prisma.SubscriptionUncheckedUpdateInput} payload
 * @returns {Promise<import('@pins/applications.api').Schema.SubscriptionWithServiceUser>}
 */
export function update(id, payload) {
	return databaseConnector.subscription.update({
		where: {
			id
		},
		data: payload,
		include
	});
}
