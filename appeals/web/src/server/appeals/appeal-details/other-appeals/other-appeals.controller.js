import { addOtherAppealsPage, confirmOtherAppealsPage } from './other-appeals.mapper.js';
import {
	getLinkableAppealSummaryFromReference,
	postAssociateAppeal,
	postAssociateLegacyAppeal
} from './other-appeals.service.js';
import { objectContainsAllKeys } from '#lib/object-utilities.js';
import logger from '#lib/logger.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';
import { HTTPError } from 'got';

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getAddOtherAppeals = async (request, response) => {
	return renderAddOtherAppeals(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postAddOtherAppeals = async (request, response) => {
	const addOtherAppealsReference = request.body.addOtherAppealsReference.trim();

	const { errors } = request;

	if (errors) {
		return renderAddOtherAppeals(request, response, addOtherAppealsReference, errors);
	}

	if (addOtherAppealsReference === undefined) {
		return response.render('app/500.njk');
	}

	try {
		await getLinkableAppealSummaryFromReference(request.apiClient, addOtherAppealsReference);
	} catch (error) {
		if (error instanceof HTTPError && error.response.statusCode === 404) {
			request.errors = {
				addOtherAppealsReference: {
					value: addOtherAppealsReference,
					msg: 'Appeal reference could not be found',
					param: 'addOtherAppealsReference',
					location: 'body'
				}
			};

			return renderAddOtherAppeals(request, response, addOtherAppealsReference);
		}
	}

	request.session.appealId = request.currentAppeal.appealId;
	request.session.relatedAppealReference = addOtherAppealsReference;

	return response.redirect(
		`/appeals-service/appeal-details/${request.currentAppeal.appealId}/other-appeals/confirm`
	);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string | undefined} appealReferenceInputValue
 * @param {object | undefined} errors
 */
const renderAddOtherAppeals = async (
	request,
	response,
	appealReferenceInputValue = '',
	errors = undefined
) => {
	if (request.session.appealId && request.session.appealId !== request.currentAppeal.appealId) {
		delete request.session.appealId;
		delete request.session.relatedAppealReference;
	}
	const mappedPageContent = await addOtherAppealsPage(
		request.currentAppeal,
		appealReferenceInputValue
	);

	return response.render('patterns/display-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors: request.errors || errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getConfirmOtherAppeals = async (request, response) => {
	return renderConfirmOtherAppeals(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postConfirmOtherAppeals = async (request, response) => {
	const { errors } = request;

	if (errors) {
		return renderConfirmOtherAppeals(request, response, errors);
	}

	const { relateAppealsAnswer } = request.body;

	if (
		!objectContainsAllKeys(request.session, ['appealId', 'relatedAppealReference']) ||
		request.session.appealId !== request.currentAppeal.appealId ||
		!relateAppealsAnswer
	) {
		delete request.session.appealId;
		delete request.session.relatedAppealReference;

		return response.render('app/500.njk');
	}

	if (relateAppealsAnswer === 'no') {
		delete request.session.appealId;
		delete request.session.relatedAppealReference;
		return response.redirect(`/appeals-service/appeal-details/${request.currentAppeal.appealId}`);
	} else if (relateAppealsAnswer === 'yes') {
		try {
			const relatedAppealDetails = await getLinkableAppealSummaryFromReference(
				request.apiClient,
				request.session.relatedAppealReference
			);

			if (!relatedAppealDetails.appealId) {
				delete request.session.appealId;
				delete request.session.relatedAppealReference;

				return response.render('app/500.njk');
			}

			const { source } = relatedAppealDetails;

			if (source && source === 'back-office') {
				await postAssociateAppeal(
					request.apiClient,
					request.currentAppeal.appealId,
					relatedAppealDetails.appealId
				);
			} else if (source && source === 'horizon') {
				await postAssociateLegacyAppeal(
					request.apiClient,
					request.currentAppeal.appealId,
					request.session.relatedAppealReference
				);
			}

			addNotificationBannerToSession(
				request.session,
				'otherAppeal',
				request.session.appealId,
				`<p class="govuk-notification-banner__heading">This appeal is now related to ${request.session.relatedAppealReference}</p>`
			);
		} catch (error) {
			let errorMessage = 'Something went wrong when posting related appeal';
			if (error instanceof Error) {
				errorMessage += `: ${error.message}`;
			}

			logger.error(error, errorMessage);
		}
	}

	delete request.session.appealId;
	delete request.session.relatedAppealReference;

	return response.redirect(`/appeals-service/appeal-details/${request.currentAppeal.appealId}`);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {object | undefined} errors
 */
const renderConfirmOtherAppeals = async (request, response, errors = undefined) => {
	if (
		!objectContainsAllKeys(request.session, ['appealId', 'relatedAppealReference']) ||
		request.session.appealId !== request.currentAppeal.appealId
	) {
		return response.render('app/500.njk');
	}

	const { relatedAppealReference } = request.session;

	try {
		const relatedAppealDetails = await getLinkableAppealSummaryFromReference(
			request.apiClient,
			relatedAppealReference
		);

		const mappedPageContent = confirmOtherAppealsPage(request.currentAppeal, relatedAppealDetails);

		return response.render('patterns/display-page.pattern.njk', {
			pageContent: mappedPageContent,
			errors: request.errors || errors
		});
	} catch (error) {
		if (error instanceof HTTPError && error.response.statusCode === 404) {
			return response.render('app/500.njk');
		} else {
			let errorMessage = 'Something went wrong when getting appeal details from reference';
			if (error instanceof Error) {
				errorMessage += `: ${error.message}`;
			}

			logger.error(error, errorMessage);
		}
	}
};
