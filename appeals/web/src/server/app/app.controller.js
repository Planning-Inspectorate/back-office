import config from '#environment/config.js';
import { intersection } from 'lodash-es';
import * as authSession from './auth/auth-session.service.js';

/** @typedef {import('./auth/auth.service').AccountInfo} AccountInfo */

/**
 * @typedef {object} ViewHomepageRenderOptions
 * @property {typeof config['referenceData']} referenceData
 * @property {string[]} appealGroupIds
 */

/**
 * Display a homepage tailored to the user's group memberships.
 *
 * @type {import('@pins/express').RenderHandler<ViewHomepageRenderOptions>}
 */
export const viewHomepage = async (request, response) => {
	const account = /** @type {AccountInfo} */ (authSession.getAccount(request.session));
	const userGroups = account?.idTokenClaims?.groups ?? [];
	const appealGroupIds = intersection(Object.values(config.referenceData.appeals), userGroups);

	if (appealGroupIds.length === 0) {
		return response.render('app/403');
	}

	if (appealGroupIds.length === 1) {
		switch (appealGroupIds[0]) {
			case config.referenceData.appeals.validationOfficerGroupId:
			case config.referenceData.appeals.caseOfficerGroupId:
			case config.referenceData.appeals.inspectorGroupId:
				return response.redirect('/appeals-service/appeals-list');

			default:
		}
	}

	response.render('app/dashboard');
};

/** @type {import('express').RequestHandler} */
export function handleHeathCheck(_, response) {
	response.send('OK');
}

/** @type {import('express').RequestHandler} */
export function viewUnauthenticatedError(_, response) {
	response.status(200).render('app/401');
}
