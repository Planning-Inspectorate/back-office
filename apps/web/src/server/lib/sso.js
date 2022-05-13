import msal, { LogLevel } from '@azure/msal-node';
import config from '@pins/web/environment/config.js';
import pino from './logger.js';

/** @typedef {import('../app/auth/auth.guards').AccessRule} AccessRule */

export const msalClient = new msal.ConfidentialClientApplication({
	auth: {
		clientId: config.auth.sso.clientId,
		authority: `${config.auth.sso.cloudInstanceId}/${config.auth.sso.tenantId}`,
		clientSecret: config.auth.sso.clientSecret
	},
	system: {
		loggerOptions: {
			loggerCallback(logLevel, message) {
				switch (logLevel) {
					case LogLevel.Error:
						pino.error(message);
						break;

					case LogLevel.Warning:
						pino.warn(message);
						break;

					case LogLevel.Info:
						pino.info(message);
						break;

					case LogLevel.Verbose:
						pino.debug(message);
						break;

					default:
						pino.trace(message);
				}
			},
			piiLoggingEnabled: false,
			logLevel: msal.LogLevel.Verbose
		}
	}
});

/**
 * Checks if the request passes a given access rule
 *
 * @param {string} method HTTP method for this route
 * @param {AccessRule | undefined} rule access rule for this route
 * @param {Array<{}>} creds user's credentials i.e. roles or groups
 * @param {string} credType roles or groups
 * @returns {boolean} Return true or falls is access is granted
 */
export function checkAccessRule(method, rule, creds, credType) {
	if (rule?.methods.includes(method)) {
		// Groups

		if (credType === 'groups' && rule.groups) {
			for (const group of rule.groups) {
				if (creds.includes(group)) {
					return true;
				}
			}
			pino.warn({ rule, groups: creds }, 'Authorisation failed. User does not matching group.');

			return false;
		}

		// Roles

		if (credType === 'roles' && rule.roles) {
			for (const group of rule.roles) {
				if (creds.includes(group)) {
					return true;
				}
			}
			pino.warn({ rule, groups: creds }, 'Authorisation failed. User does not have matching role.');

			return false;
		}
	} else {
		pino.warn('Authorisation failed. Method is not permitted for this route.');
		return false;
	}
	return true;
}
