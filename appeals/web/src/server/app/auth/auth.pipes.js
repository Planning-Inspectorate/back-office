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
	return {
		setSiteVisit: currentUserGroups.indexOf(config.referenceData.appeals.inspectorGroupId) >= 0,
		setAppealStatus:
			currentUserGroups.indexOf(config.referenceData.appeals.caseOfficerGroupId) >= 0,
		setAppellantCaseStatus:
			currentUserGroups.indexOf(config.referenceData.appeals.caseOfficerGroupId) >= 0,
		setLpaQStatus: currentUserGroups.indexOf(config.referenceData.appeals.caseOfficerGroupId) >= 0,
		setAppealCaseData:
			currentUserGroups.indexOf(config.referenceData.appeals.caseOfficerGroupId) >= 0,
		setAppellantCaseData:
			currentUserGroups.indexOf(config.referenceData.appeals.caseOfficerGroupId) >= 0,
		setLpaQCaseData: currentUserGroups.indexOf(config.referenceData.appeals.caseOfficerGroupId) >= 0
	};
};
