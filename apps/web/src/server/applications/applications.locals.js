import config from '@pins/web/environment/config.js';
import { intersection } from 'lodash-es';
import * as authSession from '../app/auth/auth-session.service.js';
import { findApplicationById } from './applications.service.js';

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
 * Register the locals for templates under this domain.
 *
 * @type {import('express').RequestHandler<DomainParams, *, *, *, ApplicationsLocals>}
 */
export const registerLocals = ({ baseUrl, session }, response, next) => {
	response.locals.serviceName = 'Planning Inspectorate Applications';
	response.locals.serviceUrl = baseUrl;

	const account = /** @type {AccountInfo} */ (authSession.getAccount(session));
	const userGroups = account.idTokenClaims.groups ?? [];

	// Determine those group ids the user belongs to for the applications domain
	const applicationGroupIds = intersection(
		Object.values(config.referenceData.applications),
		userGroups
	) ?? [''];

	const userApplicationGroup = applicationGroupIds[0];

	/** @type {Record<string, DomainType>} */
	const domainMap = {
		[config.referenceData.applications.caseAdminOfficerGroupId]: 'case-admin-officer',
		[config.referenceData.applications.caseOfficerGroupId]: 'case-officer',
		[config.referenceData.applications.inspectorGroupId]: 'inspector'
	};

	const domainType = domainMap[userApplicationGroup];

	if (domainType) {
		response.locals.domainType = domainType;
	}

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
