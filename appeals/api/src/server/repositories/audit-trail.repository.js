import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Appeals.CreateAuditTrailRequest} CreateAuditTrailRequest */
/** @typedef {import('@pins/appeals.api').Schema.AuditTrail} AuditTrail */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {CreateAuditTrailRequest} param0
 * @returns {PrismaPromise<AuditTrail>}
 */
const createAuditTrail = ({ appealId, details, loggedAt, userId }) =>
	// @ts-ignore
	databaseConnector.auditTrail.create({
		data: {
			appealId,
			details,
			loggedAt,
			userId
		}
	});

export default { createAuditTrail };
