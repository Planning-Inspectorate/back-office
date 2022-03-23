import { to } from 'planning-inspectorate-libs';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import { checkboxDataToCheckValuesObject, arrayifyIfString } from '../../lib/helpers.js';
import { findAllNewIncompleteAppeals, findAppealById } from './validation.service.js';
import { validationLabelsMap, validationAppealOutcomeLabelsMap } from './validation.config.js';

/**
 * GET the main dashboard.
 * It will fetch the appeals list (new, incomplete) and will render all.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getValidationDashboard(request, response) {
	const appealsListData = [];
	const newAppeals = [];
	const incompleteAppeals = [];

	// eslint-disable-next-line prefer-const
	// [error, appealsListData] = await to(findAllNewIncompleteAppeals());

	// if (error) {
	// 	next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
	// 	return;
	// }

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
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getReviewAppeal(request, response, next) {
	const appealId = request.params.appealId;

	const [error, appealData] = await to(findAppealById(appealId));
	const reviewOutcome = request.session.appealWork?.reviewOutcome;

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	// Save the current appeal data into session storage
	request.session.appealData = appealData;

	response.render(routes.reviewAppealRoute.view, {
		backURL: `/${routes.home.path}?direction=back`,
		appealData,
		reviewOutcome
	});
}

/**
 * POST the appeal details page
 * It will fetch the appeal details and it will render the page with them.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function postAppealOutcome(request, response) {
	const reviewOutcome = request.body['review-outcome'];
	const appealData = request.session.appealData;

	(request.session.appealWork ??= {}).reviewOutcome = reviewOutcome;

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.reviewAppealRoute.view, {
			backURL: `/${routes.home.path}?direction=back`,
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
			nextStepPage = '/validation';
	}

	return response.redirect(nextStepPage);
}

/**
 * GET the valid appeal outcome next page journey.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getValidAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;
	const { descriptionOfDevelopment } = request.session.appealWork;

	response.render(routes.validAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		descriptionOfDevelopment
	});
}

/**
 * POST the valid appeal details page
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function postValidAppealDetails(request, response) {
	const descriptionOfDevelopment = request.body['valid-appeal-details'];
	const appealData = request.session.appealData;
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;

	// TODO: Should I just pass the appealWork obj?
	(request.session.appealWork ??= {}).descriptionOfDevelopment = descriptionOfDevelopment;

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.validAppealOutcome.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			descriptionOfDevelopment
		});
	}

	return response.redirect(`/validation/${routes.checkAndConfirm.path}`);
}

/**
 * GET the invalid appeal outcome next page journey.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getInvalidAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;

	const { body: { errors = {}, errorSummary = [] } } = request;

	let invalidReasons = [];
	let otherReason = '';
	const body = request.body;

	if (body.invalidReasons){
		invalidReasons = body.invalidReasons;
		otherReason = body.otherReason;
	}

	const isGetRequest = Object.keys(body).length===0;

	const checkbox = [
		{ text: 'Out of time', value: 'outOfTime' },
		{ text: 'Not appealable', value: 'notApplicable' },
		{ text: 'No right of appeal', value: 'noRightOfAppeal' },
		{ text: 'LPA deemed application as invalid', value: 'LPAinvalid' },
		{ text: 'Other', value: 'other' }
	];

	const items = [
		{ 	value: checkbox[0].value,
			text: checkbox[0].text,
			checked: invalidReasons.includes(checkbox[0].value)
		}, {
			value: checkbox[1].value,
			text: checkbox[1].text,
			checked: invalidReasons.includes(checkbox[1].value)
		}, { value: checkbox[2].value, text: checkbox[2].text,
			checked: invalidReasons.includes(checkbox[2].value)
		},
		{
			value: checkbox[3].value, text: checkbox[3].text,
			checked: invalidReasons.includes(checkbox[3].value)
		},
		{
			value: checkbox[4].value,
			text: checkbox[4].text,
			checked: invalidReasons.includes(checkbox[4].value),
			conditional: {
				html: `	<div class="govuk-form-group">
							<label class="govuk-label" for="event-name">
								<b>List reason</b><br>
								This will be sent to the appellant and LPA
							</label>
							<input class="govuk-input" id="otherReason"
								name="otherReason" type="text" value="` + otherReason + `"
							>
						</div>`
			}
		}
	];


	if ( isGetRequest || Object.keys(errors).length > 0) {

		if ( !invalidReasons.includes(checkbox[4].value)) {
			otherReason = '';
		}

		if (Object.keys(errors).length>0 ) {
			return response.render(routes.invalidAppealOutcome.view, {
				errors,
				errorSummary,
				invalidReasons: invalidReasons,
				otherReason: otherReason,
				items: items,
				backURL,
				changeOutcomeURL: backURL
			});
		}

		return response.render(routes.invalidAppealOutcome.view, {
			invalidReasons: invalidReasons,
			otherReason: otherReason,
			items: items,
			backURL,
			changeOutcomeURL: backURL
		});
	}

	return response.render(routes.invalidAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL
	});

}

/**
 * GET the incomplete appeal outcome next page journey.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getIncompleteAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;

	const { incompleteReasons = [], missingOrWrongDocumentsReasons = [], otherReason = '' } = request.session.appealWork?.incompleteAppealDetails ?
		request.session.appealWork.incompleteAppealDetails : {};

	return response.render(routes.incompleteAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		incompleteReasons: checkboxDataToCheckValuesObject(incompleteReasons),
		otherReason,
		missingOrWrongDocumentsReasons: incompleteReasons.includes('missingOrWrongDocuments')
			? checkboxDataToCheckValuesObject(missingOrWrongDocumentsReasons): undefined
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
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;

	const {
		body: { errors = {}, errorSummary = [], incompleteReasons = [], otherReason = '', missingOrWrongDocumentsReasons = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.incompleteAppealOutcome.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			incompleteReasons: checkboxDataToCheckValuesObject(incompleteReasons),
			otherReason,
			missingOrWrongDocumentsReasons: incompleteReasons.includes('missingOrWrongDocuments')
				? checkboxDataToCheckValuesObject(missingOrWrongDocumentsReasons): undefined
		});
	}

	(request.session.appealWork ??= {}).incompleteAppealDetails = {
		incompleteReasons,
		otherReason,
		missingOrWrongDocumentsReasons,
	};

	return response.redirect(routes.checkAndConfirm.path);
}

/**
 * GET the check and confirm page used by all appeal outcomes journeys.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getCheckAndConfirm(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;
	const appealWork = request.session.appealWork;

	let incompleteReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.incompleteReasons) {
		incompleteReasons = arrayifyIfString(appealWork.incompleteAppealDetails.incompleteReasons);
	}

	let missingOrWrongDocumentsReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.missingOrWrongDocumentsReasons) {
		missingOrWrongDocumentsReasons = arrayifyIfString(appealWork.incompleteAppealDetails.missingOrWrongDocumentsReasons);
	}

	response.render(routes.checkAndConfirm.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		appealWork,
		incompleteReasons,
		missingOrWrongDocumentsReasons,
		validationLabelsMap,
		validationAppealOutcomeLabels: validationAppealOutcomeLabelsMap[appealWork.reviewOutcome]
	});
}

/**
 * POST the check and confirm page used by all appeal outcomes journeys.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function postCheckAndConfirm(request, response) {
	// TODO: Build the summary page
	response.redirect('/validation');
}
