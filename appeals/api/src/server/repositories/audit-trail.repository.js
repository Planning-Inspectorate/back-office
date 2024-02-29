import { DATABASE_ORDER_BY_DESC } from '#endpoints/constants.js';
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

/**
 * @param {number} appealId
 * @returns {PrismaPromise<*>}
 */
const getAuditTrail = (appealId) =>
	databaseConnector.auditTrail.findMany({
		where: { appealId },
		include: {
			user: true,
			doc: {
				select: {
					document: {
						include: {
							latestDocumentVersion: true
						}
					}
				}
			}
		},
		orderBy: {
			loggedAt: DATABASE_ORDER_BY_DESC
		}
	});

export default { createAuditTrail, getAuditTrail };
