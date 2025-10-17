import { patchRepresentation, postRepresentation } from '../representation.service.js';
import {
	getFormattedErrorSummary,
	replaceRepresentaionValuesAsBodyValues,
	formatContactDetails
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

	// Log the raw incoming data
	console.log('Raw body:', body);

	// Trim the incoming data
	const trimmedBody = formatContactDetails(body);

	// Log the trimmed data
	console.log('Trimmed body:', trimmedBody);

	if (errors) {
		return res.render(view, {
			pageKey: repType,
			...getContactDetailsViewModel(query, locals),
			...replaceRepresentaionValuesAsBodyValues(representation, trimmedBody, String(repType)),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	let redirectUrl = representation.pageLinks.redirectUrl;

	if (repId) {
		// Log the update operation
		console.log(`Updating representation with ID: ${repId}`);
		await patchRepresentation(caseId, String(repId), String(repType), trimmedBody);
	} else {
		// Log the creation operation
		console.log('Creating new representation');
		const { id } = await postRepresentation(caseId, String(repType), trimmedBody);

		redirectUrl = buildRepresentationPageURL('/address-details', caseId, id, String(repType));
	}

	// Log the redirect URL
	console.log('Redirecting to:', redirectUrl);

	return res.redirect(redirectUrl);
};
