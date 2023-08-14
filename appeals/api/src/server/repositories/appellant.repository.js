import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Appeals.UpdateAppellantRequest} UpdateAppellantRequest */
/** @typedef {import('@pins/appeals.api').Schema.Appellant} Appellant */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {number} id
 * @param {UpdateAppellantRequest} data
 * @returns {PrismaPromise<Appellant>}
 */
const updateAppellantById = (id, data) =>
	databaseConnector.appellant.update({
		where: { id },
		data
	});

export default { updateAppellantById };
