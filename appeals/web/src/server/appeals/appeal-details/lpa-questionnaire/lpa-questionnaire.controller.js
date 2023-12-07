import * as lpaQuestionnaireService from './lpa-questionnaire.service.js';
import {
	lpaQuestionnairePage,
	checkAndConfirmPage,
	mapWebValidationOutcomeToApiValidationOutcome
} from './lpa-questionnaire.mapper.js';
import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import { objectContainsAllKeys } from '#lib/object-utilities.js';
import {
	renderDocumentUpload,
	renderDocumentDetails,
	postDocumentDetails,
	renderManageFolder,
	renderManageDocument,
	renderDeleteDocument,
	renderChangeDocumentDetails,
	postChangeDocumentDetails,
	postDocumentDelete
} from '../../appeal-documents/appeal-documents.controller.js';

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import("@pins/express/types/express.js").ValidationErrors | string | null} errors
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderLpaQuestionnaire = async (request, response, errors = null) => {
	const [lpaQuestionnaire, appealDetails] = await Promise.all([
		lpaQuestionnaireService.getLpaQuestionnaireFromId(
			request.apiClient,
			request.params.appealId,
			request.params.lpaQuestionnaireId
		),
		appealDetailsService.getAppealDetailsFromId(request.apiClient, request.params.appealId)
	]);

	if (!lpaQuestionnaire || !appealDetails) {
		return response.render('app/404.njk');
	}

	const session = request.session;

	if (lpaQuestionnaire && appealDetails) {
		const mappedPageContent = await lpaQuestionnairePage(
			lpaQuestionnaire,
			appealDetails,
			request.originalUrl,
			session
		);

		return response.render('patterns/display-page.pattern.njk', {
			pageContent: mappedPageContent,
			errors
		});
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getLpaQuestionnaire = async (request, response) => {
	renderLpaQuestionnaire(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postLpaQuestionnaire = async (request, response) => {
	const {
		params: { appealId, lpaQuestionnaireId },
		body,
		errors,
		apiClient
	} = request;

	if (errors) {
		return renderLpaQuestionnaire(request, response, errors);
	}

	try {
		const reviewOutcome = body['review-outcome'];
		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(apiClient, request.params.appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			const { appealReference } = appealDetails;

			request.session.appealId = appealId;
			request.session.appealReference = appealReference;

			if (reviewOutcome === 'complete') {
				await lpaQuestionnaireService.setReviewOutcomeForLpaQuestionnaire(
					apiClient,
					appealId,
					lpaQuestionnaireId,
					mapWebValidationOutcomeToApiValidationOutcome('complete')
				);
				return response.redirect(
					`/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/confirmation`
				);
			} else if (reviewOutcome === 'incomplete') {
				request.session.lpaQuestionnaireId = lpaQuestionnaireId;

				return response.redirect(
					`/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete`
				);
			}
		} else {
			return response.render('app/500.njk');
		}
	} catch (error) {
		let errorMessage = 'Something went wrong when completing lpa questionnaire review';
		if (error instanceof Error) {
			errorMessage += `: ${error.message}`;
		}

		logger.error(error, errorMessage);

		return renderLpaQuestionnaire(request, response, errorMessage);
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const renderLpaQuestionnaireReviewCompletePage = async (request, response) => {
	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;

	return response.render('appeals/confirmation.njk', {
		panel: {
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			},
			title: 'LPA questionnaire complete'
		},
		body: {
			preHeading: 'The review of LPA questionnaire is finished.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: "We've sent an email to the LPA to confirm their questionnaire is complete and the the review is finished."
				},
				{
					href: `/appeals-service/appeal-details/${appealId}`,
					text: 'Go back to case details'
				}
			]
		}
	});
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
				'lpaQuestionnaireId',
				'webLPAQuestionnaireReviewOutcome'
			])
		) {
			return response.render('app/500.njk');
		}

		const { appealId, appealReference, lpaQuestionnaireId, webLPAQuestionnaireReviewOutcome } =
			request.session;

		const reasonOptions = await lpaQuestionnaireService.getLPAQuestionnaireIncompleteReasonOptions(
			request.apiClient
		);
		if (!reasonOptions) {
			throw new Error('error retrieving invalid reason options');
		}

		const mappedPageContent = checkAndConfirmPage(
			appealId,
			appealReference,
			lpaQuestionnaireId,
			reasonOptions,
			'incomplete',
			request.session,
			webLPAQuestionnaireReviewOutcome.reasons,
			webLPAQuestionnaireReviewOutcome.reasonsText,
			webLPAQuestionnaireReviewOutcome.updatedDueDate
		);

		return response.render('patterns/check-and-confirm-page.pattern.njk', {
			pageContent: mappedPageContent
		});
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing lpa questionnaire review'
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
		if (
			!objectContainsAllKeys(request.session, [
				'appealId',
				'lpaQuestionnaireId',
				'webLPAQuestionnaireReviewOutcome'
			])
		) {
			return response.render('app/500.njk');
		}

		const { appealId, lpaQuestionnaireId, webLPAQuestionnaireReviewOutcome } = request.session;

		await lpaQuestionnaireService.setReviewOutcomeForLpaQuestionnaire(
			request.apiClient,
			appealId,
			lpaQuestionnaireId,
			mapWebValidationOutcomeToApiValidationOutcome(
				'incomplete',
				webLPAQuestionnaireReviewOutcome.reasons,
				webLPAQuestionnaireReviewOutcome.reasonsText,
				webLPAQuestionnaireReviewOutcome.updatedDueDate
			)
		);

		if (webLPAQuestionnaireReviewOutcome.updatedDueDate) {
			request.session.lpaQuestionnaireUpdatedDueDate =
				webLPAQuestionnaireReviewOutcome.updatedDueDate;
		}

		delete request.session.webLPAQuestionnaireReviewOutcome;

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete/confirmation`
		);
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing lpa questionnaire review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getConfirmation = async (request, response) => {
	renderLpaQuestionnaireReviewCompletePage(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getAddDocuments = async (request, response) => {
	renderDocumentUpload(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/add-document-details/{{folderId}}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getAddDocumentDetails = async (request, response) => {
	renderDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/add-documents/{{folderId}}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postAddDocumentDetails = async (request, response) => {
	postDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/add-documents/{{folderId}}`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getManageFolder = async (request, response) => {
	renderManageFolder(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/manage-documents/{{folderId}}/{{documentId}}/latest`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getManageDocument = async (request, response) => {
	renderManageDocument(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/manage-documents/{{folderId}}`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/add-documents/{{folderId}}/{{documentId}}`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/manage-documents/{{folderId}}/{{documentId}}/{{versionId}}/delete`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getAddDocumentsVersion = async (request, response) => {
	renderDocumentUpload(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/manage-documents/${request.params.folderId}/${request.params.documentId}`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/add-document-details/${request.params.folderId}/${request.params.documentId}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getAddDocumentVersionDetails = async (request, response) => {
	renderDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/add-documents/${request.params.folderId}/${request.params.documentId}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getChangeDocumentVersionDetails = async (request, response) => {
	renderChangeDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/manage-documents/${request.params.folderId}/${request.params.documentId}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postDocumentVersionDetails = async (request, response) => {
	postDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/add-documents/${request.params.folderId}/${request.params.documentId}`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}`
	);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postChangeDocumentVersionDetails = async (request, response) => {
	postChangeDocumentDetails(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/manage-documents/${request.params.folderId}/${request.params.documentId}`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/manage-documents/${request.params.folderId}/${request.params.documentId}`
	);
};
/** @type {import('@pins/express').RequestHandler<Response>} */
export const getDeleteDocument = async (request, response) => {
	renderDeleteDocument(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/manage-documents/{{folderId}}`
	);
};
/** @type {import('@pins/express').RequestHandler<Response>} */
export const postDeleteDocument = async (request, response) => {
	postDocumentDelete(
		request,
		response,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}`,
		`/appeals-service/appeal-details/${request.params.appealId}/lpa-questionnaire/${request.params.lpaQuestionnaireId}/add-documents/{{folderId}}`
	);
};
