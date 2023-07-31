import { getData } from '#lib/graph-request.js';
import { fetchFromCache, storeInCache } from '#lib/cache-handler.js';
import getActiveDirectoryAccessToken from '#lib/active-directory-token.js';
import config from '#environment/config.js';

/** @typedef {import('../../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

/**
 * Get all the users belonging to a specific group.
 * Requires the web project to run over https, with auth enabled. An empty array will be returned if these conditions are not met.
 * @param {string} roleName The group name or ID in Active Directory
 * @param {SessionWithAuth} session The current user's session
 * @returns {Promise<{ id:string; name: string; email:string;}[]>}
 * @example `const caseOfficers = await getUsersByRole(caseOfficerGroupId, session)`
 */
export const getUsersByRole = async (roleName, session) => {
	if (config.authDisabled) {
		return [];
	}

	const cacheName = `cache_users_${roleName}`;
	let cache = await fetchFromCache(cacheName);
	if (!cache) {
		cache = (await fetchRolesAndUsersFromGraph(roleName, session)) || [];
		await storeInCache(cacheName, cache);
	}
	return cache;
};

/**
 * Get all the users belonging to a specific group, from AD
 *
 * @param {string} roleName
 * @param {SessionWithAuth} session
 * @returns {Promise<{ id:string; name: string; email:string;}[]>}
 */
const fetchRolesAndUsersFromGraph = async (roleName, session) => {
	const token = await getActiveDirectoryAccessToken(session, ['GroupMember.Read.All']);
	if (token?.token) {
		const data = await getData(
			`groups/${roleName}/members?$select=id,displayName,userPrincipalName`,
			{
				headers: { authorization: `Bearer ${token.token}` }
			}
		);

		// @ts-ignore
		return data.value.map((user) => {
			return {
				id: user.id,
				name: user.displayName,
				email: user.userPrincipalName
			};
		});
	}

	return [];
};
