import logger from '#lib/logger.js';
import * as appealDetailsService from '../../appeal-details.service.js';
import * as appellantCaseService from '../appellant-case.service.js';
import { mapInvalidOrIncompleteReasonOptionsToCheckboxItemParameters } from '../appellant-case.mapper.js';
import { objectContainsAllKeys } from '#lib/object-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { getNotValidReasonsTextFromRequestBody } from '#lib/mappers/validation-outcome-reasons.mapper.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderInvalidReason = async (request, response) => {
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
			request.session.webAppellantCaseReviewOutcome.validationOutcome !== 'invalid')
	) {
		delete request.session.webAppellantCaseReviewOutcome;
	}

	const invalidReasonOptions =
		await appellantCaseService.getAppellantCaseNotValidReasonOptionsForOutcome(
			request.apiClient,
			'invalid'
		);

	if (invalidReasonOptions) {
		const mappedInvalidReasonOptions = mapInvalidOrIncompleteReasonOptionsToCheckboxItemParameters(
			'invalid',
			invalidReasonOptions,
			body,
			request.session.webAppellantCaseReviewOutcome,
			appellantCaseResponse.validation
		);

		return response.render('appeals/appeal/appellant-case-invalid-incomplete.njk', {
			appeal: {
				id: appealId,
				shortReference: appealShortReference(appealReference)
			},
			notValidStatus: 'invalid',
			reasonOptions: mappedInvalidReasonOptions,
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
const renderDecisionInvalidConfirmationPage = async (request, response) => {
	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;

	response.render('app/confirmation.njk', {
		panel: {
			title: 'Appeal invalid',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			}
		},
		body: {
			preTitle: 'The appeal has been closed.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: "We've sent an email to the appellant and LPA to inform them the case is invalid."
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
export const getInvalidReason = async (request, response) => {
	renderInvalidReason(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postInvalidReason = async (request, response) => {
	const { errors } = request;

	if (errors) {
		return renderInvalidReason(request, response);
	}

	try {
		if (!objectContainsAllKeys(request.session, 'appealId')) {
			return response.render('app/500.njk');
		}

		const { appealId } = request.session;

		/** @type {import('../appellant-case.types.js').AppellantCaseSessionValidationOutcome} */
		request.session.webAppellantCaseReviewOutcome = {
			appealId,
			validationOutcome: 'invalid',
			reasons: request.body.invalidReason,
			reasonsText: getNotValidReasonsTextFromRequestBody(request.body, 'invalidReason')
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/appellant-case/check-your-answers`
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
	renderDecisionInvalidConfirmationPage(request, response);
};
