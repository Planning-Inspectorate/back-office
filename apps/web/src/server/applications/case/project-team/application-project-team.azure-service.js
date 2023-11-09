import getActiveDirectoryAccessToken from '../../../lib/active-directory-token.js';
import { msGraphGet } from '../../../lib/msGraphRequest.js';
import config from '@pins/applications.web/environment/config.js';

/** @typedef {import('../../applications.types.js').ProjectTeamMember} ProjectTeamMember */

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
	/** @type {Array<ProjectTeamMember>} */
	let allResults = [];

	const containerGroupsIds = [
		config.referenceData.applications.caseAdminOfficerGroupId,
		config.referenceData.applications.caseTeamGroupId,
		config.referenceData.applications.inspectorGroupId
	];

	for (const groupId of containerGroupsIds) {
		// search for members of the group whose name or email (here called userPrincipalName) matches the search term
		const url = `groups/${groupId}/members/microsoft.graph.user?$search="displayName:${searchTerm}" OR "userPrincipalName:${searchTerm}"&$select=givenName,surname,userPrincipalName,id`;

		// call the Microsoft Graph REST API
		const msGraphResponse = await msGraphGet(url, {
			headers: { authorization: `Bearer ${ADToken}`, ConsistencyLevel: 'eventual' }
		});
		const resultsInGroup = msGraphResponse?.value ?? [];

		// filter out duplicate results (same user can be in multiple groups)
		allResults = [...allResults, ...resultsInGroup].filter(
			(value, index, self) => index === self.findIndex((selfItem) => selfItem.id === value.id)
		);
	}

	return allResults;
};

export default {
	getTokenOrAuthErrors,
	searchADMember
};
