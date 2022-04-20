import msal from '@azure/msal-node';
import { config } from '../config/config.js';

/** @typedef {import('@pins/express').Auth.AccessRule} AccessRule */

export const msalClient = new msal.ConfidentialClientApplication({
	auth: {
		clientId: config.auth.sso.clientId,
		authority: `${config.auth.sso.cloudInstanceId}/${config.auth.sso.tenantId}`,
		clientSecret: config.auth.sso.clientSecret
	},
	system: {
		loggerOptions: {
			loggerCallback(loglevel, message, containsPii) {
				console.log(message);
				console.log(containsPii);
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
		switch (credType) {
			case 'groups':
				// eslint-disable-next-line unicorn/explicit-length-check
				if (rule.groups.filter((element) => creds.includes(element)).length < 1) {
					console.error('User does not have this group');
					return false;
				}
				break;

			case 'roles':
				// eslint-disable-next-line unicorn/explicit-length-check
				if (rule.roles.filter((element) => creds.includes(element)).length < 1) {
					console.error('User does not have this role');
					return false;
				}
				break;

			default:
				break;
		}
	} else {
		console.error('Method not allowed for this route');
		return false;
	}

	return true;
}
