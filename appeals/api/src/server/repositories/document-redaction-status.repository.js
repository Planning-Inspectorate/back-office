import { DATABASE_ORDER_BY_ASC } from '#endpoints/constants.js';
import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Schema.DocumentRedactionStatus} DocumentRedactionStatus */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @returns {PrismaPromise<DocumentRedactionStatus[]>}
 */
const getAllDocumentRedactionStatuses = () =>
	databaseConnector.documentRedactionStatus.findMany({
		orderBy: {
			id: DATABASE_ORDER_BY_ASC
		}
	});

export default { getAllDocumentRedactionStatuses };
