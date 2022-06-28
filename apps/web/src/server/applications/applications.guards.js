import config from '@pins/web/environment/config.js';
import { assertGroupAccess } from '../app/auth/auth.guards.js';
import { getSessionApplicationsDomainType } from './applications-session.service.js';

/** @typedef {import('./applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 *  Make sure the domainType of the user belongs to the list of possible roles.
 *  OR show 403 page
 *
 *  @type {import('express').RequestHandler<DomainParams>}
 */
export const assertDomainTypeAccess = (req, res, next) => {
	/** @type {Record<DomainType, string>} */
	const domainMap = {
		'case-admin-officer': config.referenceData.applications.caseAdminOfficerGroupId,
		'case-officer': config.referenceData.applications.caseOfficerGroupId,
		inspector: config.referenceData.applications.inspectorGroupId
	};
	const groupId = domainMap[req.params.domainType];

	assertGroupAccess(groupId)(req, res, next);
};

/**
 *  Make sure the domainType of the user is defined
 *  OR redirect to root
 *
 *  @type {import('express').RequestHandler<DomainParams>}
 */
export const assertDomainTypeExists = (req, res, next) => {
	const domainType = getSessionApplicationsDomainType(req.session);

	if (domainType) {
		next();
	} else {
		return res.redirect('/');
	}
};
