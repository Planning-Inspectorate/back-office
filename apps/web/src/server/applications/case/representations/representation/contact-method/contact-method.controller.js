import { patchRepresentation } from '../representation.service.js';
import { getFormattedErrorSummary, getRepresentationPageUrl } from '../representation.utilities.js';
import { getContactMethodViewModel } from './contact-method.view-model.js';

const view = 'applications/representations/representation/contact-method.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getContactMethod = async (req, res) => {
	const { query } = req;
	return res.render(view, {
		...getContactMethodViewModel(query, res.locals)
	});
};

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

	const nextPagePath = `representation-type`;

	await patchRepresentation(caseId, String(repId), String(repType), body);

	let redirectUrl = getRepresentationPageUrl(nextPagePath, String(repId), String(repType));

	return res.redirect(redirectUrl);
};
