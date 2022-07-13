import { getSessionApplicationsDomainType } from '../applications-session.service.js';

/** @typedef {import('../applications.router').DomainParams} DomainParams */

/**
 *  Make sure the domainType of the user is either case-officer or case-admin-officer.
 *  OR show 403 page
 *
 *  @type {import('express').RequestHandler<DomainParams>}
 */
export const assertDomainTypeIsNotInspector = (req, res, next) => {
	const applicationsDomainType = getSessionApplicationsDomainType(req.session);

	if (
		applicationsDomainType !== 'case-officer' &&
		applicationsDomainType !== 'case-admin-officer'
	) {
		return next({ statusCode: 403, message: 'Inspector cannot access the create new case form' });
	}
	next();
};
