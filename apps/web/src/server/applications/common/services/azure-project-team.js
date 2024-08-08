import fs from 'node:fs/promises';
import path from 'node:path';
import config from '@pins/applications.web/environment/config.js';
import { msGraphGet } from '../../../lib/msGraphRequest.js';
import { fetchFromCache, storeInCache } from '../../../lib/cache-handler.js';
import getActiveDirectoryAccessToken from '../../../lib/active-directory-token.js';
import HttpError from '../../../lib/http-error.js';

/**
 * @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember
 * @typedef {import("../../../app/auth/auth-session.service.js").SessionWithAuth} SessionWithAuth
 * /

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
 * Retrieve Azure Directory Users via the execution of a ms graph api request unless the environment is development and dummy user data is available
 *
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
const getAzureDirectoryUsers = async (session) => {
	if (config.dummyUserData) {
		const dummyUserDataFile = path.join(process.cwd(), 'dummy_user_data.json');
		return JSON.parse(await fs.readFile(dummyUserDataFile, 'utf8'));
	}

	if (config.authDisabled) {
		return [];
	}

	const token = await getTokenOrFail(session);
	return (await getAllADUsers(token)) || [];
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
			// use the transitive members API to fetch all members of a group, even if that membership is inherited from another group
			// https://learn.microsoft.com/en-us/graph/api/group-list-transitivemembers?view=graph-rest-1.0&tabs=http
			const url = `groups/${groupId}/transitiveMembers/microsoft.graph.user?$select=givenName,surname,userPrincipalName,id`;

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
 * Retrieve all Azure Directory Users from cache or execute ms graph api request if cache empty
 *
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
const getAllCachedUsers = async (session) => {
	const cacheName = `cache_applications_users`;
	const cachedUsers = await fetchFromCache(cacheName);
	if (cachedUsers) {
		return cachedUsers;
	}

	try {
		const users = await getAzureDirectoryUsers(session);

		if (!config.authDisabled) {
			// store all users in the cache for 2h
			storeInCache(cacheName, users, 7200);
		}

		return users;
	} catch (/** @type {*} */ error) {
		throw new HttpError(
			`[GRAPH MICROSOFT API] ${error?.response?.body?.error?.code || 'Unknown error'}`,
			500
		);
	}
};

export default {
	getAllADUsers,
	getAllCachedUsers
};
