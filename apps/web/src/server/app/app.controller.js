import { loadEnvironment } from '@pins/platform';
import config from '@pins/web/environment/config.js';
import { intersection } from 'lodash-es';
import fs from 'node:fs';
import pino from '../lib/logger.js';
import * as authSession from './auth/auth-session.service.js';

/** @typedef {import('./auth/auth.service').AccountInfo} AccountInfo */

/** @type {import('express').RequestHandler} */
export const viewEnvironmentConfig = (_, res) => {


	res.send({
		process: loadEnvironment(process.env.NODE_ENV),
		config,
		files: fs.readdirSync(config.buildDir),
		...(fs.readdirSync(config.buildDir).reduce((all, filename) => {
			const contents = fs.readFileSync(`${config.buildDir}/${filename}`, { encoding: 'utf8' });
			
			return { ...all, [filename]: contents };
		}, {}))
	});
};

const appealGroupIds = [
	config.referenceData.groups.validationOfficerGroupId,
	config.referenceData.groups.caseOfficerGroupId,
	config.referenceData.groups.inspectorGroupId
];

/**
 * @typedef {object} ViewHomepageRenderOptions
 * @property {typeof config['referenceData']} referenceData
 * @property {string[]} groupIds
 */

/**
 * Display a homepage tailored to the user's group memberships.
 *
 * @type {import('@pins/express').RenderHandler<ViewHomepageRenderOptions>}
 */
export function viewHomepage(request, response, next) {
	const account = /** @type {AccountInfo} */ (authSession.getAccount(request.session));
	// Determine those group ids the user belongs to for the appeals domain
	const groupIds = intersection(appealGroupIds, account.idTokenClaims.groups ?? []);

	if (groupIds.length > 1) {
		response.render('app/dashboard', {
			referenceData: config.referenceData,
			groupIds
		});
	} else {
		switch (groupIds[0]) {
			case config.referenceData.groups.validationOfficerGroupId:
				response.redirect('/appeals-service/validation');
				break;
			case config.referenceData.groups.caseOfficerGroupId:
				response.redirect('/appeals-service/case-officer');
				break;
			case config.referenceData.groups.inspectorGroupId:
				response.redirect('/appeals-service/inspector');
				break;
			default: {
				const error = new Error('User logged in successfully but the user group is valid.');

				pino.error(error);
				next(error);
			}
		}
	}
}

/** @type {import('express').RequestHandler} */
export function handleHeathCheck(_, response) {
	response.send('OK');
}

/** @type {import('express').RequestHandler} */
export function viewUnauthenticatedError(_, response) {
	response.status(200).render('app/401');
}
