import config from '@pins/applications.web/environment/config.js';
import { intersection } from 'lodash-es';
import pino from '../lib/logger.js';
import * as authSession from './auth/auth-session.service.js';

/** @typedef {import('./auth/auth.service').AccountInfo} AccountInfo */

/**
 * @typedef {object} ViewHomepageRenderOptions
 * @property {typeof config['referenceData']} referenceData
 * @property {string[]} applicationGroupIds
 */

/**
 * Display a homepage tailored to the user's group memberships.
 *
 * @type {import('@pins/express').RenderHandler<ViewHomepageRenderOptions>}
 */
export function viewHomepage(request, response, next) {
	const account = /** @type {AccountInfo} */ (authSession.getAccount(request.session));
	const userGroups = account?.idTokenClaims?.groups ?? [];

	// Determine those group ids the user belongs to for the applications domain
	const applicationGroupIds = intersection(
		Object.values(config.referenceData.applications),
		userGroups
	);

	// The user belongs to an allowed group in the applications service

	if (applicationGroupIds.length > 0) {
		const { caseAdminOfficerGroupId, caseTeamGroupId, inspectorGroupId } =
			config.referenceData.applications;
		const allowedGroupIds = [caseAdminOfficerGroupId, caseTeamGroupId, inspectorGroupId];

		if (allowedGroupIds.some((id) => applicationGroupIds.includes(id))) {
			return response.redirect('/applications-service/');
		} else {
			const error = new Error('User logged in successfully but the user group is not valid.');

			pino.error(error);
			return next(error);
		}
	}

	// the user does not belong to any group (i.e. is unauthenticated)
	// show 403 page
	return response.render('app/403');
}

/** @type {import('express').RequestHandler} */
export function handleHealthCheck(_, response) {
	response.send('OK');
}

/** @type {import('express').RequestHandler} */
export function handleAlwaysOn(request, response, next) {
	if (request.headers['user-agent'] === 'AlwaysOn') {
		response.status(204).end();
	} else {
		next();
	}
}

/** @type {import('express').RequestHandler} */
export function viewUnauthenticatedError(_, response) {
	response.status(200).render('app/401');
}
