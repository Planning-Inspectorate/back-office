import logger from '#lib/logger.js';
import {
	getAppealDetailsFromId,
	getAppealTypesFromId,
	postChangeAppealType
} from './change-appeal-type.service.js';
import {
	appealTypePage,
	changeAppealFinalDatePage,
	resubmitAppealPage,
	resubmitConfirmationPage
} from './change-appeal-type.mapper.js';

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getAppealType = async (request, response) => {
	return renderAppealType(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postAppealType = async (request, response) => {
	try {
		const { appealId } = request.params;
		const { appealType } = request.body;
		const { errors } = request;

		if (errors) {
			return renderAppealType(request, response);
		}

		/** @type {import('./change-appeal-type.types.js').ChangeAppealTypeRequest} */
		request.session.changeAppealType = {
			...request.session.changeAppealType,
			appealTypeId: parseInt(appealType, 10)
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/change-appeal-type/resubmit`
		);
	} catch (error) {
		logger.error(error);
		return response.render('app/500.njk');
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAppealType = async (request, response) => {
	const { errors } = request;

	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	const appealTypes = await getAppealTypesFromId(request.apiClient, appealId);
	if (!appealTypes) {
		throw new Error('error retrieving Appeal Types');
	}

	let mappedPageContent = await appealTypePage(
		appealData,
		appealTypes,
		request.session.changeAppealType
	);

	return response.render('appeals/appeal/issue-decision.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getResubmitAppeal = async (request, response) => {
	return renderResubmitAppeal(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postResubmitAppeal = async (request, response) => {
	try {
		const { appealId } = request.params;
		const { appealResubmit } = request.body;
		const { errors } = request;

		if (errors) {
			return renderResubmitAppeal(request, response);
		}

		/** @type {import('./change-appeal-type.types.js').ChangeAppealTypeRequest} */
		request.session.changeAppealType = {
			...request.session.changeAppealType,
			resubmit: appealResubmit === 'true'
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/change-appeal-type/change-appeal-final-date`
		);
	} catch (error) {
		logger.error(error);
		return response.render('app/500.njk');
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderResubmitAppeal = async (request, response) => {
	const { errors } = request;

	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	let mappedPageContent = await resubmitAppealPage(appealData, request.session.changeAppealType);

	return response.render('appeals/appeal/issue-decision.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getChangeAppealFinalDate = async (request, response) => {
	return renderChangeAppealFinalDate(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postChangeAppealFinalDate = async (request, response) => {
	try {
		const { appealId } = request.params;
		const {
			'change-appeal-final-date-day': day,
			'change-appeal-final-date-month': month,
			'change-appeal-final-date-year': year
		} = request.body;
		const { errors } = request;

		if (errors) {
			return renderChangeAppealFinalDate(request, response);
		}
		const appealTypeId = parseInt(request.session.changeAppealType.appealTypeId, 10);
		const appealTypeFinalDate = new Date(year, month - 1, day);
		const formattedDate = appealTypeFinalDate.toISOString().split('T')[0];

		/** @type {import('./change-appeal-type.types.js').ChangeAppealTypeRequest} */
		request.session.changeAppealType = {
			...request.session.changeAppealType,
			appealTypeFinalDate: appealTypeFinalDate
		};

		await postChangeAppealType(request.apiClient, appealId, appealTypeId, formattedDate);

		/** @type {import('./change-appeal-type.types.js').ChangeAppealTypeRequest} */
		request.session.changeAppealType = {};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/change-appeal-type/confirm-resubmit`
		);
	} catch (error) {
		logger.error(error);
		return response.render('app/500.njk');
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderChangeAppealFinalDate = async (request, response) => {
	const { errors } = request;
	const {
		'change-appeal-final-date-day': changeDay,
		'change-appeal-final-date-month': changeMonth,
		'change-appeal-final-date-year': changeYear
	} = request.body;

	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	let mappedPageContent = await changeAppealFinalDatePage(
		appealData,
		changeDay,
		changeMonth,
		changeYear
	);

	return response.render('appeals/appeal/issue-decision.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getConfirmResubmit = async (request, response) => {
	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	let mappedPageContent = await resubmitConfirmationPage(appealData);
	return response.render('appeals/confirmation.njk', mappedPageContent);
};
