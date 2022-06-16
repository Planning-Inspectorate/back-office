import config from '@pins/web/environment/config.js';
import { assertGroupAccess } from '../app/auth/auth.guards.js';

/** @typedef {import('./applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications.types').DomainType} DomainType */

/** @type {import('express').RequestHandler<DomainParams>} */
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
