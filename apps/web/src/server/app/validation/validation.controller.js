import { to } from 'planning-inspectorate-libs';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import { checkboxDataToCheckValuesObject, appealSiteObjectToText } from '../../lib/helpers.js';
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

	for (const appeal of appealsListData) {
		appeal.AppealSiteString = appeal.AppealSite ? appealSiteObjectToText(appeal.AppealSite) : '';
	}

	// eslint-disable-next-line unicorn/no-array-for-each
	appealsListData.forEach((item) => {
		const row = [
			{ html: `<a href="/validation/${routes.reviewAppealRoute.path}/${item.AppealId}">${item.AppealReference}</a>` },
			{ text: item.Received },
			{ text: item.AppealSiteString }
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

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	appealData.AppealSiteHtml = appealData.AppealSite ? appealSiteObjectToText(appealData.AppealSite, '<br /> ') : '';

	const reviewOutcome = request.session.appealWork?.reviewOutcome;

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

	// Clear any session data from other validation journeys to prevent errors
	delete request.session.appealWork.invalidAppealDetails;
	delete request.session.appealWork.incompleteAppealDetails;

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

	// Clear any session data from other validation journeys to prevent errors
	delete request.session.appealWork.descriptionOfDevelopment;
	delete request.session.appealWork.incompleteAppealDetails;

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

	// Clear any session data from other validation journeys to prevent errors
	delete request.session.appealWork.descriptionOfDevelopment;
	delete request.session.appealWork.invalidAppealDetails;

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

	const changeOutcomeURL = `/validation/${routes.reviewAppealRoute.path}/${appealData.AppealId}?direction=back`;

	let invalidReasons;
	if (appealWork.invalidAppealDetails && appealWork.invalidAppealDetails.invalidReasons) {
		invalidReasons = flatten([appealWork.invalidAppealDetails.invalidReasons]);
		// eslint-disable-next-line unicorn/consistent-destructuring
		request.session.appealWork.invalidAppealDetails.invalidReasons = invalidReasons;
	}

	let incompleteReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.incompleteReasons) {
		incompleteReasons = flatten([appealWork.incompleteAppealDetails.incompleteReasons]);
		// eslint-disable-next-line unicorn/consistent-destructuring
		request.session.appealWork.incompleteAppealDetails.incompleteReasons = incompleteReasons;
	}

	// eslint-disable-next-line unicorn/prevent-abbreviations
	let missingOrWrongDocsReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.missingOrWrongDocsReasons) {
		missingOrWrongDocsReasons = flatten([appealWork.incompleteAppealDetails.missingOrWrongDocsReasons]);
		// eslint-disable-next-line unicorn/consistent-destructuring
		request.session.appealWork.incompleteAppealDetails.missingOrWrongDocsReasons = missingOrWrongDocsReasons;
	}

	response.render(routes.checkAndConfirm.view, {
		backURL,
		changeOutcomeURL,
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
 * Utility function to create Reason data in valid format for updateAppeal API post using the supplied details data
 *
 * @param {string} outcomeType - string specifying the applicable outcome ('invalid' or 'incomplete') (valid outcome returns an empty object as Reasons not required for that case)
 * @param {object} appealDetails - details object from session storage containing data on the outcome
 * @returns {object} - resulting Reasons object in valid format (see /api-docs/#/default/post_validation__id_ for details)
 */
function formatOutcomeReasonsDataForApiPost(outcomeType, appealDetails) {
	let data = {};

	switch (outcomeType) {
		case 'invalid':
			data = {
				// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
				...appealDetails.invalidReasons.reduce((accumulator, value) => {
					if (value === 'otherReason') return accumulator;

					accumulator[value] = true;
					return accumulator;
				}, {})
			};

			if (appealDetails.otherReasons) data.otherReasons = appealDetails.otherReasons;

			break;
		case 'incomplete':
			data = {
				// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
				...appealDetails.incompleteReasons.reduce((accumulator, value) => {
					if (value === 'missingOrWrongDocs') return accumulator;
					if (value === 'otherReason') return accumulator;

					accumulator[value] = true;
					return accumulator;
				}, {})
			};

			if (appealDetails.otherReasons) data.otherReasons = appealDetails.otherReasons;

			// eslint-disable-next-line unicorn/no-array-for-each
			appealDetails.missingOrWrongDocsReasons.forEach((reason) => {
				// eslint-disable-next-line unicorn/prefer-string-slice
				data[`missing${reason[0].toUpperCase()}${reason.substring(1)}`] = true;
			});

			break;
		default:
			break;
	}

	return data;
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
	const appealUpdateData = {
		AppealStatus: appealWork.reviewOutcome,
		Reason: formatOutcomeReasonsDataForApiPost(
			appealWork.reviewOutcome, appealWork.reviewOutcome === 'invalid' ? appealWork.invalidAppealDetails : appealWork.incompleteAppealDetails
		)
	};

	if (appealWork.reviewOutcome === 'valid') {
		appealUpdateData.descriptionOfDevelopment = appealWork.descriptionOfDevelopment || '';
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
