import { getAllCaseKeyDates } from './applications-key-dates.service.js';

/**
 * View the index of all the case key dates
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewKeyDatesIndex(request, response) {
	const { caseId } = response.locals;

	const sections = await getAllCaseKeyDates(+caseId);

	return response.render(`applications/case-key-dates/key-dates-index.njk`, {
		sections,
		selectedPageType: 'key-dates'
	});
}
