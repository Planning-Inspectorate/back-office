import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import { getFormattedErrorSummary } from '../../representation/representation.utilities.js';
import { patchRepresentationDetailsChangeRedaction } from './change-redaction.service.js';
import { getRepresentationDetailsChangeRedactionViewModel } from './change-redaction.view-model.js';
import * as authSession from '../../../../../app/auth/auth-session.service.js';

const view = 'applications/representations/representation-details/change-redaction.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}, {representationId: string, caseId: string}>}
 */
export const getRepresentationDetailsChangeRedactionController = async (req, res) => {
	const { caseId, representationId } = res.locals;
	const representationDetails = await getRepresentationDetails(caseId, representationId);

	return res.render(
		view,
		getRepresentationDetailsChangeRedactionViewModel(
			representationDetails,
			caseId,
			representationId
		)
	);
};

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {  changeRedaction: string }, {}, {representationId: string, caseId: string}>}
 */
export const postRepresentationDetailsChangeRedactionController = async (req, res) => {
	const { body, errors, session } = req;
	const { caseId, representationId } = res.locals;

	const representationDetails = await getRepresentationDetails(caseId, representationId);
	if (errors) {
		return res.render(view, {
			...getRepresentationDetailsChangeRedactionViewModel(
				representationDetails,
				caseId,
				representationId
			),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	await patchRepresentationDetailsChangeRedaction(caseId, representationId, {
		redactStatus: body.changeRedaction === 'true',
		actionBy: authSession.getAccount(session)?.name
	});

	return res.redirect(
		`/applications-service/case/${caseId}/relevant-representations/${representationId}/representation-details`
	);
};
