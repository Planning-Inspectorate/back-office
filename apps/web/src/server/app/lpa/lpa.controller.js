import { to } from 'planning-inspectorate-libs';
import { findAllIncomingIncompleteQuestionnaires, findQuestionnaireById, confirmReview } from './lpa.service.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';
import { questionnaireReviewOutcomeLabelsMap, missingOrIncorrectDocumentsLabelsMap } from './lpa.config.js';
import { upperFirst, flatten } from 'lodash-es';
import * as lpaSession from './lpa-session.service.js';

/**
 * GET the main dashboard.
 * It will fetch the questionnaires list (incoming, incomplete) and will render all.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function viewDashboard(request, response, next) {
	const [error, questionnairesList] = await to(findAllIncomingIncompleteQuestionnaires());

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	response.render(routes.home.view, {
		questionnairesList,
		reviewQuestionnairePath: routes.reviewQuestionnaire.path
	});
}

/**
 * GET the questionnaire review page
 * It will fetch the questionnaire details for the specified ID and will render the review form.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function viewReviewQuestionnaire(request, response, next) {
	const appealId = request.params.appealId;
	const fields = lpaSession.getReviewFields(request.session, appealId);
	const [error, questionnaireData] = await to(findQuestionnaireById(appealId));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	lpaSession.setQuestionnaireData(request.session, appealId, questionnaireData);

	response.render(routes.reviewQuestionnaire.view, {
		backURL: `/${routes.home.path}?direction=back`,
		questionnaireData,
		fields
	});
}

/**
 * POST the questionnaire review page
 * If there are errors, it will reload the questionnaire review page and display the errors
 * If there are no errors, it will render the check and confirm page
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @returns {void}
 */
export function decideQuestionnaireReviewOutcome(request, response) {
	const appealId = request.params.appealId;
	const questionnaireData = lpaSession.getQuestionnaireData(request.session, appealId);

	const reviewFields = {
		'applicationPlanningOfficersReportMissingOrIncorrect': request.body['applicationPlanningOfficersReportMissingOrIncorrect'],
		'applicationPlansToReachDecisionMissingOrIncorrect': request.body['applicationPlansToReachDecisionMissingOrIncorrect'],
		'applicationPlansToReachDecisionMissingOrIncorrectDescription': request.body['applicationPlansToReachDecisionMissingOrIncorrectDescription'],
		'policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect': request.body['policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect'],
		'policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription': request.body['policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription'],
		'policiesOtherRelevantPoliciesMissingOrIncorrect': request.body['policiesOtherRelevantPoliciesMissingOrIncorrect'],
		'policiesOtherRelevantPoliciesMissingOrIncorrectDescription': request.body['policiesOtherRelevantPoliciesMissingOrIncorrectDescription'],
		'policiesSupplementaryPlanningDocumentsMissingOrIncorrect': request.body['policiesSupplementaryPlanningDocumentsMissingOrIncorrect'],
		'policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription': request.body['policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription'],
		'siteConservationAreaMapAndGuidanceMissingOrIncorrect': request.body['siteConservationAreaMapAndGuidanceMissingOrIncorrect'],
		'siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription': request.body['siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription'],
		'siteListedBuildingDescriptionMissingOrIncorrect': request.body['siteListedBuildingDescriptionMissingOrIncorrect'],
		'siteListedBuildingDescriptionMissingOrIncorrectDescription': request.body['siteListedBuildingDescriptionMissingOrIncorrectDescription'],
		'thirdPartyApplicationNotificationMissingOrIncorrect': request.body['thirdPartyApplicationNotificationMissingOrIncorrect'],
		'thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses': flatten([request.body['thirdPartyApplicationNotificationMissingOrIncorrectDescription']]).includes('thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses') ? 'true' : '',
		'thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice': flatten([request.body['thirdPartyApplicationNotificationMissingOrIncorrectDescription']]).includes('thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice') ? 'true' : '',
		'thirdPartyApplicationPublicityMissingOrIncorrect': request.body['thirdPartyApplicationPublicityMissingOrIncorrect'],
		'thirdPartyRepresentationsMissingOrIncorrect': request.body['thirdPartyRepresentationsMissingOrIncorrect'],
		'thirdPartyRepresentationsMissingOrIncorrectDescription': request.body['thirdPartyRepresentationsMissingOrIncorrectDescription'],
		'thirdPartyAppealNotificationMissingOrIncorrect': request.body['thirdPartyAppealNotificationMissingOrIncorrect'],
		'thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses': flatten([request.body['thirdPartyAppealNotificationMissingOrIncorrectDescription']]).includes('thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses') ? 'true' : '',
		'thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice': flatten([request.body['thirdPartyAppealNotificationMissingOrIncorrectDescription']]).includes('thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice') ? 'true' : '',
	};

	lpaSession.setReviewFields(request.session, appealId, reviewFields);

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.reviewQuestionnaire.view, {
			backURL: `${routes.home.path}?direction=back`,
			errors,
			errorSummary,
			questionnaireData,
			fields: lpaSession.getReviewFields(request.session, appealId)
		});
	}

	lpaSession.setReviewOutcome(request.session, appealId, 'complete');

	for (const key in reviewFields) {
		if (!key.endsWith('Description') && reviewFields.hasOwnProperty(key) && reviewFields[key] === 'true') {
			lpaSession.setReviewOutcome(request.session, appealId, 'incomplete');
			break;
		}
	}

	request.session.save(); // maybe this should have its own service function?

	return response.redirect(`/lpa/${routes.checkAndConfirm.path}/${appealId}`);
}

/**
 * GET the LPA check and confirm page.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function viewCheckAndConfirm(request, response) {
	const appealId = request.params.appealId;
	const backURL = `/lpa/${routes.reviewQuestionnaire.path}/${appealId}?direction=back`;
	const questionnaireData = lpaSession.getQuestionnaireData(request.session, appealId);
	const reviewOutcome = lpaSession.getReviewOutcome(request.session, appealId);
	const fields = lpaSession.getReviewFields(request.session, appealId);

	response.render(routes.checkAndConfirm.view, {
		backURL,
		appealId,
		questionnaireData,
		reviewOutcome,
		reviewOutcomeText: upperFirst(reviewOutcome),
		fields,
		missingOrIncorrectDocumentsLabelsMap
	});
}

/**
 * POST the LPA check and confirm page
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
 export async function confirmDecision(request, response, next) {
	const appealId = request.params.appealId;
	const backURL = `/lpa/${routes.reviewQuestionnaire.path}/${appealId}?direction=back`;
	const questionnaireData = lpaSession.getQuestionnaireData(request.session, appealId);
	const reviewOutcome = lpaSession.getReviewOutcome(request.session, appealId);
	const fields = lpaSession.getReviewFields(request.session, appealId);

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.checkAndConfirm.view, {
			errors,
			errorSummary,
			backURL,
			appealId,
			questionnaireData,
			reviewOutcome,
			reviewOutcomeText: upperFirst(reviewOutcome),
			fields,
			missingOrIncorrectDocumentsLabelsMap
		});
	}

	const [error, updateStatus] = await to(confirmReview(appealId, fields));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));

		return error;
	}

	response.redirect(`/lpa/${routes.reviewQuestionnaireComplete.path}/${appealId}`);
}

/**
 * GET the review questionnaire complete page that shows the status and a link to go back to the dashboard.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function viewReviewComplete(request, response) {
	const appealId = request.params.appealId;
	const questionnaireData = lpaSession.getQuestionnaireData(request.session, appealId);
	const reviewOutcome = lpaSession.getReviewOutcome(request.session, appealId);

	lpaSession.destroy(request.session); // don't think this is needed anymore

	response.render(routes.reviewQuestionnaireComplete.view, {
		questionnaireData,
		reviewOutcome,
		reviewOutcomeLabel: questionnaireReviewOutcomeLabelsMap[reviewOutcome]
	});
}
