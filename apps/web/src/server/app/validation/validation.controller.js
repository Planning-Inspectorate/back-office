import { to } from 'planning-inspectorate-libs';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import { findAllNewIncompleteAppeals, findAppealById } from './validation.service.js';
import { checkboxDataToCheckValuesObject } from '../../lib/helpers.js';

/**
 * GET the main dashboard.
 * It will fetch the appeals list (new, incomplete) and will render all.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getValidationDashboard(request, response, next) {
	let error, appealsListData;
	const newAppeals = [];
	const incompleteAppeals = [];

	// eslint-disable-next-line prefer-const
	[error, appealsListData] = await to(findAllNewIncompleteAppeals());

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	// eslint-disable-next-line unicorn/no-array-for-each
	appealsListData.forEach((item) => {
		const row = [
			{ html: `<a href="/validation/${routes.reviewAppealRoute.path}/${item.AppealId}">${item.AppealReference}</a>` },
			{ text: item.Received },
			{ text: item.AppealSite }
		];

		if (item.AppealStatus === 'incomplete') {
			incompleteAppeals.push(row);
		} else if (item.AppealStatus === 'new') {
			newAppeals.push(row);
		}
	});

	response.render(routes.home.view, {
		appealsList: {
			newAppeals,
			incompleteAppeals
		}
	});
}

/**
 * GET the review appeal page.
 * It will fetch the appeal details and it will render the page with that info.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getReviewAppeal(request, response, next) {
	const appealId = request.param('appealId');

	const [error, appealData] = await to(findAppealById(appealId));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	// Save the current appeal data into session storage
	request.session.data = { appealData };

	response.render(routes.reviewAppealRoute.view, {
		backURL: `/${routes.home.path}`,
		appealData
	});
}

/**
 * POST the appeal details page
 * It will fetch the appeal details and it will render the page with them.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export function postAppealOutcome(request, response) {
	const reviewOutcome = request.body['review-outcome'];
	const appealData = request.session.data.appealData;

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.reviewAppealRoute.view, {
			backURL: `/${routes.home.path}`,
			errors,
			errorSummary,
			appealData
		});
	}

	let nextStepPage = '/validation';

	switch (reviewOutcome) {
		case 'valid':
			nextStepPage = `/validation/${routes.validAppealOutcome.path}`;
			break;
		case 'invalid':
			nextStepPage = `/validation/${routes.invalidAppealOutcome.path}`;
			break;
		case 'incomplete':
			nextStepPage = `/validation/${routes.incompleteAppealOutcome.path}/${appealData.AppealId || ''}`;
			break;
		default:
			nextStepPage = `/validation`;
	}

	return response.redirect(nextStepPage);
}


/**
 * GET the valid appeal outcome next page journey.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @returns {void}
 */
export function getValidAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.data.appealData.AppealId}`;

	response.render(routes.validAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL
	});
}

/**
 * POST the valid appeal details page
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @returns {void}
 */
export function postValidAppealDetails(request, response) {
	const descriptionOfDevelopment = request.body['valid-appeal-details'];
	const appealData = request.session.data.appealData;
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.data.appealData.AppealId}`;

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.validAppealOutcome.view, {
			backURL,
			errors,
			errorSummary,
			appealData
		});
	}

	return response.redirect(`/validation/${routes.checkAndConfirm.path}`);
}

/**
 * GET the invalid appeal outcome next page journey.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export function getInvalidAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.data.appealData.AppealId}`;

	response.render(routes.invalidAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL
	});
}

/**
 * GET the incomplete appeal outcome next page journey.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export function getIncompleteAppealOutcome(request, response) {
	const appealId = request.param('appealId');
	const appealData = request.session.data.appealData;

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render('validation/appeal-details', {
			errors,
			errorSummary,
			appealId,
			appealData
		});
	}

	return response.render('validation/incomplete-appeal-outcome', {
		appealId
	});
}

/**
 * POST the incomplete appeal outcome page
 * If there are errors, it will reload the incomplete appeal outcome page and display the errors
 * If there are no errors, it will render the check and confirm page
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @returns {void}
 */
export function postIncompleteAppealOutcome(request, response) {
	const {
		body: {
			errors = {},
			errorSummary = [],
			incompleteReason = [],
			otherReason = ''
		},
	} = request;

	let {
		body: {
			missingOrWrongDocumentsReason = []
		},
	} = request;

	if (!incompleteReason.includes('missingOrWrongDocuments')) {
		missingOrWrongDocumentsReason = undefined;
	}

	const data = {
		incompleteReason: checkboxDataToCheckValuesObject(incompleteReason),
		otherReason
	};

	if (missingOrWrongDocumentsReason) {
		data.missingOrWrongDocumentsReason = checkboxDataToCheckValuesObject(missingOrWrongDocumentsReason);
	}

	if (Object.keys(errors).length > 0) {
		data.errors = errors;
		data.errorSummary = errorSummary;

		return response.render('validation/incomplete-appeal-outcome', data);
	}

	const outcomeData = { incompleteReason };

	if (missingOrWrongDocumentsReason) outcomeData.missingOrWrongDocumentsReason = missingOrWrongDocumentsReason;
	if (otherReason) outcomeData.otherReason = otherReason;

	// eslint-disable-next-line unicorn/consistent-destructuring
	request.session.data = { outcomeData };

	return response.redirect('/validation/check-and-confirm');
}

/**
 * GET the check and confirm page.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @returns {void}
 */
export function getCheckAndConfirm(request, response) {
	const backURL = `/todo`;

	response.render(routes.checkAndConfirm.view, {
		backURL,
		changeOutcomeURL: backURL
	});
}
