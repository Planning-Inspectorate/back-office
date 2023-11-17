import { databaseConnector } from '#utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.ProjectTeam[]>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.projectTeam.findMany({
		where: { caseId },
		orderBy: { createdAt: 'asc' }
	});
};

/**
 *
 * @param {string} userId
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.ProjectTeam | null>}
 */
export const getByUserIdRelatedToCaseId = (userId, caseId) => {
	return databaseConnector.projectTeam.findUnique({
		where: { caseId_userId: { caseId, userId } }
	});
};

/**
 *
 * @param {string} userId
 * @param {number} caseId
 * @param {string} role
 * @returns {Promise<import('@pins/applications.api').Schema.ProjectTeam>}
 */
export const upsert = (userId, caseId, role) => {
	return databaseConnector.projectTeam.upsert({
		where: { caseId_userId: { caseId, userId } },
		create: { caseId, userId, role },
		update: { role }
	});
};
