import {
	getFormattedErrorSummary,
	getRepresentationPageUrl,
	replaceRepresentaionValuesAsBodyValues
} from '../representation.utilities.js';
import { getAddressDetailsViewModel } from './address-details.view-model.js';
import { getStageErrors } from './utils/get-stage-errors.js';
import { patchRepresentation } from '../representation.service.js';
import { getSelectedAddress } from './utils/get-selected-address.js';
import { formatAddress } from './utils/format-address.js';

const view = 'applications/representations/representation/address-details/index.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, { repId: string, repType: string, stage: string|undefined, postcode: string|undefined }, {}>}
 */
export const getAddressDetailsController = async (req, res) => {
	const { query } = req;
	const { repId, repType, stage, postcode } = query;
	const { locals } = res;

	return res.render(
		view,
		await getAddressDetailsViewModel(String(repId), String(repType), locals, stage, postcode)
	);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postAddressDetailsController = async (req, res) => {
	const { body, errors, params, query } = req;
	const { caseId } = params;
	const { repId, repType } = query;
	const { lookupPostcode, setPostcode, stage } = body;
	const { locals } = res;
	const { representation } = locals;

	const postcode = stage === 'lookup' ? lookupPostcode : setPostcode;

	const stageErrors = errors ? getStageErrors(errors, stage) : null;

	if (stageErrors) {
		return res.render(view, {
			...(await getAddressDetailsViewModel(
				String(repId),
				String(repType),
				locals,
				stage,
				postcode
			)),
			...replaceRepresentaionValuesAsBodyValues(
				representation,
				formatAddress(body),
				String(repType)
			),
			errors: stageErrors,
			errorSummary: getFormattedErrorSummary(stageErrors)
		});
	}

	if (stage === 'lookup')
		return res.render(
			view,
			await getAddressDetailsViewModel(String(repId), String(repType), locals, 'find', postcode)
		);

	const address = stage === 'find' ? await getSelectedAddress(body, postcode) : body;

	await patchRepresentation(caseId, String(repId), String(repType), formatAddress(address));

	res.redirect(getRepresentationPageUrl(`contact-method`, String(repId), String(repType)));
};
