import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import * as appellantCaseService from './appellant-case.service.js';
import {
	appellantCasePage,
	mapWebReviewOutcomeToApiReviewOutcome,
	checkAndConfirmPage
} from './appellant-case.mapper.js';
import { objectContainsAllKeys } from '#lib/object-utilities.js';
import {
	renderDocumentUpload,
	renderDocumentDetails,
	renderManageFolder,
	renderManageDocument,
	postDocumentDetails,
	renderChangeDocumentDetails,
	postChangeDocumentDetails
} from '../../appeal-documents/appeal-documents.controller.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAppellantCase = async (request, response) => {
	const { errors } = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (
		appealDetails &&
		appealDetails.appellantCaseId !== null &&
		appealDetails.appellantCaseId !== undefined
	) {
		const appellantCaseResponse = await appellantCaseService
			.getAppellantCaseFromAppealId(
				request.apiClient,
				appealDetails?.appealId,
				appealDetails?.appellantCaseId
			)
			.catch((error) => logger.error(error));

		const mappedPageContent = appellantCasePage(
			appellantCaseResponse,
			appealDetails,
			request.originalUrl,
			request.session
		);

		return response.render('patterns/display-page.pattern.njk', {
			pageContent: mappedPageContent,
			errors
		});
	}

	return response.render('app/404.njk');
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderCheckAndConfirm = async (request, response) => {
	try {
		if (
			!objectContainsAllKeys(request.session, [
				'appealId',
				'appealReference',
				'appellantCaseId',
				'webAppellantCaseReviewOutcome'
			])
		) {
			return response.render('app/500.njk');
		}

		const { appealId, appealReference, webAppellantCaseReviewOutcome } = request.session;

		const reasonOptions =
			await appellantCaseService.getAppellantCaseNotValidReasonOptionsForOutcome(
				request.apiClient,
				webAppellantCaseReviewOutcome.validationOutcome
			);
		if (!reasonOptions) {
			throw new Error('error retrieving invalid reason options');
		}

		const mappedPageContent = checkAndConfirmPage(
			appealId,
			appealReference,
			reasonOptions,
			webAppellantCaseReviewOutcome.validationOutcome,
			request.session,
			webAppellantCaseReviewOutcome.reasons,
			webAppellantCaseReviewOutcome.reasonsText,
			webAppellantCaseReviewOutcome.updatedDueDate
		);

		return response.render('patterns/check-and-confirm-page.pattern.njk', {
			pageContent: mappedPageContent
		});
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing appellant case review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAppellantCase = async (request, response) => {
	renderAppellantCase(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postAppellantCase = async (request, response) => {
	const {
		body: { reviewOutcome },
		errors
	} = request;

	if (errors) {
		return renderAppellantCase(request, response);
	}

	try {
		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(request.apiClient, request.params.appealId)
			.catch((error) => logger.error(error));

		if (
			appealDetails &&
			appealDetails.appellantCaseId !== null &&
			appealDetails.appellantCaseId !== undefined
		) {
			const { appealId, appellantCaseId, appealReference } = appealDetails;

			request.session.appealId = appealId;
			request.session.appellantCaseId = appellantCaseId;
			request.session.appealReference = appealReference;

			if (reviewOutcome === 'valid') {
				await appellantCaseService.setReviewOutcomeForAppellantCase(
					request.apiClient,
					appealId,
					appellantCaseId,
					mapWebReviewOutcomeToApiReviewOutcome('valid')
				);

				return response.redirect(
					`/appeals-service/appeal-details/${appealId}/appellant-case/${reviewOutcome}/confirmation`
				);
			} else {
				return response.redirect(
					`/appeals-service/appeal-details/${appealId}/appellant-case/${reviewOutcome}`
				);
			}
		}

		return response.render('app/404.njk');
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing appellant case review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getCheckAndConfirm = async (request, response) => {
	renderCheckAndConfirm(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postCheckAndConfirm = async (request, response) => {
	try {
		const { appealId, appellantCaseId, webAppellantCaseReviewOutcome } = request.session;

		await appellantCaseService.setReviewOutcomeForAppellantCase(
			request.apiClient,
			appealId,
			appellantCaseId,
			mapWebReviewOutcomeToApiReviewOutcome(
				webAppellantCaseReviewOutcome.validationOutcome,
				webAppellantCaseReviewOutcome.reasons,
				webAppellantCaseReviewOutcome.reasonsText,
				webAppellantCaseReviewOutcome.updatedDueDate
			)
		);

		const validationOutcome = webAppellantCaseReviewOutcome.validationOutcome;

		delete request.session.webAppellantCaseReviewOutcome;

		if (validationOutcome === 'invalid' || validationOutcome === 'incomplete') {
			return response.redirect(
				`/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcome}/confirmation`
			);
		} else {
			return response.render('app/500.njk');
		}
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing appellant case review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getAddDocuments = async (request, response) => {
	renderDocumentUpload(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/`,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/add-document-details/{{folderId}}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getAddDocumentDetails = async (request, response) => {
	renderDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/add-documents/{{folderId}}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postAddDocumentDetails = async (request, response) => {
	postDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/add-documents/{{folderId}}`,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getManageFolder = async (request, response) => {
	renderManageFolder(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/`,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/manage-documents/{{folderId}}/{{documentId}}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getManageDocument = async (request, response) => {
	renderManageDocument(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/manage-documents/{{folderId}}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getAddDocumentsVersion = async (request, response) => {
	renderDocumentUpload(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/manage-documents/${request.params.folderId}/${request.params.documentId}`,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/add-document-details/${request.params.folderId}/${request.params.documentId}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getAddDocumentVersionDetails = async (request, response) => {
	renderDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/add-documents/${request.params.folderId}/${request.params.documentId}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postDocumentVersionDetails = async (request, response) => {
	postDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/add-documents/${request.params.folderId}/${request.params.documentId}`,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/manage-documents/${request.params.folderId}/${request.params.documentId}`
	);
};
/** @type {import('@pins/express').RequestHandler<Response>} */
export const getChangeDocumentVersionDetails = async (request, response) => {
	renderChangeDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/manage-documents/${request.params.folderId}/${request.params.documentId}`
	);
};
/** @type {import('@pins/express').RequestHandler<Response>} */
export const postChangeDocumentVersionDetails = async (request, response) => {
	postChangeDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/manage-documents/${request.params.folderId}/${request.params.documentId}`,
		`/appeals-service/appeal-details/${request.params.appealId}/appellant-case/manage-documents/${request.params.folderId}/${request.params.documentId}`
	);
};
