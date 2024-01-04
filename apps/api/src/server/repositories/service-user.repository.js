import { databaseConnector } from '#utils/database-connector.js';

/**
 * Find a Service User by their email address
 *
 * In practice, service user emails are unique - but they're also nullable.
 *
 * @param {string} email
 * @returns {Promise<import('@prisma/client').ServiceUser|null>}
 */
export function findByEmail(email) {
	return databaseConnector.serviceUser.findFirst({
		where: {
			email
		}
	});
}
