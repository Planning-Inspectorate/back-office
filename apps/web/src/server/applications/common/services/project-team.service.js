import pino from '../../../lib/logger.js';
import { get } from '../../../lib/request.js';

/**
 * @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember
 * */

/**
 * @param {number} caseId
 * @returns {Promise<{ userId: string, role: string }[]>}
 * @throws {Error}
 * */
export const getProjectTeam = async (caseId) => {
	try {
		return await get(`applications/${caseId}/project-team`);
	} catch (/** @type {*} */ error) {
		pino.error(
			`[WEB] GET /applications-service/case/${caseId}/project-team (Response code: ${error?.response?.statusCode})`
		);
		throw new Error(error?.response.statusCode);
	}
};
