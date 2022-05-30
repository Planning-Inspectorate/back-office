import { lowerCase } from 'lodash-es';
import { findAppealById, findFullPlanningAppealById } from './case-officer.service.js';

/**
 * @typedef {object} CaseOfficerLocals
 * @property {'xl'} containerSize
 * @property {string} serviceName
 * @property {string} serviceUrl
 */

/** @type {import('express').RequestHandler} */
export const registerCaseOfficerLocals = ({ baseUrl }, response, next) => {
	response.locals.containerSize = 'xl';
	response.locals.serviceName = 'Appeal a planning decision';
	response.locals.serviceUrl = baseUrl;
	next();
};

/**
 * @typedef {object} AppealLocals
 * @property {number} appealId
 * @property {import('@pins/appeals').CaseOfficer.Appeal} appeal
 */

/**
 * Use the appealId parameter to install the appeal onto the request locals, for
 * consumption in subsequent guards and controllers.
 *
 * @type {import('@pins/express').RequestHandler<AppealLocals>}
 */
export const loadAppeal = async (req, _, next) => {
	req.locals.appealId = Number(req.params.appealId);
	req.locals.appeal = await findAppealById(req.locals.appealId);
	next();
};

/** @type {import('@pins/express').RequestHandler<AppealLocals>} */
export const loadFullPlanningAppeal = async (req, _, next) => {
	req.locals.appealId = Number(req.params.fullPlanningAppealId);
	req.locals.appeal = await findFullPlanningAppealById(req.locals.appealId);
	next();
};

/**
 * @typedef {object} AppealDocumentLocals
 * @property {import('@pins/appeals').DocumentType } documentType
 */

/** @type {import('@pins/express').RequestHandler<AppealDocumentLocals>} */
export const addDocumentType = ({ locals, params }, _, next) => {
	locals.documentType = /** @type {import('@pins/appeals').DocumentType} */ (
		lowerCase(params.documentType)
	);
	next();
};
