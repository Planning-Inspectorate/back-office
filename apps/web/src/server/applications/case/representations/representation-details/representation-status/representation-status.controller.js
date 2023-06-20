import { patchRepresentation } from '../applications-relevant-rep-details.service.js';
import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import {
	getRepresentationStatusViewModel,
	getPreviousPageUrl,
	getNextPageUrl
} from './representation-status.view-model.js';
import { getFormattedErrorSummary } from '../representation-details.utilities.js';

const view =
	'applications/representations/representation-details/representation-status/representation-status.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationStatusController = async (req, res) => {
	const { caseId, representationId } = req.params;

	const representationDetails = await getRepresentationDetails(caseId, representationId);

	return res.render(view, {
		...getRepresentationStatusViewModel(caseId, representationId, representationDetails)
	});
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

export const postRepresentationStatus = async (req, res) => {
	const { body, params, errors } = req;
	const { caseId, representationId } = params;

	const payload = {
		status: body.changeStatus
	};

	if (errors) {
		const representationDetails = await getRepresentationDetails(caseId, String(representationId));

		return res.render(view, {
			...getRepresentationStatusViewModel(caseId, String(representationId), representationDetails),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	const response = await patchRepresentation(caseId, String(representationId), payload);

	if (response.status === 'VALID') {
		res.redirect(getPreviousPageUrl(caseId, String(representationId)));
	} else {
		res.redirect(getNextPageUrl(caseId, String(representationId)));
	}
};
