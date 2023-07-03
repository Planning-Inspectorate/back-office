import * as authSession from '../../../../../../app/auth/auth-session.service.js';
import { patchRepresentationStatus } from '../representation-status.service.js';
import { getRepresentationDetails } from '../../applications-relevant-rep-details.service.js';
import { getRepresentationStatusNotesViewModel } from './representation-status-notes.view-model.js';
import { getFormattedErrorSummary } from '../../representation-details.utilities.js';
import {
	mapStatusPayload,
	getRepresentationDetailsPageUrl
} from '../representation-status.utils.js';

const view =
	'applications/representations/representation-details/representation-status/representation-status-notes.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationStatusNotesController = async (req, res) => {
	const { caseId, representationId } = req.params;
	const newStatus = req.query.changeStatus;

	const representationDetails = await getRepresentationDetails(caseId, representationId);
	representationDetails.status = newStatus;

	return res.render(view, {
		...getRepresentationStatusNotesViewModel(caseId, representationId, representationDetails)
	});
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

export const postRepresentationStatusNotesController = async (req, res) => {
	const { body, params, errors, session } = req;
	const { caseId, representationId } = params;
	const newStatus = req.query.changeStatus;

	const payload = {
		status: String(newStatus),
		body,
		updatedBy: authSession.getAccount(session)?.name
	};
	body.testing = 'testing';
	console.log('body :>> ', body);
	console.log('mapped :>> ', mapStatusPayload(payload));
	if (errors) {
		const representationDetails = await getRepresentationDetails(caseId, String(representationId));
		representationDetails.status = newStatus;

		return res.render(view, {
			...getRepresentationStatusNotesViewModel(
				caseId,
				String(representationId),
				representationDetails
			),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	const response = await patchRepresentationStatus(
		caseId,
		String(representationId),
		mapStatusPayload(payload)
	);

	console.log('response :>> ', response);

	res.redirect(getRepresentationDetailsPageUrl(caseId, String(representationId)));
};
