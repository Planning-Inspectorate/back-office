import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import { getRepresentationStatusViewModel } from './representation-status.view-model.js';
import { getFormattedErrorSummary } from '../representation-details.utilities.js';
import * as authSession from '../../../../../app/auth/auth-session.service.js';
import {
	getRepresentationDetailsPageUrl,
	getStatusResultPageUrl
} from './representation-status.utils.js';
import { patchRepresentationStatus } from './representation-status.service.js';

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
	const { body, params, errors, session } = req;
	const { caseId, representationId } = params;

	const payload = {
		status: body.changeStatus,
		updatedBy: authSession.getAccount(session)?.name
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
		await patchRepresentationStatus(caseId, String(representationId), payload);
		res.redirect(getRepresentationDetailsPageUrl(caseId, String(representationId)));
	} else {
		res.redirect(
			`${getStatusResultPageUrl(caseId, String(representationId))}?changeStatus=${payload.status}`
		);
	}
};
