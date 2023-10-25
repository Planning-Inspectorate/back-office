import logger from '#lib/logger.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { initialiseAndMapLPAQData } from '#lib/mappers/lpaQuestionnaire.mapper.js';

/** @typedef {{text: string, link: string}} BackLinkProperties */
/**
 *
 * @param {string} appealId
 * @param {string} lpaQuestionnaireId
 * @returns {BackLinkProperties}
 */

export const lpaQuestionnaireBackLink = (appealId, lpaQuestionnaireId) => {
	return {
		text: 'Back to LPA questionnaire',
		link: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}`
	};
};

/**
 *
 * @param {string} appealId
 * @returns {BackLinkProperties}
 */
export const appealBackLink = (appealId) => {
	return {
		text: 'Back to appeal details',
		link: `/appeals-service/appeal-details/${appealId}`
	};
};

/**
 *
 * @param {string} question
 * @param {{appeal: import("#appeals/appeal-details/appeal-details.service.js").Appeal}} data
 * @param {string} currentRoute
 * @param {import('../../app/auth/auth-session.service').SessionWithAuth} session
 * @returns {Promise<import("#lib/mappers/appeal.mapper.js").InputInstruction[] | undefined>}
 */
export async function appealQuestionPage(question, data, currentRoute, session) {
	const mappedData = await initialiseAndMapAppealData(data, currentRoute, session);
	return getInputInstructions(question, mappedData.appeal);
}

/**
 *
 * @param {string} question
 * @param {{lpaq: import("#appeals/appeal-details/appeal-details.types.js").SingleLPAQuestionnaireResponse}} data
 * @param {string} currentRoute
 * @returns {Promise<import("#lib/mappers/appeal.mapper.js").InputInstruction[] | undefined>}
 */
export async function lpaQQuestionPage(question, data, currentRoute) {
	const mappedData = await initialiseAndMapLPAQData(data, currentRoute);
	return getInputInstructions(question, mappedData.lpaq);
}

/**
 *
 * @param {string} question
 * @param {import("#lib/mappers/appeal.mapper.js").AppealInstructionCollection} instructions
 * @returns {import('#lib/mappers/appeal.mapper.js').InputInstruction[]| undefined}
 */
function getInputInstructions(question, instructions) {
	for (const instruction in instructions) {
		if (instructions[instruction].id === question) {
			return instructions[instruction].input;
		}
	}
	logger.error(`No input instructions found for ${question}`);
	return undefined;
}
