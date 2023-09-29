import logger from '#lib/logger.js';
import { mapInvalidOrIncompleteReasonOptionsToCheckboxItemParameters } from '../appellant-case.mapper.js';
import * as appealDetailsService from '../../appeal-details.service.js';
import * as appellantCaseService from '../appellant-case.service.js';
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

	if (!appealDetails) {
		return response.render('app/404.njk');
	}

	const appellantCaseResponse = await appellantCaseService
		.getAppellantCaseFromAppealId(
			request.apiClient,
			appealDetails?.appealId,
			appealDetails?.appellantCaseId
		)
		.catch((error) => logger.error(error));

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
	const incompleteReasonOptions =
		await appellantCaseService.getAppellantCaseNotValidReasonOptionsForOutcome(
			request.apiClient,
			'incomplete'
		);

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

	return response.render('appeals/appeal/update-due-date.njk', {
		appeal: {
			id: appealId,
			shortReference: appealShortReference(appealReference)
		},
		page: {
			title: 'Appellant case due date',
			text: 'Update appeal due date'
		},
		backButtonUrl: `/appeals-service/appeal-details/${appealId}/appellant-case/incomplete`,
		skipButtonUrl: `/appeals-service/appeal-details/${appealId}/appellant-case/check-your-answers`,
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

	response.render('app/confirmation.njk', {
		panel: {
			title: 'Appeal incomplete',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			}
		},
		body: {
			preTitle: 'The appeal has been reviewed.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: 'We’ve sent an email to the appellant and LPA to inform the case is incomplete, and let them know what to do next.'
				},
				{
					text: 'We also sent them a reminder about the appeal’s due date.'
				},
				{
					text: 'Go to case details',
					href: `/appeals-service/appeal-details/${appealId}`
				}
			]
		}
	});
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
