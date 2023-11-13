import getActiveDirectoryAccessToken from '../../../lib/active-directory-token.js';
import { msGraphGet } from '../../../lib/msGraphRequest.js';
import config from '@pins/applications.web/environment/config.js';

/** @typedef {import('../../applications.types.js').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Get Active Directory token from session auth data
 * @param {import("../../../app/auth/auth-session.service.js").SessionWithAuth} session
 * @returns {Promise<{token?: string, errors?: ValidationErrors}>}
 */
const getTokenOrAuthErrors = async (session) => {
	let response;

	try {
		const ADToken = await getActiveDirectoryAccessToken(session, ['GroupMember.Read.All']);
		response = { token: ADToken?.token };
	} catch {
		response = new Promise((resolve) => {
			resolve({
				errors: {
					query:
						"You don't have the permissions to search for team members. Please, try loggin out and try again."
				}
			});
		});
	}

	return response;
};

/**
 *  Search the query in the azure Active Directory groups using Microsfot Graph REST API
 *
 * @param {string} searchTerm
 * @param {string} ADToken
 * @returns {Promise<Array<ProjectTeamMember>>}
 */
export const searchADMember = async (searchTerm, ADToken) => {
	const containerGroupsIds = [
		config.referenceData.applications.caseAdminOfficerGroupId,
		config.referenceData.applications.caseTeamGroupId,
		config.referenceData.applications.inspectorGroupId
	];

	const allResults = await Promise.all(
		containerGroupsIds.map((groupId) => {
			// search for members of the group whose name or email (here called userPrincipalName) matches the search term
			const url = `groups/${groupId}/members/microsoft.graph.user?$search="displayName:${searchTerm}" OR "userPrincipalName:${searchTerm}"&$select=givenName,surname,userPrincipalName,id`;

			// call the Microsoft Graph REST API
			return msGraphGet(url, {
				headers: { authorization: `Bearer ${ADToken}`, ConsistencyLevel: 'eventual' }
			});
		})
	);

	// remodel response and filter out duplicate results (same user can be in multiple groups)
	return allResults
		.map((c) => c.value)
		.flat(1)
		.filter(
			(value, index, self) => index === self.findIndex((selfItem) => selfItem.id === value.id)
		);
};

export default {
	getTokenOrAuthErrors,
	searchADMember
};
