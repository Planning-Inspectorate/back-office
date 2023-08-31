import {
	getLpaQuestionnaireFromId,
	getLPAQuestionnaireIncompleteReasons,
	setReviewOutcomeForLpaQuestionnaire
} from './lpa-questionnaire.service.js';
import {
	mapLpaQuestionnaire,
	mapReviewOutcomeToSummaryListBuilderParameters,
	mapWebReviewOutcomeToApiReviewOutcome
} from './lpa-questionnaire.mapper.js';
import { generateSummaryList } from '../../../lib/nunjucks-template-builders/summary-list-builder.js';
import logger from '../../../lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import { objectContainsAllKeys } from '../../../lib/object-utilities.js';

/**
 *
 * @param {string} appealId
 * @param {string} lpaQId
 * @param {import("@pins/express/types/express.js").ValidationErrors | string | null} errors
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {import('got').Got} apiClient
 */
const renderLpaQuestionnaire = async (apiClient, appealId, lpaQId, response, errors = null) => {
	const lpaQuestionnaireResponse = await getLpaQuestionnaireFromId(apiClient, appealId, lpaQId);

	const mappedLpaQuestionnaireSections = mapLpaQuestionnaire(lpaQuestionnaireResponse);
	const formattedSections = [];
	for (const section of mappedLpaQuestionnaireSections) {
		formattedSections.push(generateSummaryList(section));
	}

	return response.render('appeals/appeal/lpa-questionnaire.njk', {
		summaryList: { formattedSections },
		errors
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getLpaQuestionnaire = async ({ apiClient, params: { appealId, lpaQId } }, response) =>
	renderLpaQuestionnaire(apiClient, appealId, lpaQId, response);

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postLpaQuestionnaire = async (request, response) => {
	const {
		params: { appealId, lpaQId },
		body,
		errors,
		apiClient
	} = request;

	if (errors) {
		return renderLpaQuestionnaire(apiClient, appealId, lpaQId, response, errors);
	}

	try {
		const reviewOutcome = body['review-outcome'];
		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(apiClient, request.params.appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			const { appealReference } = appealDetails;

			request.session.appealId = appealId;
			request.session.appealReference = appealReference;

			if (reviewOutcome === 'complete') {
				await setReviewOutcomeForLpaQuestionnaire(apiClient, appealId, lpaQId, {
					validationOutcome: 'complete'
				});
				return response.redirect(
					`/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQId}/confirmation`
				);
			} else if (reviewOutcome === 'incomplete') {
				request.session.lpaQuestionnaireId = lpaQId;

				return response.redirect(
					`/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQId}/incomplete`
				);
			}
		} else {
			return response.render('app/500.njk');
		}
	} catch (error) {
		let errorMessage = 'Something went wrong when completing lpa questionnaire review';
		if (error instanceof Error) {
			errorMessage += `: ${error.message}`;
		}

		logger.error(error, errorMessage);

		return renderLpaQuestionnaire(apiClient, appealId, lpaQId, response, errorMessage);
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const renderLpaQuestionnaireReviewCompletePage = async (request, response) => {
	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;

	return response.render('app/confirmation.njk', {
		panel: {
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			},
			title: 'LPA questionnaire complete'
		},
		body: {
			preTitle: 'The review of LPA questionnaire is finished.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: "We've sent an email to the LPA to confirm their questionnaire is complete and the the review is finished."
				},
				{
					href: `/appeals-service/appeal-details/${appealId}`,
					text: 'Go back to case details'
				}
			]
		}
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderCheckAndConfirm = async (request, response) => {
	try {
		if (
			!objectContainsAllKeys(request.session, [
				'appealId',
				'appealReference',
				'lpaQuestionnaireId',
				'webLPAQuestionnaireReviewOutcome'
			])
		) {
			return response.render('app/500.njk');
		}

		const { appealId, appealReference, lpaQuestionnaireId, webLPAQuestionnaireReviewOutcome } =
			request.session;

		const reasonOptions = await getLPAQuestionnaireIncompleteReasons(request.apiClient);
		if (!reasonOptions) {
			throw new Error('error retrieving invalid reason options');
		}

		const appealReferenceFragments = appealReference.split('/');
		const mappedCheckAndConfirmSection = mapReviewOutcomeToSummaryListBuilderParameters(
			reasonOptions,
			'incomplete',
			webLPAQuestionnaireReviewOutcome.incompleteReasons,
			webLPAQuestionnaireReviewOutcome.otherReason,
			webLPAQuestionnaireReviewOutcome.updatedDueDate
		);
		const formattedSections = [generateSummaryList(mappedCheckAndConfirmSection)];

		return response.render('app/check-and-confirm.njk', {
			appeal: {
				id: appealId,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			page: {
				title: 'Check answers'
			},
			title: {
				text: 'Check your answers before confirming your review'
			},
			insetText: 'Confirming this review will inform the appellant and LPA of the outcome',
			summaryList: { formattedSections },
			backLinkUrl: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}`
		});
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing lpa questionnaire review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getCheckAndConfirm = async (request, response) => {
	renderCheckAndConfirm(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postCheckAndConfirm = async (request, response) => {
	try {
		if (
			!objectContainsAllKeys(request.session, [
				'appealId',
				'lpaQuestionnaireId',
				'webLPAQuestionnaireReviewOutcome'
			])
		) {
			return response.render('app/500.njk');
		}

		const { appealId, lpaQuestionnaireId, webLPAQuestionnaireReviewOutcome } = request.session;

		await setReviewOutcomeForLpaQuestionnaire(
			request.apiClient,
			appealId,
			lpaQuestionnaireId,
			mapWebReviewOutcomeToApiReviewOutcome(
				'incomplete',
				webLPAQuestionnaireReviewOutcome.incompleteReasons,
				webLPAQuestionnaireReviewOutcome.otherReason,
				webLPAQuestionnaireReviewOutcome.updatedDueDate
			)
		);

		if (webLPAQuestionnaireReviewOutcome.updatedDueDate) {
			request.session.lpaQuestionnaireUpdatedDueDate =
				webLPAQuestionnaireReviewOutcome.updatedDueDate;
		}

		delete request.session.webLPAQuestionnaireReviewOutcome;

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete/confirmation`
		);
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing lpa questionnaire review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getConfirmation = async (request, response) => {
	renderLpaQuestionnaireReviewCompletePage(request, response);
};
