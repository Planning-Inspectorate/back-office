import config from '@pins/appeals.web/environment/config.js';
import { intersection } from 'lodash-es';
import pino from '../lib/logger.js';
import * as authSession from './auth/auth-session.service.js';

/** @typedef {import('./auth/auth.service').AccountInfo} AccountInfo */

/**
 * @typedef {object} ViewHomepageRenderOptions
 * @property {typeof config['referenceData']} referenceData
 * @property {string[]} appealGroupIds
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

	// Determine those group ids the user belongs to for the appeals domain
	const appealGroupIds = intersection(Object.values(config.referenceData.appeals), userGroups);

	// Determine those group ids the user belongs to for the applications domain
	const applicationGroupIds = intersection(
		Object.values(config.referenceData.applications),
		userGroups
	);

	// User is authenticated, but does not belong to any of the groups required to
	// visit the application

	if (applicationGroupIds.length === 0 && appealGroupIds.length === 0) {
		return response.render('app/403');
	}

	// The user belongs to a single group in the appeals service only

	if (applicationGroupIds.length === 0 && appealGroupIds.length === 1) {
		switch (appealGroupIds[0]) {
			case config.referenceData.appeals.validationOfficerGroupId:
			case config.referenceData.appeals.caseOfficerGroupId:
			case config.referenceData.appeals.inspectorGroupId:
				return response.redirect('/appeals-service/appeals-list');

			default: {
				const error = new Error('User logged in successfully but the user group is valid.');

				pino.error(error);
				return next(error);
			}
		}
	}

	// The user belongs to a single group in the applications service only

	if (applicationGroupIds.length === 1 && appealGroupIds.length === 0) {
		switch (applicationGroupIds[0]) {
			case config.referenceData.applications.caseAdminOfficerGroupId:
				return response.redirect('/applications-service/case-admin-officer');

			case config.referenceData.applications.caseTeamGroupId:
				return response.redirect('/applications-service/case-team');

			case config.referenceData.applications.inspectorGroupId:
				return response.redirect('/applications-service/inspector');

			default: {
				const error = new Error('User logged in successfully but the user group is valid.');

				pino.error(error);
				return next(error);
			}
		}
	}

	response.render('app/dashboard', {
		referenceData: config.referenceData,
		appealGroupIds,
		applicationGroupIds
	});
}

/** @type {import('express').RequestHandler} */
export function handleHeathCheck(_, response) {
	response.send('OK');
}

/** @type {import('express').RequestHandler} */
export function viewUnauthenticatedError(_, response) {
	response.status(200).render('app/401');
}
