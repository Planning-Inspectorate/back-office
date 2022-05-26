import { findAppealById } from './inspector.service.js';
import { siteVisitTimeSlots } from './inspector.validators.js';

/**
 * @typedef {object} InspectorLocals
 * @property {object} constants - Any domain constants to make available to nunjucks.
 * @property {'xl' | 'default'} containerSize - The width of the page in this domain.
 * @property {string} serviceName - The name of the service to be displayed in the page header.
 * @property {string} serviceUrl - The root url of the service.
 */

/**
 * Register the locals for templates under this domain.
 *
 * @type {import('express').RequestHandler<*, *, *, *, InspectorLocals>}
 */
export const registerInspectorLocals = ({ baseUrl }, response, next) => {
	response.locals.containerSize = 'xl';
	response.locals.serviceName = 'Appeal a planning decision';
	response.locals.serviceUrl = baseUrl;
	response.locals.constants = { siteVisitTimeSlots };
	next();
};

/**
 * @typedef {object} AppealLocals
 * @property {number} appealId
 * @property {import('@pins/appeals').Inspector.Appeal} appeal
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
