import getActiveDirectoryAccessToken from '../../../lib/active-directory-token.js';
import { fetchFromCache, storeInCache } from '../../../lib/cache-handler.js';
import HttpError from '../../../lib/http-error.js';
import { msGraphGet } from '../../../lib/msGraphRequest.js';
import config from '@pins/applications.web/environment/config.js';
import fs from 'node:fs/promises';
import path from 'node:path';

/** @typedef {import('../../applications.types.js').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import("../../../app/auth/auth-session.service.js").SessionWithAuth} SessionWithAuth */

/**
 * Get Active Directory token from session auth data
 * @param {SessionWithAuth} session
 * @returns {Promise<string>}
 */
const getTokenOrFail = async (session) => {
	try {
		const { token } = await getActiveDirectoryAccessToken(session, ['GroupMember.Read.All']);

		if (token) return token;

		throw new HttpError('Active Directory token not found', 401);
	} catch {
		throw new HttpError('Error retrieving the Active Directory token', 500);
	}
};

/**
 *  Search the query in the azure Active Directory groups using Microsoft Graph REST API
 *
 * @param {string} ADToken
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
export const getAllADUsers = async (ADToken) => {
	const containerGroupsIds = [
		config.referenceData.applications.caseAdminOfficerGroupId,
		config.referenceData.applications.caseTeamGroupId,
		config.referenceData.applications.inspectorGroupId
	];

	const allResults = await Promise.all(
		containerGroupsIds.map((groupId) => {
			// search for members of the group whose name or email (here called userPrincipalName) matches the search term
			const url = `groups/${groupId}/members/microsoft.graph.user?$select=givenName,surname,userPrincipalName,id`;

			// call the Microsoft Graph REST API
			return msGraphGet(url, {
				headers: { authorization: `Bearer ${ADToken}`, ConsistencyLevel: 'eventual' }
			});
		})
	);

	return (
		allResults
			// remodel response
			.map((result) => result.value)
			.flat(1)
			// filter out null or duplicate results (same user can be in multiple groups)
			.filter(
				(value, index, self) =>
					Boolean(value) && index === self.findIndex((selfItem) => selfItem.id === value.id)
			)
			// replace potential null values with empty strings
			.map((result) => ({
				id: result.id,
				surname: result.surname || '',
				givenName: result.givenName || '',
				userPrincipalName: result.userPrincipalName || ''
			}))
			// sort by first name
			// if first name is the same, sort by surname
			.sort((usr1, usr2) => {
				if (usr1.givenName !== usr2.givenName) {
					return usr1.givenName > usr2.givenName ? 1 : -1;
				}
				return usr1.surname > usr2.surname ? 1 : -1;
			})
	);
};

/**
 * Retrieve Azure Directory Users via the execution of a ms graph api request unless the environment is development and dummy user data is available
 *
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
const getAzureDirectoryUsers = async (session) => {
	if (config.authDisabled) {
		// In development only, do not trigger any Azure request
		if (config.dummyUserData) {
			// In development only, use dummy user data if available
			const dummyUserDataFile = path.join(process.cwd(), 'dummy_user_data.json');
			return JSON.parse(await fs.readFile(dummyUserDataFile, 'utf8'));
		}
		return [];
	}
	const token = await getTokenOrFail(session);
	return (await getAllADUsers(token)) || [];
};

/**
 * Retrieve all Azure Directory Users from cache or execute ms graph api request if cache empty
 *
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
const getAllCachedUsers = async (session) => {
	const cacheName = `cache_applications_users`;

	let cachedUsers = await fetchFromCache(cacheName);

	if (!cachedUsers) {
		try {
			cachedUsers = await getAzureDirectoryUsers(session);
		} catch (/** @type {*} */ error) {
			throw new HttpError(
				`[GRAPH MICROSOFT API] ${error?.response?.body?.error?.code || 'Unknown error'}`,
				500
			);
		}
		if (!config.authDisabled) {
			// store all users in the cache for 2h
			storeInCache(cacheName, cachedUsers, 7200);
		}
	}

	return cachedUsers;
};

export default {
	getAllCachedUsers,
	getAllADUsers
};
