import { patchRepresentation, postRepresentation } from '../representation.service.js';
import {
	getFormattedErrorSummary,
	replaceRepresentaionValuesAsBodyValues
} from '../representation.utilities.js';
import { buildRepresentationPageURL } from '../utils/get-representation-page-urls.js';
import { getContactDetailsViewModel } from './contact-details.view-model.js';

const view = 'applications/representations/representation/contact-details.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getContactDetails = async (req, res) =>
	res.render(view, getContactDetailsViewModel(req.query, res.locals));

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postContactDetails = async (req, res) => {
	const { body, errors, params, query } = req;
	const { locals } = res;
	const { representation } = locals;
	const { caseId } = params;
	const { repId, repType } = query;

	if (errors) {
		return res.render(view, {
			pageKey: repType,
			...getContactDetailsViewModel(query, locals),
			...replaceRepresentaionValuesAsBodyValues(representation, body, String(repType)),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	let redirectUrl = representation.pageLinks.redirectUrl;

	if (repId) await patchRepresentation(caseId, String(repId), String(repType), body);
	else {
		const { id } = await postRepresentation(caseId, String(repType), body);

		redirectUrl = buildRepresentationPageURL('/address-details', caseId, id, String(repType));
	}

	return res.redirect(redirectUrl);
};
