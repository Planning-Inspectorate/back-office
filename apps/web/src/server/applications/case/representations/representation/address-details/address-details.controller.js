import {
	getFormattedErrorSummary,
	replaceRepresentaionValuesAsBodyValues
} from '../representation.utilities.js';
import { getAddressDetailsViewModel } from './address-details.view-model.js';
import { getStageErrors } from './utils/get-stage-errors.js';
import { patchRepresentation } from '../representation.service.js';
import { getSelectedAddress } from './utils/get-selected-address.js';
import { formatAddress } from './utils/format-address.js';

const view = 'applications/representations/representation/address-details/index.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, { repType: string, repMode: string|undefined, stage: string|undefined, postcode: string|undefined }, {}>}
 */
export const getAddressDetailsController = async (req, res) => {
	const { query } = req;
	const { repType, repMode, stage, postcode } = query;

	return res.render(
		view,
		await getAddressDetailsViewModel(query, res.locals, repType, repMode, stage, postcode)
	);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postAddressDetailsController = async (req, res) => {
	const { body, errors, params, query } = req;
	const { caseId } = params;
	const { repId, repType, repMode } = query;
	const { lookupPostcode, setPostcode, stage } = body;
	const { locals } = res;
	const { representation } = locals;

	const postcode = stage === 'lookup' ? lookupPostcode : setPostcode;

	const stageErrors = errors ? getStageErrors(errors, stage) : null;

	if (stageErrors) {
		return res.render(view, {
			...(await getAddressDetailsViewModel(
				query,
				locals,
				String(repType),
				String(repMode),
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
			await getAddressDetailsViewModel(
				query,
				locals,
				String(repType),
				String(repMode),
				'find',
				postcode
			)
		);

	const address = stage === 'find' ? await getSelectedAddress(body, postcode) : body;

	await patchRepresentation(caseId, String(repId), String(repType), formatAddress(address));

	res.redirect(representation.pageLinks.redirectUrl);
};
