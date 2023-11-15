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

/** @typedef {import('#lib/mappers/appeal.mapper.js').Instructions} Instructions */

/**
 * @typedef {Object} QuestionPage
 * @property {PageComponent[]} pageComponents
 * @property {string} titleText
 */

/**
 *
 * @param {string} question
 * @param {{appeal: import("#appeals/appeal-details/appeal-details.service.js").Appeal}} data
 * @param {string} currentRoute
 * @param {import('../../app/auth/auth-session.service').SessionWithAuth} session
 * @returns {Promise<QuestionPage>}
 */
export async function appealQuestionPage(question, data, currentRoute, session) {
	const mappedData = await initialiseAndMapAppealData(data, currentRoute, session);
	const instructionsForQuestion = getInstructions(question, mappedData.appeal);

	return mapInstructionsToQuestionPage(instructionsForQuestion);
}

/**
 *
 * @param {string} question
 * @param {{lpaq: import("#appeals/appeal-details/appeal-details.types.js").SingleLPAQuestionnaireResponse}} data
 * @param {string} currentRoute
 * @returns {Promise<QuestionPage>}
 */
export async function lpaQQuestionPage(question, data, currentRoute) {
	const mappedData = await initialiseAndMapLPAQData(data, currentRoute);
	const instructionsForQuestion = getInstructions(question, mappedData.lpaq);

	return mapInstructionsToQuestionPage(instructionsForQuestion);
}

/**
 * @param {Instructions | undefined} instructions
 * @returns {QuestionPage}
 */
function mapInstructionsToQuestionPage (instructions) {
	return {
		pageComponents: (instructions?.input || []).map(instruction => ({
			type: instruction.type,
			parameters: instruction.properties
		})),
		titleText: instructions?.display?.displayText || ''
	}
}

/**
 *
 * @param {string} question
 * @param {import("#lib/mappers/appeal.mapper.js").AppealInstructionCollection} instructions
 * @returns {import('#lib/mappers/appeal.mapper.js').Instructions| undefined}
 */
function getInstructions(question, instructions) {
	for (const instruction in instructions) {
		if (instructions[instruction].id === question) {
			return instructions[instruction];
		}
	}
	logger.error(`No instructions found for ${question}`);
	return undefined;
}
