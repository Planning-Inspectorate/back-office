import { to } from 'planning-inspectorate-libs';
import { findAllIncomingIncompleteQuestionnaires, findQuestionnaireById } from './lpa.service.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';

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
	let error, questionnairesList;

	// eslint-disable-next-line prefer-const
	[error, questionnairesList] = await to(findAllIncomingIncompleteQuestionnaires());

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	response.render(routes.home.view, {
		questionnairesList
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
	let error, questionnaireData;

	// eslint-disable-next-line prefer-const
	[error, questionnaireData] = await to(findQuestionnaireById(appealId));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	const fields = {
		planningOfficersReport: { completed: false, error: false },
		plansUsedToReachDecision: { completed: false, error: false, detailsValue: '' },
		statutoryDevelopmentPlanPolicies: { completed: false, error: false },
		otherRelevantPolicies: { completed: false, error: false },
		supplementaryPlanningDocuments: { completed: false, error: false },
		conservationAreaGuidance: { completed: false, error: false },
		listedBuildingDescription: { completed: false, error: false },
		applicationNotification: { completed: false, error: false },
		applicationPublicity: { completed: false, error: false },
		representations: { completed: false, error: false },
		appealNotification: { completed: false, error: false }
	};

	response.render(routes.reviewQuestionnaire.view, {
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
export function postReviewQuestionnaire(request, response) {
	const appealId = request.params.appealId;
	const questionnaireData = request.session.questionnaireData;

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.reviewAppealRoute.view, {
			backURL: `/lpa/review-questionnaire/${appealId}?direction=back`,
			errors,
			errorSummary,
			questionnaireData
		});
	}

	return response.redirect('lpa/check-and-confirm');
}
