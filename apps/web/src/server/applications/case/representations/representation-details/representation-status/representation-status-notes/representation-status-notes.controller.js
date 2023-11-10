import * as authSession from '../../../../../../app/auth/auth-session.service.js';
import { patchRepresentationStatus } from '../representation-status.service.js';
import { getRepresentationDetails } from '../../applications-relevant-rep-details.service.js';
import { getRepresentationStatusNotesViewModel } from './representation-status-notes.view-model.js';
import { getFormattedErrorSummary } from '../../../representation/representation.utilities.js';
import {
	mapStatusPayload,
	getRepresentationDetailsPageUrl
} from '../representation-status.utils.js';
import { isRepresentationDepublished } from './utils/is-representation-depublished.js';

const view =
	'applications/representations/representation-details/representation-status/representation-status-notes.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, { representationId: string, caseId: string, changeStatus: string }, { caseId: string, representationId: string}>}
 */
export const getRepresentationStatusNotesController = async (req, res) => {
	const { caseId, representationId } = req.params;
	const newStatus = req.query.changeStatus;

	const representationDetails = await getRepresentationDetails(caseId, representationId);

	return res.render(view, {
		...getRepresentationStatusNotesViewModel(
			caseId,
			representationId,
			representationDetails,
			newStatus
		)
	});
};

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, { representationId: string, caseId: string, changeStatus: string }, { caseId: string, representationId: string}>}
 */
export const postRepresentationStatusNotesController = async (req, res) => {
	const { body, params, errors, session } = req;
	const { caseId, representationId } = params;
	const { changeStatus: newStatus } = req.query;

	const representationDetails = await getRepresentationDetails(caseId, representationId);
	const { status: oldStatus } = representationDetails;

	if (errors) {
		return res.render(view, {
			...getRepresentationStatusNotesViewModel(
				caseId,
				representationId,
				representationDetails,
				newStatus
			),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	const payload = {
		status: newStatus,
		body,
		updatedBy: authSession.getAccount(session)?.name
	};

	await patchRepresentationStatus(caseId, String(representationId), mapStatusPayload(payload));

	if (isRepresentationDepublished(oldStatus, newStatus))
		return res.redirect(
			`${getRepresentationDetailsPageUrl(caseId, String(representationId))}?depublished=true`
		);

	return res.redirect(getRepresentationDetailsPageUrl(caseId, String(representationId)));
};
