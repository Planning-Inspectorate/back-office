import { appealShortReference } from '#lib/appeals-formatter.js';
import logger from '#lib/logger.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { initialiseAndMapLPAQData } from '#lib/mappers/lpaQuestionnaire.mapper.js';

/**
 * @typedef {import('../appeal-details/appeal-details.types.js').WebAppeal} Appeal
 */

/**
 *
 * @param {string} question
 * @param {Appeal} appealData
 * @param {string} currentRoute
 * @param {import('../../app/auth/auth-session.service').SessionWithAuth} session
 * @returns {Promise<PageContent>}
 */
export async function appealChangePage(question, appealData, currentRoute, session) {
	const mappedData = await initialiseAndMapAppealData(appealData, currentRoute, session, true);
	const instructionsForQuestion = getInstructions(question, mappedData.appeal);

	return mapInstructionsToChangePage(
		instructionsForQuestion,
		appealData,
		`/appeals-service/appeal-details/${appealData.appealId}`,
		'Back to case details'
	);
}

/**
 *
 * @param {string} question
 * @param {Appeal} appealData
 * @param {import('../appeal-details/appeal-details.types.js').SingleLPAQuestionnaireResponse} lpaqData
 * @param {string} currentRoute
 * @returns {PageContent}
 */
export function lpaQuestionnaireChangePage(question, appealData, lpaqData, currentRoute) {
	const mappedData = initialiseAndMapLPAQData(lpaqData, currentRoute);
	const instructionsForQuestion = getInstructions(question, mappedData.lpaq);

	return mapInstructionsToChangePage(
		instructionsForQuestion,
		appealData,
		`/appeals-service/appeal-details/${appealData.appealId}/lpa-questionnaire/${lpaqData.lpaQuestionnaireId}`,
		'Back to LPA questionnaire'
	);
}

/**
 * @param {Instructions | undefined} instructions
 * @param {Appeal} appealData
 * @param {string} backLinkUrl
 * @param {string} backLinkText
 * @returns {PageContent}
 */
function mapInstructionsToChangePage(instructions, appealData, backLinkUrl, backLinkText) {
	return {
		title: `Change ${instructions?.input?.displayName || ''}`,
		backLinkUrl,
		backLinkText,
		preHeading: `Appeal ${appealShortReference(appealData.appealReference)}`,
		heading: instructions?.input?.displayName || '',
		pageComponents: (instructions?.input?.instructions || []).map((instruction) => ({
			type: instruction.type,
			parameters: instruction.properties
		}))
	};
}

/**
 *
 * @param {string} question
 * @param {MappedInstructions} instructions
 * @returns {Instructions| undefined}
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
