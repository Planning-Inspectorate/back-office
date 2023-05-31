import { patchRepresentation, postRepresentation } from '../representation.service.js';
import {
	getFormattedErrorSummary,
	getRepresentationPageUrl,
	replaceRepresentaionValuesAsBodyValues
} from '../representation.utilities.js';
import { getContactDetailsViewModel } from './contact-details.view-model.js';

const view = 'applications/representations/representation/contact-details.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getContactDetails = async (req, res) => {
	return res.render(view, {
		...getContactDetailsViewModel(String(req.query.repType), res.locals)
	});
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postContactDetails = async (req, res) => {
	const { body, errors, params, query } = req;
	const { locals } = res;
	const { representaion } = locals;
	const { caseId } = params;
	const { repId, repType } = query;

	console.log('Biody - ', body);

	if (errors) {
		return res.render(view, {
			pageKey: repType,
			...getContactDetailsViewModel(String(repType), locals),
			...replaceRepresentaionValuesAsBodyValues(representaion, body, String(repType)),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	const nextPagePath = `address-lookup`;

	let redirectUrl = getRepresentationPageUrl(nextPagePath, String(repId), String(repType));

	if (repId) await patchRepresentation(caseId, String(repId), String(repType), body);
	else {
		const { id } = await postRepresentation(caseId, String(repType), body);

		redirectUrl = getRepresentationPageUrl(nextPagePath, id, String(repType));
	}

	return res.redirect(redirectUrl);
};
