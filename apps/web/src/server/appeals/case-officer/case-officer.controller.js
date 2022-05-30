import * as caseOfficerService from './case-officer.service.js';
import * as caseOfficerSession from './case-officer-session.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('@pins/appeals').CaseOfficer.Appeal} Appeal */
/** @typedef {import('@pins/appeals').CaseOfficer.AppealSummary} AppealSummary */
/** @typedef {import('@pins/appeals').DocumentType} DocumentType */
/** @typedef {import('@pins/appeals').CaseOfficer.Questionnaire} CaseOfficerQuestionnaire */
/** @typedef {import('./case-officer.locals').AppealLocals} AppealLocals */
/** @typedef {import('./case-officer.locals').AppealDocumentLocals} AppealDocumentLocals */
/** @typedef {import('./case-officer-session.service').QuestionnaireReviewState} QuestionnaireReview */

/**
 * @typedef {object} ViewDashboardRenderOptions
 * @property {AppealSummary[]} appeals
 */

/** @type {import('@pins/express').RenderHandler<ViewDashboardRenderOptions>}  */
export const viewDashboard = async (_, response) => {
	const appeals = await caseOfficerService.findAllAppeals();

	response.render('appeals/case-officer/dashboard', { appeals });
};

/**
 * View the appeal and its accompanying questionnaire, which, if not yet
 * completed, is available for inputting. If it has been previously been
 * completed, the page displays a summary of the answers.
 *
 * @typedef {object} ViewAppealRenderOptions
 * @property {Appeal} appeal
 * @property {ValidationErrors=} errors
 * @property {CaseOfficerQuestionnaire=} reviewQuestionnaire
 */

/** @type {import('@pins/express').RenderHandler<ViewAppealRenderOptions, AppealLocals>}  */
export const viewAppeal = async ({ locals, session }, response) => {
	const { appeal, appealId } = locals;

	if (appeal.reviewQuestionnaire) {
		response.render('appeals/case-officer/questionnaire-incomplete', {
			appeal,
			reviewQuestionnaire: appeal.reviewQuestionnaire
		});
	} else {
		const state = /** @type {QuestionnaireReview} */ (
			caseOfficerSession.getQuestionnaireReview(session, appealId)
		);

		response.render('appeals/case-officer/questionnaire', {
			appeal,
			reviewQuestionnaire: state?.reviewQuestionnaire
		});
	}
};

/** @typedef {CaseOfficerQuestionnaire} CreateQuestionnaireReviewBody */

/**
 * Handle a user submitting a questionnaire review.
 *
 * @type {import('@pins/express').RenderHandler<ViewAppealRenderOptions, AppealLocals,
 * CaseOfficerQuestionnaire>}
 */
export const createQuestionnaireReview = async (
	{ baseUrl, body: reviewQuestionnaire, errors, locals, session },
	response
) => {
	const { appeal, appealId } = locals;

	if (errors) {
		const tpl = appeal.reviewQuestionnaire
			? 'appeals/case-officer/questionnaire-incomplete'
			: 'appeals/case-officer/questionnaire';

		return response.render(tpl, { appeal, errors, reviewQuestionnaire });
	}
	caseOfficerSession.setQuestionnaireReview(session, { appealId, reviewQuestionnaire });

	response.redirect(`${baseUrl}/appeals/${appealId}/questionnaire/confirm`);
};

/**
 * @typedef {object} ViewReviewQuestionnaireConfirmationRenderOptions
 * @property {Appeal} appeal
 * @property {ValidationErrors=} errors
 * @property {CaseOfficerQuestionnaire} reviewQuestionnaire
 */

/**
 * Render the confirmation page for a new or completed questionnaire.
 *
 * @type {import('@pins/express').RenderHandler<ViewReviewQuestionnaireConfirmationRenderOptions,
 * AppealLocals>}
 */
export const viewQuestionnaireReviewConfirmation = async ({ locals, session }, response) => {
	const { appeal, appealId } = locals;
	const { reviewQuestionnaire } = /** @type {QuestionnaireReview} */ (
		caseOfficerSession.getQuestionnaireReview(session, appealId)
	);

	response.render('appeals/case-officer/questionnaire-confirmation', {
		appeal,
		reviewQuestionnaire
	});
};

/**
 * @typedef {object} ViewReviewQuestionnaireSuccessRenderOptions
 * @property {Appeal} appeal
 * @property {boolean} complete
 */

/**
 * Create a new `reviewQuestionnaire` on the appeal based on the questionnaire
 * answers.
 *
 * @type {import('@pins/express').RenderHandler<Required<ViewReviewQuestionnaireConfirmationRenderOptions>
 * | ViewReviewQuestionnaireSuccessRenderOptions, AppealLocals>}
 */
export const confirmQuestionnaireReview = async ({ errors, locals, session }, response) => {
	const { appeal, appealId } = locals;
	const { reviewQuestionnaire } = /** @type {QuestionnaireReview} */ (
		caseOfficerSession.getQuestionnaireReview(session, appealId)
	);

	if (errors) {
		return response.render('appeals/case-officer/questionnaire-confirmation', {
			appeal,
			errors,
			reviewQuestionnaire
		});
	}
	await caseOfficerService.confirmQuestionnaireReview(appealId, reviewQuestionnaire);

	response.render('appeals/case-officer/questionnaire-success', {
		appeal,
		complete: Object.keys(reviewQuestionnaire).length === 0
	});
};

/**
 * @typedef {object} EditListedBuildingRenderOptions
 * @property {Appeal} appeal
 * @property {ValidationErrors=} errors
 * @property {string} listedBuildingDescription
 */

/** @type {import('@pins/express').RenderHandler<EditListedBuildingRenderOptions, AppealLocals>} */
export const editListedBuildingDescription = async ({ locals }, response) => {
	const { appeal } = locals;

	response.render('appeals/case-officer/edit-listed-building-description', {
		appeal,
		listedBuildingDescription: appeal.ListedBuildingDesc
	});
};

/**
 * @typedef {object} ListedBuildingDescriptionBody
 * @property {string} listedBuildingDescription
 */

/**
 * Update the listed building description when a questionnaire is incomplete.
 *
 * @type {import('@pins/express').RenderHandler<Required<EditListedBuildingRenderOptions>,
 * AppealLocals, ListedBuildingDescriptionBody>}
 */
export const updateListedBuildingDescription = async (
	{ baseUrl, body, errors, locals },
	response
) => {
	const { appeal, appealId } = locals;

	if (errors) {
		return response.render('appeals/case-officer/edit-listed-building-description', {
			appeal,
			errors,
			listedBuildingDescription: appeal.ListedBuildingDesc
		});
	}
	await caseOfficerService.updateAppeal(appealId, body);

	response.redirect(`${baseUrl}/appeals/${appealId}`);
};

/**
 * @typedef {object} NewAppealDocumentsRenderOptions
 * @property {Appeal} appeal
 * @property {ValidationErrors=} errors
 * @property {DocumentType} documentType
 */

/**
 * Load a page allowing the user to upload documents to an incomplete review
 * questionnaire.
 *
 * @type {import('@pins/express').RenderHandler<NewAppealDocumentsRenderOptions,
 * AppealLocals & AppealDocumentLocals>}
 */
export const newAppealDocuments = async ({ locals }, response) => {
	const { appeal, documentType } = locals;

	response.render('appeals/case-officer/appeal-documents', { appeal, documentType });
};

/**
 * @typedef {object} NewAppealDocumentsBody
 * @property {import('@pins/express').MulterFile[]} files
 */

/**
 * Upload additional documents to an appeal, according to a given `appealId` and
 * `documentType`.
 *
 * @type {import('@pins/express').RenderHandler<Required<NewAppealDocumentsRenderOptions>,
 * AppealLocals & AppealDocumentLocals, NewAppealDocumentsBody>}
 */
export const uploadAppealDocuments = async ({ baseUrl, errors, body, locals }, response) => {
	const { appeal, appealId, documentType } = locals;

	if (errors) {
		return response.render('appeals/case-officer/appeal-documents', {
			appeal,
			documentType,
			errors
		});
	}
	await caseOfficerService.uploadDocuments(appealId, {
		documentType,
		files: body.files
	});
	response.redirect(`${baseUrl}/appeals/${appealId}`);
};

/**
 * @typedef {object} NewFpaDocumentsRenderOptions
 * @property {Appeal} appeal - The three definitions here are because
 * the reponse body from uploading these documents is a partial appeal
 * sufficient enough for rendering this page. Ultimately these response bodies
 * should align with the originally queried bodies (we can dream).
 * @property {'fpa final comment' | 'fpa statement'} documentType
 * @property {ValidationErrors=} errors
 */

/**
 * @typedef {object} NewFpaDocumentsSuccessRenderOptions
 * @property {import('./case-officer.service').UploadFpaStatementsResponseBody} appeal
 * @property {'fpa final comment' | 'fpa statement'} documentType
 */

/**
 * Load a page allowing the user to upload final comments to a full planning
 * appeal.
 *
 * @type {import('@pins/express').RenderHandler<NewFpaDocumentsRenderOptions, AppealLocals>}
 */
export const newFinalComments = async ({ locals }, response) => {
	response.render('appeals/case-officer/fpa-documents', {
		appeal: locals.appeal,
		documentType: 'fpa final comment'
	});
};

/**
 * @typedef {object} NewFpaDocumentsBody
 * @property {import('@pins/express').MulterFile[]} files
 */

/**
 * Upload final comments as part of a full planning appeal.
 *
 * @type {import('@pins/express').RenderHandler<Required<NewFpaDocumentsRenderOptions>
 * | NewFpaDocumentsSuccessRenderOptions, AppealLocals, NewFpaDocumentsBody>}
 */
export const uploadFinalComments = async ({ body, errors, locals }, response) => {
	const { appeal, appealId } = locals;

	if (errors) {
		return response.render('appeals/case-officer/fpa-documents', {
			appeal,
			documentType: 'fpa final comment',
			errors
		});
	}

	const updatedAppeal = await caseOfficerService.uploadFinalComments(appealId, body.files);

	response.render('appeals/case-officer/fpa-documents-success', {
		appeal: updatedAppeal,
		documentType: 'fpa final comment'
	});
};

/**
 * Load a page allowing the user to upload statements to a full planning
 * appeal.
 *
 * @type {import('@pins/express').RenderHandler<NewFpaDocumentsRenderOptions, AppealLocals>}
 */
export const newStatements = async ({ locals }, response) => {
	response.render('appeals/case-officer/fpa-documents', {
		appeal: locals.appeal,
		documentType: 'fpa statement'
	});
};

/**
 * Upload final comments as part of a full planning appeal.
 *
 * @type {import('@pins/express').RenderHandler<Required<NewFpaDocumentsRenderOptions>
 * | NewFpaDocumentsSuccessRenderOptions, AppealLocals, NewFpaDocumentsBody>}
 */
export const uploadStatements = async ({ body, errors, locals }, response) => {
	const { appeal, appealId } = locals;

	if (errors) {
		return response.render('appeals/case-officer/fpa-documents', {
			appeal,
			errors,
			documentType: 'fpa statement'
		});
	}

	const updatedAppeal = await caseOfficerService.uploadStatements(appealId, body.files);

	response.render('appeals/case-officer/fpa-documents-success', {
		appeal: updatedAppeal,
		documentType: 'fpa statement'
	});
};
