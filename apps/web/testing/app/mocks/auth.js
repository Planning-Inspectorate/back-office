import { createSessionMockMiddleware } from '@pins/express';
import config from '@pins/applications.web/environment/config.js';
import { createAccountInfo } from '../factory/account-info.js';

/**
 * Install an authenticated user account to the session with membership to the
 * provided groups.
 *
 * @param {object} options
 * @param {string[]} options.groups
 * @param {() => string | number} [options.getSessionID]
 * @returns {import('express').RequestHandler}
 */
export const installAuthMock = ({ groups, getSessionID }) => {
	const requireAllGroups = groups.length === 1 && groups[0] === '*';

	return createSessionMockMiddleware({
		getSessionID,
		initialSession: {
			account: createAccountInfo({
				groups: requireAllGroups ? [...Object.values(config.referenceData.applications)] : groups
			})
		}
	});
};
