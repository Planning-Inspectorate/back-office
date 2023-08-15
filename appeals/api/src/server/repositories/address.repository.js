import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Appeals.UpdateAddressRequest} UpdateAddressRequest */
/** @typedef {import('@pins/appeals.api').Schema.Address} Address */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {number} id
 * @param {UpdateAddressRequest} data
 * @returns {PrismaPromise<Address>}
 */
const updateAddressById = (id, data) =>
	databaseConnector.address.update({
		where: { id },
		data
	});

export default { updateAddressById };
