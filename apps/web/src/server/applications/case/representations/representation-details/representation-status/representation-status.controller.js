import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import { getRepresentationStatusViewModel } from './representation-status.view-model.js';
import { getFormattedErrorSummary } from '../representation-details.utilities.js';
import {
	getRepresentationDetailsPageUrl,
	getStatusResultPageUrl
} from './representation-status.utils.js';
import { patchRepresentation } from '../applications-relevant-rep-details.service.js';

const view =
	'applications/representations/representation-details/representation-status/representation-status.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationStatusController = async (req, res) => {
	const { caseId, representationId } = req.params;
	const newStatusEdit = req.query.changeStatus;

	const representationDetails = await getRepresentationDetails(caseId, representationId);

	if (newStatusEdit) representationDetails.status = newStatusEdit;

	return res.render(view, {
		...getRepresentationStatusViewModel(
			caseId,
			representationId,
			!!newStatusEdit,
			representationDetails
		)
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
			...getRepresentationStatusViewModel(
				caseId,
				String(representationId),
				false,
				representationDetails
			),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	if (payload.status === 'VALID') {
		await patchRepresentation(caseId, String(representationId), payload);
		res.redirect(getRepresentationDetailsPageUrl(caseId, String(representationId)));
	} else {
		res.redirect(
			`${getStatusResultPageUrl(caseId, String(representationId))}?changeStatus=${payload.status}`
		);
	}
};
