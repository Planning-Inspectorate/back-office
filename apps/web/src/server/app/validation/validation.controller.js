import { to } from 'planning-inspectorate-libs';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import { checkboxDataToCheckValuesObject } from '../../lib/helpers.js';
import { findAllNewIncompleteAppeals, findAppealById, updateAppeal } from './validation.service.js';
import { validationLabelsMap, validationAppealOutcomeLabelsMap } from './validation.config.js';
import { flatten } from 'lodash-es';

/**
 * GET the main dashboard.
 * It will fetch the appeals list (new, incomplete) and will render all.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
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
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getReviewAppeal(request, response, next) {
	const appealId = request.params.appealId;

	if (request.session.appealWork && `${request.session.appealData?.AppealId}` !== appealId) {
		request.session.appealWork = {};
	}

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
 * @param {Function} next  - Express function that calls then next middleware in the stack
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
			nextStepPage = `/validation`;
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
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const descriptionOfDevelopment = request.body['valid-appeal-details'];
	const appealData = request.session.appealData;

	// TODO: Should I just pass the appealWork obj?
	(request.session.appealWork ??= {}).descriptionOfDevelopment = descriptionOfDevelopment;

	const { body: { errors = {}, errorSummary = [] } } = request;

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
	const appealData = request.session.appealData;

	const { invalidReasons = [], otherReasons = '' } = request.session.appealWork?.invalidAppealDetails ?
		request.session.appealWork.invalidAppealDetails : {};

	return response.render(routes.invalidAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		invalidReasons: checkboxDataToCheckValuesObject(invalidReasons),
		otherReasons
	});
}

/**
 * POST the invalid appeal outcome page.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function postInvalidAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;

	const { body: { errors = {}, errorSummary = [], invalidReasons = [], otherReasons = '' } } = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.invalidAppealOutcome.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			invalidReasons: checkboxDataToCheckValuesObject(invalidReasons),
			otherReasons
		});
	}

	(request.session.appealWork ??= {}).invalidAppealDetails = {
		invalidReasons,
		otherReasons
	};

	return response.redirect(`/validation/${routes.checkAndConfirm.path}`);
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

	const { incompleteReasons = [], missingOrWrongDocsReasons = [], otherReasons = '' } = request.session.appealWork?.incompleteAppealDetails ?
		request.session.appealWork.incompleteAppealDetails : {};

	return response.render(routes.incompleteAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		incompleteReasons: checkboxDataToCheckValuesObject(incompleteReasons),
		otherReasons,
		missingOrWrongDocsReasons: incompleteReasons.includes('missingOrWrongDocs')
			? checkboxDataToCheckValuesObject(missingOrWrongDocsReasons): undefined
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

	const { body: { errors = {}, errorSummary = [], incompleteReasons = [], otherReasons = '', missingOrWrongDocsReasons = [] } } = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.incompleteAppealOutcome.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			incompleteReasons: checkboxDataToCheckValuesObject(incompleteReasons),
			otherReasons,
			missingOrWrongDocsReasons: incompleteReasons.includes('missingOrWrongDocs')
				? checkboxDataToCheckValuesObject(missingOrWrongDocsReasons): undefined
		});
	}

	(request.session.appealWork ??= {}).incompleteAppealDetails = {
		incompleteReasons,
		otherReasons,
		missingOrWrongDocsReasons,
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
	const { appealData, appealWork } = request.session;

	// Determine the back url depending on where the user originated from in the
	// validation journey
	let backURL;

	if ('invalidAppealDetails' in appealWork) {
		backURL = `/validation/${routes.invalidAppealOutcome.path}?direction=back`;
	} else if ('incompleteAppealDetails' in appealWork) {
		backURL = `/validation/${routes.incompleteAppealOutcome.path}?direction=back`;
	} else {
		backURL = `/validation/${routes.validAppealOutcome.path}?direction=back`;
	}

	let invalidReasons;
	if (appealWork.invalidAppealDetails && appealWork.invalidAppealDetails.invalidReasons) {
		invalidReasons = flatten([appealWork.invalidAppealDetails.invalidReasons]);
		request.session.appealWork.invalidAppealDetails.invalidReasons = invalidReasons;
	}

	let incompleteReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.incompleteReasons) {
		incompleteReasons = flatten([appealWork.incompleteAppealDetails.incompleteReasons]);
		request.session.appealWork.incompleteAppealDetails.incompleteReasons = incompleteReasons;
	}

	let missingOrWrongDocsReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.missingOrWrongDocsReasons) {
		missingOrWrongDocsReasons = flatten([appealWork.incompleteAppealDetails.missingOrWrongDocsReasons]);
		request.session.appealWork.incompleteAppealDetails.missingOrWrongDocsReasons = missingOrWrongDocsReasons;
	}

	response.render(routes.checkAndConfirm.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		appealWork,
		invalidReasons,
		incompleteReasons,
		missingOrWrongDocsReasons,
		validationLabelsMap,
		validationAppealOutcomeLabels: validationAppealOutcomeLabelsMap[appealWork.reviewOutcome]
	});
}

/**
 * POST the check and confirm page used by all appeal outcomes journeys.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function postCheckAndConfirm(request, response, next) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;
	const appealWork = request.session.appealWork;

	const { body: { errors = {}, errorSummary = [] } } = request;

	let incompleteReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.incompleteReasons) {
		incompleteReasons = flatten([appealWork.incompleteAppealDetails.incompleteReasons]);
	}

	let missingOrWrongDocsReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.missingOrWrongDocsReasons) {
		missingOrWrongDocsReasons = flatten([appealWork.incompleteAppealDetails.missingOrWrongDocsReasons]);
	}

	if (Object.keys(errors).length > 0) {
		return response.render(routes.checkAndConfirm.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			appealWork,
			incompleteReasons,
			missingOrWrongDocsReasons,
			validationLabelsMap,
			validationAppealOutcomeLabels: validationAppealOutcomeLabelsMap[appealWork.reviewOutcome]
		});
	}

	// Update the appeal status and transition it to the next phase.
	// Convert the form / appeal session data into a valid payload format.
	let appealUpdateData = {};
	switch (appealWork.reviewOutcome) {
		case 'valid':
			appealUpdateData = { AppealStatus: appealWork.reviewOutcome, DescriptionOfDevelopment: appealWork.descriptionOfDevelopment };
			break;
		case 'invalid':
			appealUpdateData = {
				AppealStatus: appealWork.reviewOutcome,
				Reason: {
					// Convert all reasons for the outcome from an array to an object. Each array item will become a key with a true value.
					// If one of the reasons is based on the Other text box, the key has to be otherReasons and the value is stored separatly in the appealWork data.
					...appealWork.invalidAppealDetails.invalidReasons.reduce((a, v) => ({
						...a,
						[(v === 'otherReason') ? 'otherReasons': v]: (v === 'otherReason') ? appealWork.invalidAppealDetails.otherReasons : true
					}), {})
				}
			};
			break;
		case 'incomplete':
			appealUpdateData = {
				AppealStatus: appealWork.reviewOutcome,
				Reason: {
					// TODO: This code is messy, please refactor.
					// Convert all reasons for the outcome from an array to an object. Each array item will become a key with a true value.
					// If one of the reasons is based on the Other text box, the key has to be otherReasons and the value is stored separatly in the appealWork data.
					...appealWork.incompleteAppealDetails.incompleteReasons.reduce((a, v) => ({
						...a,
						[(v === 'otherReason') ? 'otherReasons': v]: (v === 'otherReason') ? appealWork.incompleteAppealDetails.otherReasons : true
					}), {}),
					...appealWork.incompleteAppealDetails.missingOrWrongDocsReasons.reduce((a, v) => ({ ...a, [v]: true }), {})
				}
			};
			break;
		default:
			break;
	}

	// Update the appeal with the outcome of the validation.
	const [error, updateStatus] = await to(updateAppeal(appealData.AppealId, appealUpdateData));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));

		return error;
	}

	response.redirect(routes.reviewAppealComplete.path);
}

/**
 * GET the review appeal complete page that shows the status and a link to go back to the dashboard.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getReviewAppealComplete(request, response) {
	const appealData = request.session.appealData;
	const appealWork = request.session.appealWork;

	// Destroy the current session as the appeal has been validated.
	request.session.destroy();

	response.render(routes.reviewAppealComplete.view, {
		appealData,
		appealWork,
		validationAppealOutcomeLabels: validationAppealOutcomeLabelsMap[appealWork.reviewOutcome]
	});
}
