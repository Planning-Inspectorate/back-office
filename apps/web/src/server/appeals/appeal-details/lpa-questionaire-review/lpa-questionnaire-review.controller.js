import { getLpaQuestionnaireFromId } from './lpa-questionnaire-review.service.js';
import { mapLpaQuestionnaire } from './lpa-questionnaire-review.mapper.js';
import { generateSummaryList } from '../../../lib/nunjucks-template-builders/summary-list-builder.js';

/**
 *
 * @param {*} request
 * @param {*} response
 */
export async function viewLpaQuestionnaire(request, response) {
	const lpaQuestionnaireResponse = await getLpaQuestionnaireFromId(
		request.params.appealId,
		request.params.lpaQId
	);

	const mappedLpaQuestionnaireSections = mapLpaQuestionnaire(lpaQuestionnaireResponse);
	const formattedSections = [];
	for (const section of mappedLpaQuestionnaireSections) {
		formattedSections.push(generateSummaryList(section.header, section.rows));
	}

	response.render('appeals/appeal/lpa-questionnaire-view.njk', {
		summaryList: { formattedSections }
	});
}
