import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import { getEditRepresentationViewModel } from './edit-representation.view-model.js';
import { getFormattedErrorSummary } from '../../representation/representation.utilities.js';
import { patchEditRepresentation } from './edit-representation.service.js';
import * as authSession from '../../../../../app/auth/auth-session.service.js';

const view = 'applications/representations/representation-details/edit-representation.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}, {representationId: string, caseId: string, case: { title: string }}>}
 */
export const getEditRepresentationController = async (req, res) => {
	const {
		caseId,
		representationId,
		case: { title }
	} = res.locals;
	const representationDetails = await getRepresentationDetails(caseId, representationId);

	return res.render(
		view,
		getEditRepresentationViewModel(representationDetails, caseId, representationId, title, null)
	);
};

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {  editedRepresentation: string, editNotes: string }, {}, {representationId: string, caseId: string}>}
 */
export const postEditRepresentationController = async (req, res) => {
	const { body, errors, session } = req;
	const {
		caseId,
		representationId,
		case: { title }
	} = res.locals;

	const representationDetails = await getRepresentationDetails(caseId, representationId);
	if (errors) {
		return res.render(view, {
			...getEditRepresentationViewModel(
				representationDetails,
				caseId,
				representationId,
				title,
				errors
			),
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	await patchEditRepresentation(caseId, representationId, {
		editedRepresentation: body.editedRepresentation,
		editNotes: body.editNotes,
		actionBy: authSession.getAccount(session)?.name
	});

	return res.redirect(
		`/applications-service/case/${caseId}/relevant-representations/${representationId}/representation-details`
	);
};
