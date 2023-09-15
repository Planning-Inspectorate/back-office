import { getData } from '#lib/graph-request.js';
import { fetchFromCache, storeInCache } from '#lib/cache-handler.js';
import getActiveDirectoryAccessToken from '#lib/active-directory-token.js';
import config from '#environment/config.js';
import { prefixUrl } from '#lib/graph-request.js';

/** @typedef {import('../../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

/**
 * Get all the users belonging to a specific group.
 * Requires the web project to run over https, with auth enabled. An empty array will be returned if these conditions are not met.
 * @param {string} roleName The group name or ID in Active Directory
 * @param {SessionWithAuth} session The current user's session
 * @returns {Promise<{ id:string; name: string; email:string;}[]>}
 * @example `const caseOfficers = await getUsersByRole(caseOfficerGroupId, session)`
 */
const getUsersByRole = async (roleName, session) => {
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
 * Get an individual user by ID from the specified group
 *
 * @param {string} roleName The group name or ID in Active Directory
 * @param {SessionWithAuth} session The current user's session
 * @param {string} id - GUID representing the user in AD (same as user.id in returned data)
 * @returns {Promise<Object<string, any>|undefined>}
 */
const getUserByRoleAndId = async (roleName, session, id) => {
	if (config.authDisabled) {
		return;
	}

	const users = await getUsersByRole(roleName, session);
	const matchingUsers = users.filter((user) => user.id === id);

	return matchingUsers?.[0];
};

/**
 * Get all the users belonging to a specific group, from AD
 *
 * @param {string} roleName
 * @param {SessionWithAuth} session
 * @returns {Promise<{ id:string; name: string; email:string;}[]>}
 */
const fetchRolesAndUsersFromGraph = async (roleName, session) => {
	const token = await getActiveDirectoryAccessToken(session, [
		'GroupMember.Read.All',
		'User.ReadBasic.All'
	]);
	if (token?.token) {
		const maximumNumberOfPages = 16;
		const data = [];
		let gotAllPages = false;
		let numberOfPagesReturned = 0;
		let url = `groups/${roleName}/members?$select=id,displayName,givenName,surname,userPrincipalName`;

		while (!gotAllPages) {
			const page = await getData(url, {
				headers: { authorization: `Bearer ${token.token}` }
			});

			data.push(...page.value);

			if (++numberOfPagesReturned > maximumNumberOfPages) {
				gotAllPages = true;
				break;
			}

			const nextPageLink = page['@odata.nextLink'];

			if (nextPageLink) {
				const nextLinkSplitOnPrefix = nextPageLink.split(prefixUrl);
				const nextLinkWithoutPrefix = nextLinkSplitOnPrefix[nextLinkSplitOnPrefix.length - 1];

				url = nextLinkWithoutPrefix;
			} else {
				gotAllPages = true;
			}
		}

		// @ts-ignore
		return data.map((user) => {
			return {
				id: user.id,
				name: getUserName(user),
				email: user.userPrincipalName
			};
		});
	}

	return [];
};

/**
 *
 * @param {Object<string, any>} user
 * @returns
 */
const getUserName = (user) => {
	if (user.givenName && user.surname) {
		return `${user.givenName} ${user.surname}`;
	}

	if (user.displayName) {
		const displayNameFragments = user.displayName.split(',');

		if (displayNameFragments.length > 1) {
			return `${displayNameFragments[1]} ${displayNameFragments[0]}`;
		}
	}

	return '';
};

export default {
	getUsersByRole,
	getUserByRoleAndId
};
