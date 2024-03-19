import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import { getFormattedErrorSummary } from '../../representation/representation.utilities.js';
import { patchRepresentationDetailsChangeRedaction } from './change-redaction.service.js';
import { getRepresentationDetailsChangeRedactionViewModel } from './change-redaction.view-model.js';
import * as authSession from '../../../../../app/auth/auth-session.service.js';

const view = 'applications/representations/representation-details/change-redaction.njk';

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}, {repId: string, caseId: string}>}
 */
export const getRepresentationDetailsChangeRedactionController = async (req, res) => {
	const { caseId, repId } = res.locals;
	const representationDetails = await getRepresentationDetails(caseId, repId);

	return res.render(
		view,
		getRepresentationDetailsChangeRedactionViewModel(representationDetails, caseId, repId)
	);
};

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {  changeRedaction: string }, {}, {representationId: string, caseId: string}>}
 */
export const postRepresentationDetailsChangeRedactionController = async (req, res) => {
	const { body, errors, session } = req;
	const { caseId, repId } = res.locals;

	const representationDetails = await getRepresentationDetails(caseId, repId);
	if (errors) {
		return res.render(view, {
			...getRepresentationDetailsChangeRedactionViewModel(representationDetails, caseId, repId),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	await patchRepresentationDetailsChangeRedaction(caseId, repId, {
		redactStatus: body.changeRedaction === 'true',
		actionBy: authSession.getAccount(session)?.name
	});

	return res.redirect(
		`/applications-service/case/${caseId}/relevant-representations/${repId}/representation-details`
	);
};
