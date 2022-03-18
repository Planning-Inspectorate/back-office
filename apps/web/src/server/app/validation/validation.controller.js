import { to } from 'planning-inspectorate-libs';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import { findAllNewIncompleteAppeals, findAppealById } from './validation.service.js';

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
			nextStepPage = `/validation/${routes.incompleteAppealOutcome.path}`;
			break;
		default:
			nextStepPage = `/validation`;
	}

	return response.redirect(nextStepPage);
}


export function getValidAppealOutcome(request, response) {
	response.render('validation/valid-appeal-outcome', {
		backURL: '',
		changeOutcomeURL: `/validation/${routes.reviewAppealRoute.path}/${request.session.data.appealData.AppealId}`
	});
}

export function getInvalidAppealOutcome(request, response) {
	response.render('validation/invalid-appeal-outcome', {
		backURL: '',
		changeOutcomeURL: `/validation/${routes.reviewAppealRoute.path}/${request.session.data.appealData.AppealId}`
	});
}

export function getIncompleteAppealOutcome(request, response) {
	response.render('validation/incomplete-appeal-outcome', {
		backURL: '',
		changeOutcomeURL: `/validation/${routes.reviewAppealRoute.path}/${request.session.data.appealData.AppealId}`
	});
}
