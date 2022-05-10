import { createSessionMockMiddleware } from '@pins/express';
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
	return createSessionMockMiddleware({
		getSessionID,
		initialSession: {
			isAuthenticated: true,
			account: createAccountInfo({
				groups
			})
		}
	});
};
