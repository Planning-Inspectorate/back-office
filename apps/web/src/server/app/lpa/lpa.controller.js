import { to } from 'planning-inspectorate-libs';
import { findAllIncomingIncompleteQuestionnaires, findQuestionnaireById } from './lpa.service.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';
import { camelCase, upperFirst } from 'lodash-es';
import { checkboxDataToCheckValuesObject, appealSiteObjectToText } from '../../lib/helpers.js';

/**
 * Create an array of row data for consumption in nunjucks template govukTable component, using the supplied data array from the LPA service
 *
 * @param {Array<object>} questionnairesList - array of questionnaire data items returned from findAllIncomingIncompleteQuestionnaires service method
 * @returns {Array<object>} - array of row data objects for consumption in nunjucks template
 */
function makeQuestionnairesListRowsForTemplate (questionnairesList) {
	const rows = [];

	// eslint-disable-next-line unicorn/no-array-for-each
	questionnairesList.forEach((item) => {
		rows.push([
			{ html: item.QuestionnaireStatus === 'received'
				? `<a href="/lpa/${routes.reviewQuestionnaire.path}/${item.AppealId}">${item.AppealReference}</a>`
				: item.AppealReference
			},
			{ text: item.QuestionnaireDueDate },
			{ text: item.AppealSite ? appealSiteObjectToText(item.AppealSite) : '' },
			{ html: `<strong class="govuk-tag govuk-tag--${item.StatusTagColor}">${item.QuestionnaireStatus}</strong>` }
		]);
	});

	return rows;
}

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

	questionnairesList.incomingQuestionnairesRows = makeQuestionnairesListRowsForTemplate(questionnairesList.incomingQuestionnaires);
	questionnairesList.incompleteQuestionnairesRows = makeQuestionnairesListRowsForTemplate(questionnairesList.incompleteQuestionnaires);

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
	const [error, questionnaireData] = await to(findQuestionnaireById(appealId));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	questionnaireData.AppealSiteHtml = questionnaireData.AppealSite ? appealSiteObjectToText(questionnaireData.AppealSite, '<br /> ') : '';

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
			details: { checkValues: checkboxDataToCheckValuesObject(request.body['application-notification-missing-or-incorrect-reason']) }
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
			details: { checkValues: checkboxDataToCheckValuesObject(request.body['appeal-notification-missing-or-incorrect-reason']) }
		}
	};

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		for (const key in errors) {
			if (errors.hasOwnProperty(key)) {
				// eslint-disable-next-line unicorn/consistent-destructuring
				request.session.reviewWork.fields[camelCase(key.replace('-missing-or-incorrect-reason', ''))].details.error = { msg: errors[key].msg };
			}
		}

		return response.render(routes.reviewQuestionnaire.view, {
			backURL: `${routes.home.path}?direction=back`,
			errors,
			errorSummary,
			questionnaireData,
			// eslint-disable-next-line unicorn/consistent-destructuring
			fields: request.session.reviewWork?.fields
		});
	}

	// eslint-disable-next-line unicorn/consistent-destructuring
	request.session.reviewWork.reviewOutcome = 'complete';

	// eslint-disable-next-line unicorn/consistent-destructuring
	for (const key in request.session.reviewWork.fields) {
		// eslint-disable-next-line unicorn/consistent-destructuring
		if (request.session.reviewWork.fields.hasOwnProperty(key) && request.session.reviewWork.fields[key].completed) {
			// eslint-disable-next-line unicorn/consistent-destructuring
			request.session.reviewWork.reviewOutcome = 'incomplete';
			break;
		}
	}

	// eslint-disable-next-line unicorn/consistent-destructuring
	request.session.appealId = appealId;

	// eslint-disable-next-line unicorn/consistent-destructuring
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

	response.render(routes.checkAndConfirm.view, {
		backURL,
		appealId,
		questionnaireData,
		reviewOutcome,
		reviewOutcomeLabel: upperFirst(reviewOutcome)
	});
}
