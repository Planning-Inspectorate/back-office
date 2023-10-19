import logger from '#lib/logger.js';

import { objectContainsAllKeys } from '#lib/object-utilities.js';
import { setAppealTimetables } from './appeal-timetables.service.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import {
	routeToObjectMapper,
	appealTimetablesMapper,
	apiErrorMapper
} from './appeal-timetables.mapper.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {object} [apiErrors]
 */
const renderUpdateDueDate = async (request, response, apiErrors) => {
	const appealDetails = request.currentAppeal;
	const appealId = appealDetails.appealId;
	const { timetableType } = request.params;
	const timetableProperty = routeToObjectMapper[timetableType];
	const pageContent = appealTimetablesMapper(appealDetails?.appealTimetable, timetableProperty);

	if (!appealId || !timetableProperty || !pageContent) {
		return response.render('app/500.njk');
	}

	let errors = request.errors || apiErrors;

	const { sideNote, page } = pageContent;

	return response.render('appeals/appeal/update-due-date.njk', {
		appeal: {
			id: appealId,
			shortReference: appealShortReference(appealDetails.appealReference)
		},
		sideNote,
		page,
		continueButtonText: 'Continue',
		backButtonUrl: `/appeals-service/appeal-details/${appealId}`,
		skipButtonUrl: null,
		errors
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const processUpdateDueDate = async (request, response) => {
	if (request.errors) {
		return renderUpdateDueDate(request, response);
	}

	const { body } = request;
	const appealDetails = request.currentAppeal;
	const appealId = appealDetails.appealId;
	const { appealTimetableId } = appealDetails.appealTimetable;
	const { timetableType } = request.params;

	if (!objectContainsAllKeys(body, ['due-date-day', 'due-date-month', 'due-date-year'])) {
		return response.render('app/500.njk');
	}

	try {
		const updatedDueDateDay = parseInt(body['due-date-day'], 10);
		const updatedDueDateMonth = parseInt(body['due-date-month'], 10);
		const updatedDueDateYear = parseInt(body['due-date-year'], 10);

		if (
			Number.isNaN(updatedDueDateDay) ||
			Number.isNaN(updatedDueDateMonth) ||
			Number.isNaN(updatedDueDateYear)
		) {
			return response.render('app/500.njk');
		}

		const updatedDueDateDayString = `0${updatedDueDateDay}`.slice(-2);
		const updatedDueDateMonthString = `0${updatedDueDateMonth}`.slice(-2);

		const timetableProperty = routeToObjectMapper[timetableType];

		const setAppealTimetableResponse = await setAppealTimetables(
			request.apiClient,
			appealId,
			appealTimetableId,
			{
				[timetableProperty]: `${updatedDueDateYear}-${updatedDueDateMonthString}-${updatedDueDateDayString}`
			}
		);

		if (setAppealTimetableResponse.errors) {
			const apiError = Object.values(setAppealTimetableResponse.errors)[0];
			if (apiError) {
				const apiErrors = apiErrorMapper(updatedDueDateDay, apiError);

				return renderUpdateDueDate(request, response, apiErrors);
			} else {
				return response.render('app/500.njk');
			}
		}

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/appeal-timetables/${timetableType}/confirmation`
		);
	} catch (error) {
		logger.error(
			error,
			error instanceof Error ? error.message : 'Something went wrong when changing appeal timetable'
		);

		return response.render('app/500.njk');
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderConfirmationPage = async (request, response) => {
	const { appealId, appealReference } = request.currentAppeal;
	const { timetableType } = request.params;

	if (!appealId || !appealReference) {
		return response.render('app/500.njk');
	}

	const appealDetails = request.currentAppeal;
	const timetableProperty = routeToObjectMapper[timetableType];

	const confirmationMap = appealTimetablesMapper(appealDetails?.appealTimetable, timetableProperty);

	if (!confirmationMap?.confirmation) {
		return response.render('app/500.njk');
	} else {
		const { title, preTitle, rows } = confirmationMap.confirmation;

		response.render('app/confirmation.njk', {
			panel: {
				title,
				appealReference: {
					label: 'Appeal ID',
					reference: appealReference
				}
			},
			body: {
				preTitle,
				title: {
					text: 'What happens next'
				},
				rows: [
					...rows,
					{
						text: 'Go to case details',
						href: `/appeals-service/appeal-details/${appealId}`
					}
				]
			}
		});
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getDueDate = async (request, response) => {
	renderUpdateDueDate(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postDueDate = async (request, response) => {
	processUpdateDueDate(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getConfirmation = async (request, response) => {
	renderConfirmationPage(request, response);
};
