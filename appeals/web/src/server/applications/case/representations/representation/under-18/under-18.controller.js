import { patchRepresentation } from '../representation.service.js';
import { getRepresentationTypeViewModel } from './under-18.view-model.js';
import { getRepresentationPageUrl } from '../representation.utilities.js';

const view = 'applications/representations/representation/under-18.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationUnder18 = async (req, res) => {
	const { query } = req;

	return res.render(view, {
		...getRepresentationTypeViewModel(query, res.locals)
	});
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postRepresentationUnder18 = async (req, res) => {
	const { body, params, query } = req;
	const { caseId } = params;
	const { repId, repType } = query;

	if (body.under18 === '') {
		body.under18 = null;
	} else {
		body.under18 = body.under18 === 'true';
	}

	await patchRepresentation(caseId, String(repId), String(repType), body);

	return res.redirect(
		getRepresentationPageUrl('representation-entity', String(repId), String(repType))
	);
};
