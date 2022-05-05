import { installSessionMock } from './session.js';

/**
 * Install an authenticated user account to the session with membership to the
 * provided groups.
 * 
 * @param {object} options
 * @param {string[]} options.groups
 * @param {() => string | number} [options.getSessionID]
 * @returns {import('express').RequestHandler}
 */
export const installAuthMock = ({
  groups,
  getSessionID
}) => {
  return installSessionMock({
    getSessionID,
    initialSession: {
      isAuthenticated: true,
      account: /** @type {import('@azure/msal-node').AccountInfo} */ ({
        idTokenClaims: {
          groups
        }
      })
    }
  })
};
