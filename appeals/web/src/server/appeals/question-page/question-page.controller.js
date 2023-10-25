import { getAppealDetailsFromId } from '#appeals/appeal-details/appeal-details.service.js';
import { getLpaQuestionnaireFromId } from '#appeals/appeal-details/lpa-questionaire/lpa-questionnaire.service.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import logger from '#lib/logger.js';
import {
	appealBackLink,
	appealQuestionPage,
	lpaQuestionnaireBackLink,
	lpaQQuestionPage
} from './question-page.mapper.js';

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderQuestionPage = async (request, response) => {
	try {
		const currentUrl = request.originalUrl;
		const currentUrlFragments = currentUrl.split('/');
		const origin = currentUrlFragments[currentUrlFragments.length - 2];
		let mappedData;
		let data;
		const appealId = request.params.appealId;
		let backLink;
		switch (origin) {
			case 'change-appeal-details':
				data = await getAppealDetailsFromId(request.apiClient, appealId);
				mappedData = await appealQuestionPage(
					request.params.question,
					{ appeal: data },
					currentUrl,
					request.session
				);
				backLink = appealBackLink(request.params.appealId);
				break;
			case 'change-lpa-questionnaire':
				data = await getLpaQuestionnaireFromId(
					request.apiClient,
					request.params.appealId,
					request.params.lpaQuestionnaireId
				);
				mappedData = await lpaQQuestionPage(request.params.question, { lpaq: data }, currentUrl);
				backLink = lpaQuestionnaireBackLink(
					request.params.appealId,
					request.params.lpaQuestionnaireId
				);
				break;
			default:
				return response.render('app/500.njk');
		}

		if (data === undefined || mappedData === undefined) {
			return response.render('app/404.njk');
		} else {
			const shortReference = appealShortReference(data.appealReference);

			return response.render('patterns/question-page.pattern.njk', {
				pageContents: mappedData,
				appealId: appealId,
				appealReference: shortReference,
				backLinkUrl: backLink
			});
		}
	} catch (error) {
		logger.error(error);
		return response.render('app/404.njk');
	}
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getQuestionPage = async (request, response) => {
	renderQuestionPage(request, response);
};
