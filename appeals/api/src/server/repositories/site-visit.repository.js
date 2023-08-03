import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Schema.SiteVisit} SiteVisit */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {{
 *  appealId: number;
 * 	visitDate?: Date;
 * 	visitEndTime?: string;
 * 	visitStartTime?: string;
 * 	siteVisitTypeId?: number;
 * }} data
 * @returns {PrismaPromise<SiteVisit>}
 */
const createSiteVisitById = (data) =>
	databaseConnector.siteVisit.create({
		data
	});

/**
 * @param {number} id
 * @param {{
 * 	visitDate?: Date;
 * 	visitEndTime?: string;
 * 	visitStartTime?: string;
 * 	siteVisitTypeId?: number;
 * }} data
 * @returns {PrismaPromise<object>}
 */
const updateSiteVisitById = (id, data) =>
	databaseConnector.siteVisit.update({
		where: { id },
		data
	});

export default { createSiteVisitById, updateSiteVisitById };
