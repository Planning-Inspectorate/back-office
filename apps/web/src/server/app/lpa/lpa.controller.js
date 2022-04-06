import { to } from 'planning-inspectorate-libs';
import { findAllIncomingIncompleteQuestionnaires, findQuestionnaireById, confirmReview } from './lpa.service.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';
import { questionnaireReviewOutcomeLabelsMap, missingOrIncorrectDocumentsLabelsMap } from './lpa.config.js';
import { camelCase, upperFirst } from 'lodash-es';
import { checkboxDataToCheckValuesObject } from '../../lib/helpers.js';

/**
 * GET the main dashboard.
 * It will fetch the questionnaires list (incoming, incomplete) and will render all.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getLpaDashboard(request, response, next) {
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
export async function getReviewQuestionnaire(request, response, next) {
	const appealId = request.params.appealId;
	const [error, questionnaireData] = await to(findQuestionnaireById(appealId));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	request.session.questionnaireData = questionnaireData;

	response.render(routes.reviewQuestionnaire.view, {
		backURL: `/${routes.home.path}?direction=back`,
		questionnaireData,
		fields: request.session.reviewWork?.fields
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
export function postReviewQuestionnaire(request, response) {
	const appealId = request.params.appealId;
	const questionnaireData = request.session.questionnaireData;

	(request.session.reviewWork ??= {}).fields = {
		planningOfficersReport: {
			completed: request.body['planning-officers-report-missing-or-incorrect'],
		},
		plansUsedToReachDecision: {
			completed: request.body['plans-used-to-reach-decision-missing-or-incorrect'],
			details: { value: request.body['plans-used-to-reach-decision-missing-or-incorrect-reason'] }
		},
		statutoryDevelopmentPlanPolicies: {
			completed: request.body['statutory-development-plan-policies-missing-or-incorrect'],
			details: { value: request.body['statutory-development-plan-policies-missing-or-incorrect-reason'] }
		},
		otherRelevantPolicies: {
			completed: request.body['other-relevant-policies-missing-or-incorrect'],
			details: { value: request.body['other-relevant-policies-missing-or-incorrect-reason'] }
		},
		supplementaryPlanningDocuments: {
			completed: request.body['supplementary-planning-documents-missing-or-incorrect'],
			details: { value: request.body['supplementary-planning-documents-missing-or-incorrect-reason'] }
		},
		conservationAreaGuidance: {
			completed: request.body['conservation-area-guidance-missing-or-incorrect'],
			details: { value: request.body['conservation-area-guidance-missing-or-incorrect-reason'] }
		},
		listedBuildingDescription: {
			completed: request.body['listed-building-description-missing-or-incorrect'],
			details: { value: request.body['listed-building-description-missing-or-incorrect-reason'] }
		},
		applicationNotification: {
			completed: request.body['application-notification-missing-or-incorrect'],
			details: { value: checkboxDataToCheckValuesObject(request.body['application-notification-missing-or-incorrect-reason']) }
		},
		applicationPublicity: {
			completed: request.body['application-publicity-missing-or-incorrect'],
		},
		representations: {
			completed: request.body['representations-missing-or-incorrect'],
			details: { value: request.body['representations-missing-or-incorrect-reason'] }
		},
		appealNotification: {
			completed: request.body['appeal-notification-missing-or-incorrect'],
			details: { value: checkboxDataToCheckValuesObject(request.body['appeal-notification-missing-or-incorrect-reason']) }
		}
	};

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		for (const key in errors) {
			if (errors.hasOwnProperty(key)) {
				request.session.reviewWork.fields[camelCase(key.replace('-missing-or-incorrect-reason', ''))].details.error = { msg: errors[key].msg };
			}
		}

		return response.render(routes.reviewQuestionnaire.view, {
			backURL: `${routes.home.path}?direction=back`,
			errors,
			errorSummary,
			questionnaireData,
			fields: request.session.reviewWork?.fields
		});
	}

	request.session.reviewWork.reviewOutcome = 'complete';
	request.session.reviewWork.missingOrIncorrectDocuments = {};

	for (const key in request.session.reviewWork.fields) {
		if (request.session.reviewWork.fields.hasOwnProperty(key) && request.session.reviewWork.fields[key].completed) {
			request.session.reviewWork.reviewOutcome = 'incomplete';
			request.session.reviewWork.missingOrIncorrectDocuments[key] = request.session.reviewWork.fields[key].details ? request.session.reviewWork.fields[key].details : true;
		}
	}

	request.session.appealId = appealId;

	request.session.save();

	return response.redirect(`/lpa/${routes.checkAndConfirm.path}`);
}

/**
 * GET the LPA check and confirm page.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getCheckAndConfirm(request, response) {
	const backURL = `/lpa/${routes.reviewQuestionnaire.path}/${request.session.appealId}?direction=back`;
	const appealId = request.session.appealId;
	const questionnaireData = request.session.questionnaireData;
	const reviewOutcome = request.session.reviewWork.reviewOutcome;
	const missingOrIncorrectDocuments = request.session.reviewWork.missingOrIncorrectDocuments;

	response.render(routes.checkAndConfirm.view, {
		backURL,
		appealId,
		questionnaireData,
		reviewOutcome,
		reviewOutcomeText: upperFirst(reviewOutcome),
		missingOrIncorrectDocuments,
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
 export async function postCheckAndConfirm(request, response, next) {
	const backURL = `/lpa/${routes.reviewQuestionnaire.path}/${request.session.appealId}?direction=back`;
	const appealId = request.session.appealId;
	const questionnaireData = request.session.questionnaireData;
	const reviewOutcome = request.session.reviewWork.reviewOutcome;
	const missingOrIncorrectDocuments = request.session.reviewWork.missingOrIncorrectDocuments;

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
			missingOrIncorrectDocuments,
			missingOrIncorrectDocumentsLabelsMap
		});
	}

	const [error, updateStatus] = await to(confirmReview(appealId));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));

		return error;
	}

	response.redirect(routes.reviewQuestionnaireComplete.path);
}

/**
 * GET the review questionnaire complete page that shows the status and a link to go back to the dashboard.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getReviewComplete(request, response) {
	const questionnaireData = request.session.questionnaireData;
	const reviewOutcome = request.session.reviewWork.reviewOutcome;

	// Destroy the current session as the questionnaire has been reviewed.
	request.session.destroy();

	response.render(routes.reviewQuestionnaireComplete.view, {
		questionnaireData,
		reviewOutcome,
		reviewOutcomeLabels: questionnaireReviewOutcomeLabelsMap[reviewOutcome]
	});
}
