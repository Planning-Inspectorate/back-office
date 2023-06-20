import {
	getLpaQuestionnaireFromId
	// TODO: uncomment when BOAT-238 is complete
	// setReviewOutcomeForLpaQuestionnaire
} from './lpa-questionnaire-review.service.js';
import { mapLpaQuestionnaire } from './lpa-questionnaire-review.mapper.js';
import { generateSummaryList } from '../../../lib/nunjucks-template-builders/summary-list-builder.js';
import logger from '../../../lib/logger.js';

/**
 *
 * @param {string} appealId
 * @param {string} lpaQId
 * @param {import("../../../../../../../packages/express/types/express.js").ValidationErrors | string | null} errors
 * @param {*} response
 */
const renderLpaQuestionnaire = async (appealId, lpaQId, response, errors = null) => {
	const lpaQuestionnaireResponse = await getLpaQuestionnaireFromId(appealId, lpaQId);

	const mappedLpaQuestionnaireSections = mapLpaQuestionnaire(lpaQuestionnaireResponse);
	const formattedSections = [];
	for (const section of mappedLpaQuestionnaireSections) {
		formattedSections.push(generateSummaryList(section.header, section.rows));
	}

	return response.render('appeals/appeal/lpa-questionnaire-view.njk', {
		summaryList: { formattedSections },
		errors
	});
};

/**
 *
 * @param {*} request
 * @param {*} response
 */
export const getLpaQuestionnaire = async ({ params: { appealId, lpaQId } }, response) =>
	renderLpaQuestionnaire(appealId, lpaQId, response);

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postLpaQuestionnaire = async (
	{ params: { appealId, lpaQId }, body, errors },
	response
) => {
	// If it fails validations
	if (errors) {
		return renderLpaQuestionnaire(appealId, lpaQId, response, errors);
	}
	// If it succeeds validation
	try {
		const reviewOutcome = body['review-outcome'];

		// TODO: uncomment when BOAT-238 is complete, remove logger.debug if not needed
		// await setReviewOutcomeForLpaQuestionnaire(appealId, lpaQId, reviewOutcome);
		logger.debug(`LPA questionnaire review outcome: ${reviewOutcome}`);

		response.redirect(
			`/appeals-service/appeal-details/${appealId}/lpa-questionnaire-review/${lpaQId}/complete`
		);
	} catch (error) {
		let errorMessage = 'Something went wrong when completing LPA questionnaire review';
		if (error instanceof Error) {
			errorMessage += `: ${error.message}`;
		}

		logger.error(error, errorMessage);

		return renderLpaQuestionnaire(appealId, lpaQId, response, errorMessage);
	}
};

/**
 *
 * @param {*} request
 * @param {*} response
 */
export const getLpaQuestionnaireReviewComplete = ({ params: { appealId, lpaQId } }, response) => {
	/*
	TODO:
	- uncomment when generic "complete" page is done
	- provide correct path to its .njk
	- remove logger.debug
	- write test for the review complete page
	*/
	logger.debug(`LPA questionnaire review complete page: ${appealId}, ${lpaQId}`);

	response.render('appeals/appeal/generic-complete-page.njk', {
		appealId,
		lpaQId
	});
};
