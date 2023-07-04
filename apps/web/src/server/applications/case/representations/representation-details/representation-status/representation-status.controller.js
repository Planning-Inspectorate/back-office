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
export const getRepresentationStatusController = async ({ params, query }, res) => {
	const { caseId, representationId } = params;
	const { changeStatus } = query;

	const representationDetails = await getRepresentationDetails(caseId, representationId);

	return res.render(view, {
		...getRepresentationStatusViewModel(
			caseId,
			representationId,
			representationDetails,
			changeStatus
		)
	});
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

export const postRepresentationStatus = async ({ body, params, errors, session }, res) => {
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
				representationDetails,
				false
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
