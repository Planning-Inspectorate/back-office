import * as authSession from './auth-session.service.js';
import config from '@pins/appeals.web/environment/config.js';

/** @type {import('express').RequestHandler} */
export const registerAuthLocals = ({ session }, res, next) => {
	const account = authSession.getAccount(session);
	res.locals.isAuthenticated = Boolean(account);
	res.locals.permissions = permissions(account?.idTokenClaims.groups || []);
	next();
};

/** @type {import('express').RequestHandler} */
export const clearAuthenticationData = ({ session }, _, next) => {
	authSession.destroyAuthenticationData(session);
	next();
};

/** @typedef {Record<('setSiteVisit'|'setAppealStatus'|'setAppellantCaseStatus'|'setLpaQStatus'|'setAppealCaseData'|'setAppellantCaseData'|'setLpaQCaseData'), boolean>} CurrentPermissionSet */

/**
 * @param {string[]} currentUserGroups
 * @returns {CurrentPermissionSet}
 */
const permissions = (currentUserGroups) => {
	const isInspector = currentUserGroups.includes(config.referenceData.appeals.inspectorGroupId);
	const isCaseOfficer = currentUserGroups.includes(config.referenceData.appeals.caseOfficerGroupId);

	return {
		setSiteVisit: isInspector || isCaseOfficer,
		setAppealStatus: isCaseOfficer,
		setAppellantCaseStatus: isCaseOfficer,
		setLpaQStatus: isCaseOfficer,
		setAppealCaseData: isCaseOfficer,
		setAppellantCaseData: isCaseOfficer,
		setLpaQCaseData: isCaseOfficer
	};
};
