import { isUndefined } from 'lodash-es';
import { checkAccessRule } from '../../lib/sso.js';

/**
 * @typedef {object} AccessRule
 * @property {string[]} methods
 * @property {string[]=} roles
 * @property {string[]=} groups
 */

/**
 * @typedef {object} GuardOptions
 * @property {AccessRule=} accessRule
 */

/**
 * Path to redirect to after successful login.
 *
 * @type {import('@pins/express').RequestHandler}
 */
export function isAuthenticated(request, response, next) {
	if (request.session) {
		if (!request.session.isAuthenticated) {
			console.error('Not permitted');
			// return response.redirect('/auth/unauthorized');
			return response.redirect(`/auth/signin?redirect_to=${request.originalUrl}`);
		}

		next();
	} else {
		console.error('No session found for this request');
		response.redirect('/auth/unauthorized');
	}
}

/**
 * Checks if the user has access for this route, defined in access matrix
 *
 * @template {object} T
 * @param {GuardOptions} options options to modify this middleware
 * @returns {import('express').RequestHandler<T>} - A wrapped request handler.
 */
export function hasAccess(options) {
	return (request, response, next) => {
		if (request.session) {
			const checkFor = options.accessRule && 'groups' in options.accessRule ? 'groups' : 'roles';

			switch (checkFor) {
				case 'groups':
					if (isUndefined(request.session.account?.idTokenClaims?.groups)) {
						if (
							request.session.account?.idTokenClaims?.claimName ||
							request.session.account?.idTokenClaims?.claimSources
						) {
							console.warn('User has too many groups. Groups overage claim occurred');

							// TODO: Should we handle overage?
							response.redirect('/auth/unauthorized');
						} else {
							console.error('User does not have any groups');
							return response.redirect('/auth/unauthorized');
						}
					} else if (request.session.account?.idTokenClaims) {
						const { groups } = request.session.account.idTokenClaims;

						if (!checkAccessRule(request.method, options.accessRule, groups, 'groups')) {
							return response.redirect('/auth/unauthorized');
						}
					}

					next();
					break;

				case 'roles': {
					if (isUndefined(request.session.account?.idTokenClaims.roles)) {
						console.error('User does not have any roles');
						return response.redirect('/auth/unauthorized');
					}

					if (request.session.account) {
						const { roles = [] } = request.session.account.idTokenClaims;

						if (checkAccessRule(request.method, options.accessRule, roles, 'roles')) {
							next();
							break;
						}
					}
					return response.redirect('/auth/unauthorized');
				}

				default:
					break;
			}
		} else {
			response.redirect('/auth/unauthorized');
		}
	};
}
