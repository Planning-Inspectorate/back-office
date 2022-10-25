import {
	getSessionApplicationsDomainType,
	setSessionApplicationsDomainType
} from './applications-session.service.js';
import { getCase } from './lib/services/case.service.js';

/** @typedef {import('./applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications.types').DomainType} DomainType */
/** @typedef {import('../app/auth/auth.service').AccountInfo} AccountInfo */

/**
 * @typedef {object} ApplicationsLocals
 * @property {DomainType} domainType
 * @property {string} serviceName - The name of the service to be displayed in the page header.
 * @property {string} serviceUrl - The root url of the service.
 */

/**
 * @typedef {object} ApplicationLocals
 * @property {number} caseId
 * @property {import('./applications.types').Case} Case
 */

/**
 * Register the non-domain locals for the Applications scope
 *
 * @type {import('express').RequestHandler<DomainParams, *, *, *, ApplicationsLocals>}
 */
export const registerLocals = ({ baseUrl, session }, response, next) => {
	response.locals.serviceName = 'Planning Inspectorate Applications';
	response.locals.serviceUrl = baseUrl;

	const applicationsDomainType = getSessionApplicationsDomainType(session);

	if (applicationsDomainType) {
		response.locals.domainType = applicationsDomainType;
	}

	next();
};

/**
 * Register the domain type and save it for non-domain pages in the Applications scope.
 *
 * @type {import('express').RequestHandler<DomainParams, *, *, *, ApplicationsLocals>}
 */
export const registerDomainLocals = ({ params, session }, response, next) => {
	response.locals.domainType = params.domainType;
	setSessionApplicationsDomainType(session, params.domainType);

	next();
};

/**
 * Use the `caseId` parameter to install the Caseonto the request
 * locals, for consumption in subsequent guards and controllers.
 *
 * @type {import('@pins/express').RequestHandler<ApplicationLocals>}
 */
export const registerCase = async (req, response, next) => {
	response.locals.caseId = Number(req.params.caseId);
	response.locals.case = await getCase(response.locals.caseId);

	next();
};
