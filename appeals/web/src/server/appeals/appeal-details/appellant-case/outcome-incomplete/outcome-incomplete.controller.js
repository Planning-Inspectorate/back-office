import logger from '#lib/logger.js';
import {
	mapInvalidOrIncompleteReasonOptionsToCheckboxItemParameters,
	updateDueDatePage
} from '../appellant-case.mapper.js';
import * as appealDetailsService from '../../appeal-details.service.js';
import * as appellantCaseService from '../appellant-case.service.js';
import { decisionIncompleteConfirmationPage } from './outcome-incomplete.mapper.js';
import { objectContainsAllKeys } from '#lib/object-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { getNotValidReasonsTextFromRequestBody } from '#lib/mappers/validation-outcome-reasons.mapper.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderIncompleteReason = async (request, response) => {
	const { errors, body } = request;

	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (
		!appealDetails ||
		appealDetails.appellantCaseId === null ||
		appealDetails.appellantCaseId === undefined
	) {
		return response.render('app/404.njk');
	}

	const [appellantCaseResponse, incompleteReasonOptions] = await Promise.all([
		appellantCaseService
			.getAppellantCaseFromAppealId(
				request.apiClient,
				appealDetails.appealId,
				appealDetails.appellantCaseId
			)
			.catch((error) => logger.error(error)),
		appellantCaseService.getAppellantCaseNotValidReasonOptionsForOutcome(
			request.apiClient,
			'incomplete'
		)
	]);

	if (!appellantCaseResponse) {
		return response.render('app/404.njk');
	}

	if (
		request.session.webAppellantCaseReviewOutcome &&
		(request.session.webAppellantCaseReviewOutcome.appealId !== appealId ||
			request.session.webAppellantCaseReviewOutcome.validationOutcome !== 'incomplete')
	) {
		delete request.session.webAppellantCaseReviewOutcome;
	}

	const { webAppellantCaseReviewOutcome } = request.session;

	if (incompleteReasonOptions) {
		const mappedIncompleteReasonOptions =
			mapInvalidOrIncompleteReasonOptionsToCheckboxItemParameters(
				'incomplete',
				incompleteReasonOptions,
				body,
				webAppellantCaseReviewOutcome,
				appellantCaseResponse.validation
			);

		return response.render('appeals/appeal/appellant-case-invalid-incomplete.njk', {
			appeal: {
				id: appealId,
				shortReference: appealShortReference(appealReference)
			},
			notValidStatus: 'incomplete',
			reasonOptions: mappedIncompleteReasonOptions,
			errors
		});
	}

	return response.render('app/500.njk');
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderUpdateDueDate = async (request, response) => {
	const { errors } = request;

	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;

	const mappedPageContent = updateDueDatePage(appealId, appealReference);

	return response.render('appeals/appeal/update-due-date.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderDecisionIncompleteConfirmationPage = async (request, response) => {
	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;
	const mappedPageContent = decisionIncompleteConfirmationPage(appealId, appealReference);

	response.render('appeals/confirmation.njk', mappedPageContent);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getIncompleteReason = async (request, response) => {
	renderIncompleteReason(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postIncompleteReason = async (request, response) => {
	const { errors } = request;

	if (errors) {
		return renderIncompleteReason(request, response);
	}

	try {
		if (!objectContainsAllKeys(request.session, 'appealId')) {
			return response.render('app/500.njk');
		}

		const { appealId } = request.session;

		/** @type {import('../appellant-case.types.js').AppellantCaseSessionValidationOutcome} */
		request.session.webAppellantCaseReviewOutcome = {
			appealId,
			validationOutcome: 'incomplete',
			reasons: request.body.incompleteReason,
			reasonsText: getNotValidReasonsTextFromRequestBody(request.body, 'incompleteReason')
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/appellant-case/incomplete/date`
		);
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing appellant case review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getUpdateDueDate = async (request, response) => {
	renderUpdateDueDate(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postUpdateDueDate = async (request, response) => {
	if (request.errors) {
		return renderUpdateDueDate(request, response);
	}

	if (!objectContainsAllKeys(request.session, 'webAppellantCaseReviewOutcome')) {
		return response.render('app/500.njk');
	}

	const { body } = request;

	if (!objectContainsAllKeys(body, ['due-date-day', 'due-date-month', 'due-date-year'])) {
		return response.render('app/500.njk');
	}

	try {
		const updatedDueDateDay = parseInt(body['due-date-day'], 10);
		const updatedDueDateMonth = parseInt(body['due-date-month'], 10);
		const updatedDueDateYear = parseInt(body['due-date-year'], 10);

		if (
			Number.isNaN(updatedDueDateDay) ||
			Number.isNaN(updatedDueDateMonth) ||
			Number.isNaN(updatedDueDateYear)
		) {
			return response.render('app/500.njk');
		}

		request.session.webAppellantCaseReviewOutcome.updatedDueDate = {
			day: updatedDueDateDay,
			month: updatedDueDateMonth,
			year: updatedDueDateYear
		};

		return response.redirect(
			`/appeals-service/appeal-details/${request.session.appealId}/appellant-case/check-your-answers`
		);
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing appellant case review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getConfirmation = async (request, response) => {
	renderDecisionIncompleteConfirmationPage(request, response);
};
