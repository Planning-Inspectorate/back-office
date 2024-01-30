import { appealShortReference } from '#lib/appeals-formatter.js';
import config from '@pins/appeals.web/environment/config.js';
import { getAppealDetailsFromId, postInspectorDecision } from './issue-decision.service.js';
import logger from '#lib/logger.js';
import {
	checkAndConfirmPage,
	dateDecisionLetterPage,
	issueDecisionPage,
	decisionConfirmationPage,
	mapDecisionOutcome
} from './issue-decision.mapper.js';
import { getFolder } from '#appeals/appeal-documents/appeal.documents.service.js';

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getIssueDecision = async (request, response) => {
	return renderIssueDecision(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postIssueDecision = async (request, response) => {
	try {
		const { appealId } = request.params;
		const { decision } = request.body;
		const { errors } = request;

		if (errors) {
			return renderIssueDecision(request, response);
		}

		/** @type {import('./issue-decision.types.js').InspectorDecisionRequest} */
		request.session.inspectorDecision = {
			appealId: appealId,
			...request.session.inspectorDecision,
			outcome: decision
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/issue-decision/decision-letter-upload`
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
const renderIssueDecision = async (request, response) => {
	const { errors } = request;

	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	if (
		request.session?.inspectorDecision?.appealId &&
		request.session?.inspectorDecision?.appealId !== appealId
	) {
		request.session.inspectorDecision = {};
	}

	let mappedPageContent = await issueDecisionPage(appealData, request.session.inspectorDecision);

	return response.render('appeals/appeal/issue-decision.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getDecisionLetterUpload = async (request, response) => {
	return renderDecisionLetterUpload(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postDecisionLetterUpload = async (request, response) => {
	try {
		const { appealId } = request.params;
		const { errors } = request;

		if (errors) {
			return renderIssueDecision(request, response);
		}

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/issue-decision/decision-date`
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
const renderDecisionLetterUpload = async (request, response) => {
	let documentName;

	const { appealId } = request.params;
	const { errors } = request;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);
	const currentFolder = {
		id: appealData.decision?.folderId,
		path: 'appeal_decision/decisionLetter'
	};

	if (!currentFolder || !currentFolder.id) {
		return response.status(404).render('app/404');
	}

	const pathComponents = currentFolder.path.split('/');
	const documentStage = pathComponents[0];
	const documentType = pathComponents[1];
	const shortAppealReference = appealShortReference(appealData.appealReference);

	let mappedPageContent = {
		backButtonUrl: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision`,
		appealId,
		folderId: currentFolder.id,
		useBlobEmulator: config.useBlobEmulator,
		blobStorageHost:
			config.useBlobEmulator === true ? config.blobEmulatorSasUrl : config.blobStorageUrl,
		blobStorageContainer: config.blobStorageDefaultContainer,
		multiple: false,
		documentStage: documentStage,
		serviceName: documentName,
		pageTitle: `Appeal ${shortAppealReference}`,
		pageHeadingText: 'Upload your decision letter',
		caseInfoText: `Appeal ${shortAppealReference}`,
		documentType: documentType,
		nextPageUrl: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision-letter-date`,
		errors
	};

	return response.render('appeals/documents/decision-letter-upload.njk', mappedPageContent);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getDateDecisionLetter = async (request, response) => {
	return renderDateDecisionLetter(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postDateDecisionLetter = async (request, response) => {
	try {
		const { appealId } = request.params;
		const {
			'decision-letter-date-day': day,
			'decision-letter-date-month': month,
			'decision-letter-date-year': year
		} = request.body;
		const { errors } = request;

		if (errors) {
			return renderDateDecisionLetter(request, response);
		}

		const letterDate = new Date(year, month - 1, day);

		/** @type {import('./issue-decision.types.js').InspectorDecisionRequest} */
		request.session.inspectorDecision = {
			...request.session.inspectorDecision,
			letterDate: letterDate
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/issue-decision/check-your-decision`
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
const renderDateDecisionLetter = async (request, response) => {
	const { errors } = request;
	// const {
	// 	'decision-letter-date-day': decisionLetterDay,
	// 	'decision-letter-date-month': decisionLetterMonth,
	// 	'decision-letter-date-year': decisionLetterYear
	// } = request.body;

	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);
	const currentFolder = {
		id: appealData.decision?.folderId,
		path: 'appeal_decision/decisionLetter'
	};

	if (!currentFolder || !currentFolder.id) {
		return response.status(404).render('app/404');
	}

	const folder = await getFolder(request.apiClient, appealId, currentFolder.id.toString());
	const documentId = folder?.documents?.length && folder.documents[0].id;

	if (documentId) {
		/** @type {import('./issue-decision.types.js').InspectorDecisionRequest} */
		request.session.inspectorDecision = {
			...request.session.inspectorDecision,
			documentId
		};
	}

	let decisionLetterDay = request.body['decision-letter-date-day'];
	let decisionLetterMonth = request.body['decision-letter-date-month'];
	let decisionLetterYear = request.body['decision-letter-date-year'];

	if (!decisionLetterDay || !decisionLetterMonth || !decisionLetterYear) {
		if (request.session.inspectorDecision?.letterDate) {
			const letterDate = new Date(request.session.inspectorDecision.letterDate);
			decisionLetterDay = letterDate.getDate();
			decisionLetterMonth = letterDate.getMonth() + 1; // Months are 0-indexed
			decisionLetterYear = letterDate.getFullYear();
		}
	}

	let mappedPageContent = await dateDecisionLetterPage(
		appealData,
		decisionLetterDay,
		decisionLetterMonth,
		decisionLetterYear
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
export const getCheckDecision = async (request, response) => {
	return renderCheckDecision(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postCheckDecision = async (request, response) => {
	try {
		const { appealId } = request.params;
		const { errors } = request;

		if (errors) {
			return renderCheckDecision(request, response);
		}

		const decisionOutcome = request.session.inspectorDecision.outcome;
		const documentId = request.session.inspectorDecision.documentId;
		const letterDate = new Date(request.session.inspectorDecision.letterDate);
		const formattedDate = letterDate.toISOString().split('T')[0];

		await postInspectorDecision(
			request.apiClient,
			appealId,
			mapDecisionOutcome(decisionOutcome).toLowerCase(),
			documentId,
			formattedDate
		);

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/issue-decision/decision-sent`
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
export const renderCheckDecision = async (request, response) => {
	const { errors } = request;
	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	if (!appealData) {
		return response.render('app/404.njk');
	}

	if (!appealData.decision) {
		return response.render('app/500.njk');
	}

	const decisionLetterFolder = await getFolder(
		request.apiClient,
		appealId,
		appealData.decision.folderId.toString() || ''
	);

	let mappedPageContent = checkAndConfirmPage(
		request,
		appealData,
		request.session.inspectorDecision,
		decisionLetterFolder
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
export const getDecisionSent = async (request, response) => {
	const appealId = request.params.appealId;
	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	/** @type {import('./issue-decision.types.js').InspectorDecisionRequest} */
	request.session.inspectorDecision = {};

	let mappedPageContent = await decisionConfirmationPage(appealData);
	return response.render('appeals/confirmation.njk', mappedPageContent);
};
