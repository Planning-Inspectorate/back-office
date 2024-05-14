import fs from 'node:fs/promises';
import path from 'node:path';
import config from '@pins/applications.web/environment/config.js';
import pino from '../../../lib/logger.js';
import { get } from '../../../lib/request.js';
import getActiveDirectoryAccessToken from '../../../lib/active-directory-token.js';
import { fetchFromCache, storeInCache } from '../../../lib/cache-handler.js';
import HttpError from '../../../lib/http-error.js';
import { msGraphGet } from '../../../lib/msGraphRequest.js';

/**
 * Get Active Directory token from session auth data
 * @param {SessionWithAuth} session
 * @returns {Promise<string>}
 */
export const getTokenOrFail = async (session) => {
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
 * Retrieve all Azure Directory Users from cache or execute ms graph api request if cache empty
 *
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
export const getAllCachedUsers = async (session) => {
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

/**
 * @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember
 * @typedef {import("../../../app/auth/auth-session.service.js").SessionWithAuth} SessionWithAuth
 */

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

/**
 * Add extra info (name and email) to the internally stored data of team members (id and role)
 *
 * @param {{userId: string, role: string}[]} projectTeamMembers
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
export const getManyProjectTeamMembersInfo = async (projectTeamMembers, session) => {
	// retrieve all the AD users or throw error
	// this list contains extra info such as names or emails
	const allAzureUsers = await getAllCachedUsers(session);

	// if for some reason no user can be retrieved from Azure, just return an empty array
	if (allAzureUsers.length === 0) {
		return [];
	}

	// merge the info retrieved from Azure to the internally stored data
	const projectTeamMembersInfo = projectTeamMembers.map((teamMember) => {
		const teamMemberInfo = allAzureUsers.find((azureUser) => azureUser.id === teamMember.userId);

		return {
			...teamMember,
			...teamMemberInfo
		};
	});

	return projectTeamMembersInfo;
};
