import {
	getLpaQuestionnaireFromId,
	setReviewOutcomeForLpaQuestionnaire
} from './lpa-questionnaire-review.service.js';
import { mapLpaQuestionnaire } from './lpa-questionnaire-review.mapper.js';
import { generateSummaryList } from '#lib/nunjucks-template-builders/summary-list-builder.js';
import logger from '#lib/logger.js';
import * as appealDetailsService from '../../appeal-details/appeal-details.service.js';

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} lpaQId
 * @param {import('@pins/express').ValidationErrors | string | null} errors
 * @param {*} response
 */
const renderLpaQuestionnaire = async (apiClient, appealId, lpaQId, response, errors = null) => {
	const lpaQuestionnaireResponse = await getLpaQuestionnaireFromId(apiClient, appealId, lpaQId);

	const mappedLpaQuestionnaireSections = mapLpaQuestionnaire(lpaQuestionnaireResponse);
	const formattedSections = [];
	for (const section of mappedLpaQuestionnaireSections) {
		formattedSections.push(generateSummaryList(section));
	}

	return response.render('appeals/appeal/lpa-questionnaire-view.njk', {
		summaryList: { formattedSections },
		errors: errors ? [errors] : null
	});
};

/**
 *
 * @param {*} request
 * @param {*} response
 */
export const getLpaQuestionnaire = async ({ apiClient, params: { appealId, lpaQId } }, response) =>
	renderLpaQuestionnaire(apiClient, appealId, lpaQId, response);

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postLpaQuestionnaire = async (
	{ apiClient, params: { appealId, lpaQId }, body, errors },
	response
) => {
	// If it fails validations
	if (errors) {
		return renderLpaQuestionnaire(apiClient, appealId, lpaQId, response, errors);
	}
	// If it succeeds validation
	try {
		const reviewOutcome = body['review-outcome'];
		await setReviewOutcomeForLpaQuestionnaire(apiClient, appealId, lpaQId, reviewOutcome);
		return renderLpaQuestionnaireReviewCompletePage(apiClient, appealId, response);
	} catch (error) {
		let errorMessage = 'Something went wrong when completing LPA questionnaire review';
		if (error instanceof Error) {
			errorMessage += `: ${error.message}`;
		}

		logger.error(error, errorMessage);

		return renderLpaQuestionnaire(apiClient, appealId, lpaQId, response, errorMessage);
	}
};

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {*} response
 */
export const renderLpaQuestionnaireReviewCompletePage = async (apiClient, appealId, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(apiClient, appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		return response.render('app/confirmation.njk', {
			panel: {
				appealReference: {
					label: 'Appeal ID',
					reference: appealDetails.appealReference
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
	}

	return response.render(`app/404.njk`);
};
