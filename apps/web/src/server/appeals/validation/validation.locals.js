import { lowerCase } from 'lodash-es';
import { findAppealById } from './validation.service.js';

/**
 * @typedef {object} ValidationLocals
 * @property {string} baseUrl - The root url of the service.
 * @property {string} serviceName - The name of the service to be displayed in the page header.
 */

/**
 * Expose the default template locals to nunjucks for the validation domain.
 *
 * @type {import('express').RequestHandler<*, *, *, *, ValidationLocals>}
 */
export const registerValidationLocals = ({ baseUrl }, response, next) => {
	response.locals.baseUrl = baseUrl;
	response.locals.serviceName = 'Appeal a planning decision';
	next();
};

/**
 * @typedef {object} AppealLocals
 * @property {number} appealId
 * @property {import('@pins/appeals').Validation.Appeal} appeal
 */

/**
 * Use the appealId parameter to install the appeal onto the request locals, for
 * consumption in subsequent guards and controllers.
 *
 * @type {import('@pins/express').RequestHandler<AppealLocals>}
 */
export const loadAppeal = async (req, res, next) => {
	try {
		req.locals.appealId = Number(req.params.appealId);
		req.locals.appeal = await findAppealById(req.locals.appealId);
		next();
	} catch (error) {
		const requestError = /** @type {import('got').RequestError} */ (error);

		if (requestError.response?.statusCode === 409) {
			res.render('appeals/validation/appeal-error', { errorMessage: 'Appeal already reviewed' });
		} else {
			next(error);
		}
	}
};

/**
 * @typedef {object} AppealDocumentLocals
 * @property {import('@pins/appeals').Validation.AppealDocumentType } documentType
 */

/** @type {import('@pins/express').RequestHandler<AppealDocumentLocals>} */
export const addDocumentType = ({ locals, params }, _, next) => {
	locals.documentType = /** @type {import('@pins/appeals').Validation.AppealDocumentType} */ (
		lowerCase(params.documentType)
	);
	next();
};
