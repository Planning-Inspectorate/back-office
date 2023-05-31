import * as authSession from '../../../../../app/auth/auth-session.service.js';

import { getCase } from '../../applications-relevant-reps.service.js';
import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import {
	getPreviousPageUrl,
	getRedactRepresentationViewModel
} from './redact-representation.view-model.js';
import { patchRepresentationRedact } from './redact-represntation.service.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRedactRepresentationController = async (req, res) => {
	const { caseId, representationId } = req.params;

	const caseReference = await getCase(caseId);
	const representationDetails = await getRepresentationDetails(caseId, representationId);

	return res.render(
		'applications/representations/representation-details/redact-representation/redact-representation.njk',
		getRedactRepresentationViewModel(
			caseId,
			representationId,
			representationDetails,
			caseReference.title,
			caseReference.status
		)
	);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postRedactRepresentationController = async (req, res) => {
	const {
		body,
		params: { caseId, representationId },
		session
	} = req;

	body.actionBy = authSession.getAccount(session)?.name;

	await patchRepresentationRedact(caseId, representationId, body);

	res.redirect(getPreviousPageUrl(caseId, representationId));
};
