import * as authSession from '../../../../../app/auth/auth-session.service.js';

import { getCase } from '../../applications-relevant-reps.service.js';
import { getRepresentationDetails } from '../applications-relevant-rep-details.service.js';
import {
	getPreviousPageUrl,
	getRedactRepresentationViewModel
} from './redact-representation.view-model.js';
import {
	fetchRedactionSuggestions,
	highlightRedactionSuggestions,
	patchRepresentationRedact,
	REDACT_CHARACTER
} from './redact-representation.service.js';
import { featureFlagClient } from '../../../../../../common/feature-flags.js';
import logger from '../../../../../lib/logger.js';
import { AZURE_AI_LANGUAGE_REDACTION } from '@pins/feature-flags/src/feature-flags.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRedactRepresentationController = async (req, res) => {
	const { caseId, representationId } = res.locals;

	const caseReference = await getCase(caseId);
	const representationDetails = await getRepresentationDetails(caseId, representationId);
	const fullRepresentationDetails = {
		...representationDetails,
		editedRepresentation: representationDetails.editedRepresentation || ''
	};

	const viewModel = getRedactRepresentationViewModel(
		caseId,
		representationId,
		fullRepresentationDetails,
		caseReference.title,
		caseReference.status
	);
	let view =
		'applications/representations/representation-details/redact-representation/redact-representation-legacy.njk';

	if (
		featureFlagClient.isFeatureActiveForCase(AZURE_AI_LANGUAGE_REDACTION, caseReference.reference)
	) {
		logger.info('Redact representation page is using Azure AI Language Redaction feature');
		const redactionResult = await fetchRedactionSuggestions(viewModel.originalRepresentation);
		if (redactionResult) {
			view =
				'applications/representations/representation-details/redact-representation/redact-representation.njk';
			viewModel.containerSize = 'xl';
			viewModel.redactionSuggestions = redactionResult.entities || [];

			if (viewModel.originalRepresentation === viewModel.redactedRepresentation) {
				// 'accept' all suggestions if there haven't been any changes made by the user
				viewModel.redactedRepresentation = redactionResult.redactedText;
				for (const redactionSuggestion of viewModel.redactionSuggestions) {
					redactionSuggestion.accepted = true;
				}
			} else {
				for (const redactionSuggestion of viewModel.redactionSuggestions) {
					// crude check to see if the suggestion has been accepted
					redactionSuggestion.accepted =
						viewModel.redactedRepresentation.charAt(redactionSuggestion.offset) ===
						REDACT_CHARACTER;
				}
			}
			viewModel.originalRepresentation = highlightRedactionSuggestions(
				viewModel.originalRepresentation,
				viewModel.redactionSuggestions
			);
		} // else fallback to legacy view
	}

	return res.render(view, viewModel);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postRedactRepresentationController = async (req, res) => {
	const { body, session } = req;
	const { caseId, representationId } = res.locals;

	body.actionBy = authSession.getAccount(session)?.name;

	await patchRepresentationRedact(caseId, representationId, body);

	res.redirect(getPreviousPageUrl(caseId, representationId));
};
