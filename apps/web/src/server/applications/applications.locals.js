import nunjucks from '../app/config/nunjucks.js';
import { findApplicationById } from './applications.service.js';

/** @typedef {import('./applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 * @typedef {object} ApplicationsLocals
 * @property {DomainType} domainType
 * @property {string} serviceName - The name of the service to be displayed in the page header.
 * @property {string} serviceUrl - The root url of the service.
 */

/**
 * Register the locals for templates under this domain.
 *
 * @type {import('express').RequestHandler<DomainParams, *, *, *, ApplicationsLocals>}
 */
export const registerLocals = ({ baseUrl, params }, response, next) => {
	response.locals.domainType = params.domainType;
	response.locals.serviceName = 'Planning Inspectorate Applications';
	response.locals.serviceUrl = baseUrl;

	nunjucks.addFilter('displayValue', (/** @type {DomainType} */ key) => {
		switch (key) {
			case 'case-admin-officer':
				return 'Case admin officer';
			case 'case-officer':
				return 'Case officer';
			case 'inspector':
				return 'Inspector';
			default:
				return '';
		}
	});

	next();
};

/**
 * @typedef {object} ApplicationLocals
 * @property {number} applicationId
 * @property {import('./applications.types').Application} application
 */

/**
 * Use the `applicationId` parameter to install the application onto the request
 * locals, for consumption in subsequent guards and controllers.
 *
 * @type {import('@pins/express').RequestHandler<ApplicationLocals>}
 */
export const loadApplication = async (req, _, next) => {
	req.locals.applicationId = Number(req.params.applicationId);
	req.locals.application = await findApplicationById(req.locals.applicationId);
	next();
};
