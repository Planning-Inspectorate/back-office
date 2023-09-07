import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Schema.User} User */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {string} azureUserId
 * @returns {PrismaPromise<User>}
 */
const findOrCreateUser = (azureUserId) =>
	databaseConnector.user.upsert({
		where: {
			azureUserId
		},
		update: {},
		create: {
			azureUserId
		}
	});

export default { findOrCreateUser };
