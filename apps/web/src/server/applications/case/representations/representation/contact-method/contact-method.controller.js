import { patchRepresentation } from '../representation.service.js';
import { getFormattedErrorSummary } from '../representation.utilities.js';
import { getContactMethodViewModel } from './contact-method.view-model.js';

const view = 'applications/representations/representation/contact-method.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getContactMethod = async (req, res) =>
	res.render(view, getContactMethodViewModel(req.query, res.locals));

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postContactMethod = async (req, res) => {
	const { body, errors, params, query } = req;
	const { locals } = res;
	const { caseId } = params;
	const { repId, repType } = query;

	if (errors) {
		return res.render(view, {
			pageKey: repType,
			...getContactMethodViewModel(query, locals),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	await patchRepresentation(caseId, String(repId), String(repType), body);

	return res.redirect(locals.representation.pageLinks.redirectUrl);
};
