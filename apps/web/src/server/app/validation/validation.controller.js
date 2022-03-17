import { to } from 'planning-inspectorate-libs';
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
		const row = [{ html: `<a href="/validation/review-appeal/${item.AppealId}">${item.AppealReference}</a>` }, { text: item.Received }, { text: item.AppealSite }];

		if (item.AppealStatus === 'incomplete') {
			incompleteAppeals.push(row);
		} else if (item.AppealStatus === 'new') {
			newAppeals.push(row);
		}
	});

	response.render('validation/dashboard', {
		appealsList: {
			newAppeals,
			incompleteAppeals
		}
	});
}

/**
 * GET the appeal details page.
 * It will fetch the appeal details and it will render the page with them.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getAppealDetails(request, response, next) {
	const appealId = request.param('appealId');

	const [error, appealData] = await to(findAppealById(appealId));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	response.render('validation/appeal-details', {
		appealData
	});
}

/**
 * TODO: WIP
 * POST the appeal details page
 * It will fetch the appeal details and it will render the page with them.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function postAppealOutcome(request, response, next) {
	const reviewOutcome = request.body['review-outcome'];
	const appealId = request.param('appealId');

	const [error, appealData] = await to(findAppealById(appealId));

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render('validation/appeal-details', {
			errors,
			errorSummary,
			appealData
		});
	}

	if (reviewOutcome === '3') {
		return response.redirect(`/validation/outcome-incomplete/${appealId}`);
	}

	return response.redirect(`/validation`);
}

/**
 * GET the outcome incomplete page.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getOutcomeIncomplete(request, response, next) {
	const appealId = request.param('appealId');

	const [error, appealData] = await to(findAppealById(appealId));

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render('validation/appeal-details', {
			errors,
			errorSummary,
			appealData
		});
	}

	return response.render('validation/outcome-incomplete', {
		appealId
	});
}

/**
 * POST the outcome incomplete page
 * It will render the incomplete outcome check and confirm page
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export function postOutcomeIncomplete(request, response, next) {
	const incompleteReason = request.body['incomplete-reason'];
	const missingOrWrongDocsReason = request.body['missing-or-wrong-docs-reason'];
	const otherReason = request.body['other-reason'];

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render('validation/outcome-incomplete', {
			errors,
			errorSummary,
			incompleteReason,
			missingOrWrongDocsReason,
			otherReason
		});
	}

	// TEST for error state data population
	return response.render('validation/outcome-incomplete', {
		incompleteReason,
		missingOrWrongDocsReason,
		otherReason
	});

	//return response.redirect('/validation/check-confirm');
}

/**
 * GET the check and confirm page.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export function getCheckAndConfirm(request, response, next) {
	return response.render('validation/check-confirm');
}
