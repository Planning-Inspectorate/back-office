import logger from '#lib/logger.js';
import { personalListPage } from './personal-list.mapper.js';
import { getAppealsAssignedToCurrentUser } from './personal-list.service.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const viewPersonalList = async (request, response) => {
	const assignedAppealsSummary = await getAppealsAssignedToCurrentUser(request.apiClient).catch(
		(error) => logger.error(error)
	);

	const mappedPageContent = personalListPage(assignedAppealsSummary, request.session);

	return response.render('patterns/display-page.pattern.njk', {
		pageContent: mappedPageContent
	});
};
