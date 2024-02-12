import logger from '#lib/logger.js';
import {
	getAppealDetailsFromId,
	getAppealTypesFromId,
	postAppealChangeRequest,
	postAppealTransferRequest,
	postAppealTransferConfirmation
} from './change-appeal-type.service.js';
import {
	appealTypePage,
	changeAppealFinalDatePage,
	resubmitAppealPage,
	resubmitConfirmationPage,
	addHorizonReferencePage,
	checkTransferPage
} from './change-appeal-type.mapper.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';

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
			appealId: appealId,
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

	const [appealData, appealTypes] = await Promise.all([
		getAppealDetailsFromId(request.apiClient, appealId),
		getAppealTypesFromId(request.apiClient, appealId)
	]);

	if (!appealTypes) {
		throw new Error('error retrieving Appeal Types');
	}

	if (
		request.session?.changeAppealType?.appealId &&
		request.session?.changeAppealType?.appealId !== appealId
	) {
		request.session.changeAppealType = {};
	}

	const mappedPageContent = appealTypePage(
		appealData,
		appealTypes,
		request.session.changeAppealType
	);

	return response.render('patterns/change-page.pattern.njk', {
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

		const isResubmit = appealResubmit === 'true';

		if (!isResubmit) {
			const appealTypeId = parseInt(request.session.changeAppealType.appealTypeId, 10);

			await postAppealTransferRequest(request.apiClient, appealId, appealTypeId);

			return response.redirect(`/appeals-service/appeal-details/${appealId}`);
		}

		/** @type {import('./change-appeal-type.types.js').ChangeAppealTypeRequest} */
		request.session.changeAppealType = {
			...request.session.changeAppealType,
			resubmit: isResubmit
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
	const mappedPageContent = resubmitAppealPage(appealData, request.session.changeAppealType);

	return response.render('patterns/change-page.pattern.njk', {
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

		await postAppealChangeRequest(request.apiClient, appealId, appealTypeId, formattedDate);

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

	const mappedPageContent = changeAppealFinalDatePage(
		appealData,
		changeDay,
		changeMonth,
		changeYear
	);

	return response.render('patterns/change-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getAddHorizonReference = async (request, response) => {
	return renderAddHorizonReference(request, response);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAddHorizonReference = async (request, response) => {
	const {
		errors,
		params: { appealId }
	} = request;

	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	const mappedPageContent = addHorizonReferencePage(appealData);

	return response.render('patterns/change-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postAddHorizonReference = async (request, response) => {
	try {
		const {
			errors,
			params: { appealId },
			body: { 'horizon-reference': horizonReference }
		} = request;

		if (errors) {
			return renderAddHorizonReference(request, response);
		}

		/** @type {import('./change-appeal-type.types.js').ChangeAppealTypeRequest} */
		request.session.changeAppealType = {
			...request.session.changeAppealType,
			transferredAppealHorizonReference: horizonReference
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/change-appeal-type/check-transfer`
		);
	} catch (error) {
		logger.error(error);
		return response.render('app/500.njk');
	}
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getCheckTransfer = async (request, response) => {
	return renderCheckTransfer(request, response);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderCheckTransfer = async (request, response) => {
	if (
		!('changeAppealType' in request.session) ||
		!('transferredAppealHorizonReference' in request.session.changeAppealType)
	) {
		return response.render('app/500.njk');
	}

	const {
		errors,
		params: { appealId }
	} = request;

	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);
	const mappedPageContent = await checkTransferPage(
		request.apiClient,
		appealData,
		request.session.changeAppealType.transferredAppealHorizonReference
	);

	return response.render('patterns/check-and-confirm-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postCheckTransfer = async (request, response) => {
	try {
		if (
			!('changeAppealType' in request.session) ||
			!('transferredAppealHorizonReference' in request.session.changeAppealType)
		) {
			return response.render('app/500.njk');
		}

		const {
			errors,
			params: { appealId }
		} = request;

		if (errors) {
			return renderCheckTransfer(request, response);
		}

		await postAppealTransferConfirmation(
			request.apiClient,
			appealId,
			request.session.changeAppealType.transferredAppealHorizonReference
		);

		/** @type {import('./change-appeal-type.types.js').ChangeAppealTypeRequest} */
		request.session.changeAppealType = {};

		addNotificationBannerToSession(request.session, 'horizonReferenceAdded', appealId);

		return response.redirect(`/appeals-service/appeal-details/${appealId}`);
	} catch (error) {
		logger.error(error);
		return response.render('app/500.njk');
	}
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getConfirmResubmit = async (request, response) => {
	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);
	const pageContent = resubmitConfirmationPage(appealData);

	return response.render('appeals/confirmation.njk', {
		pageContent
	});
};
