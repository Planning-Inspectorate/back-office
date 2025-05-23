import { patchRepresentationNoMap } from '../representation.service.js';
import { getFormattedErrorSummary } from '../representation.utilities.js';
import { getRepresentationTypeViewModel } from './representation-type.view-model.js';

const view = 'applications/representations/representation/representation-type.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationType = async (req, res) =>
	res.render(view, getRepresentationTypeViewModel(req.query, res.locals));

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postRepresentationType = async (req, res) => {
	const { body, errors, params, query } = req;
	const { locals } = res;
	const { caseId } = params;
	const { repId, repType } = query;

	if (errors) {
		return res.render(view, {
			...getRepresentationTypeViewModel(query, locals),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	await patchRepresentationNoMap(caseId, String(repId), String(repType), body);

	return res.redirect(locals.representation.pageLinks.redirectUrl);
};
