import { getAppealDetailsFromId, postUnlinkRequest } from './manage-linked-appeals.service.js';
import { linkedAppealsPage, unlinkAppealPage } from './manage-linked-appeals.mapper.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getLinkedAppeals = async (request, response) => {
	return renderLinkedAppeals(request, response);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderLinkedAppeals = async (request, response) => {
	const { errors } = request;
	const { appealId, parentId, relationshipId } = request.params;
	const validId = parentId !== 'null' && parentId ? parentId : appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, validId);

	const mappedPageContent = await linkedAppealsPage(appealData, relationshipId, appealId, parentId);

	return response.render('patterns/display-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getUnlinkAppeal = async (request, response) => {
	return renderUnlinkAppeal(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postUnlinkAppeal = async (request, response) => {
	try {
		const { appealId, relationshipId } = request.params;
		const { unlinkAppeal } = request.body;
		const { errors } = request;

		if (errors) {
			return renderUnlinkAppeal(request, response);
		}

		if (unlinkAppeal === 'no') {
			return response.redirect(
				`/appeals-service/appeal-details/${appealId}/manage-linked-appeals/linked-appeals`
			);
		}
		if (unlinkAppeal === 'yes') {
			const appealRelationshipId = parseInt(relationshipId, 10);
			const appealData = await getAppealDetailsFromId(request.apiClient, appealId);
			const childRef =
				appealData.linkedAppeals.find((appeal) => appeal.relationshipId === appealRelationshipId)
					?.appealReference || '';

			await postUnlinkRequest(request.apiClient, appealId, appealRelationshipId);
			addNotificationBannerToSession(
				request.session,
				'appealUnlinked',
				appealId,
				`<p class="govuk-notification-banner__heading">You have unlinked this appeal from appeal ${childRef}</p>`
			);

			return response.redirect(`/appeals-service/appeal-details/${appealId}`);
		}

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/change-appeal-type/change-appeal-final-date`
		);
	} catch (error) {
		return response.render('app/500.njk');
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderUnlinkAppeal = async (request, response) => {
	const { errors } = request;

	const { appealId, relationshipId } = request.params;

	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	const childRef =
		appealData.linkedAppeals.find(
			(appeal) => appeal.relationshipId === parseInt(relationshipId, 10)
		)?.appealReference || '';

	const mappedPageContent = await unlinkAppealPage(appealData, childRef);

	return response.render('patterns/display-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors
	});
};
