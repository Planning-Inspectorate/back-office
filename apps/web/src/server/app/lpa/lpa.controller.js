import * as lpaSession from './lpa-session.service.js';
import * as lpaService from './lpa.service.js';

/** @typedef {import('@pins/appeals').Lpa.Appeal} Appeal */
/** @typedef {import('@pins/appeals').Lpa.AppealSummary} AppealSummary */
/** @typedef {import('@pins/appeals').DocumentType} DocumentType */
/** @typedef {import('@pins/appeals').Lpa.Questionnaire} LpaQuestionnaire */
/** @typedef {import('./lpa.router').AppealParams} AppealParams */
/** @typedef {import('./lpa-session.service').QuestionnaireReviewState} QuestionnaireReview */

/**
 * @typedef {object} ViewDashboardRenderOptions
 * @property {AppealSummary[]} appeals
 */

/** @type {import('@pins/express').QueryHandler<{}, ViewDashboardRenderOptions>}  */
export const viewDashboard = async (_, response) => {
	const appeals = await lpaService.findAllAppeals();

	response.render('lpa/dashboard', { appeals });
};

/**
 * View the appeal and its accompanying questionnaire, which, if not yet
 * completed, is available for inputting. If it has been previously been
 * completed, the page displays a summary of the answers.
 *
 * @typedef {object} ViewAppealRenderOptions
 * @property {Appeal} appeal @property {LpaQuestionnaire=} reviewQuestionnaire
 */

/** @type {import('@pins/express').QueryHandler<AppealParams, ViewAppealRenderOptions>}  */
export const viewAppeal = async ({ params, session }, response) => {
	const appeal = await lpaService.findAppealById(params.appealId);

	if (appeal.reviewQuestionnaire) {
		response.render('lpa/questionnaire-incomplete', {
			appeal,
			reviewQuestionnaire: appeal.reviewQuestionnaire
		});
	} else {
		const state = /** @type {QuestionnaireReview} */ (
			lpaSession.getQuestionnaireReview(session, params.appealId)
		);
		response.render('lpa/questionnaire', {
			appeal,
			reviewQuestionnaire: state?.reviewQuestionnaire
		});
	}
};

/** @typedef {LpaQuestionnaire} CreateQuestionnaireReviewBody */

/**
 * Handle a user submitting a questionnaire review.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams,
 * ViewAppealRenderOptions, LpaQuestionnaire>}
 */
export const createQuestionnaireReview = async (
	{ body: reviewQuestionnaire, params, session },
	response
) => {
	const { appealId } = params;
	const appeal = await lpaService.findAppealById(appealId);

	if (response.locals.errors) {
		const tpl = appeal.reviewQuestionnaire
			? 'lpa/questionnaire-incomplete'
			: 'lpa/questionnaire';

		response.render(tpl, { appeal, reviewQuestionnaire });
		return;
	}
	lpaSession.setQuestionnaireReview(session, { appealId, reviewQuestionnaire });

	response.redirect(`/lpa/appeals/${appealId}/questionnaire/confirm`);
};

/**
 * @typedef {object} ViewReviewQuestionnaireConfirmationRenderOptions
 * @property {Appeal} appeal
 * @property {LpaQuestionnaire} reviewQuestionnaire
 */

/**
 * Render the confirmation page for a new or completed questionnaire.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams,
 * ViewReviewQuestionnaireConfirmationRenderOptions>}
 */
export const viewQuestionnaireReviewConfirmation = async ({ params, session }, response) => {
	const appeal = await lpaService.findAppealById(params.appealId);
	const { reviewQuestionnaire } = /** @type {QuestionnaireReview} */ (
		lpaSession.getQuestionnaireReview(session, params.appealId)
	);

	response.render('lpa/questionnaire-confirmation', {
		appeal,
		reviewQuestionnaire
	});
};

/**
 * @typedef {object} ViewReviewQuestionnaireSuccessRenderOptions
 * @property {Appeal} appeal
 */

/**
 * Create a new `reviewQuestionnaire` on the appeal based on the questionnaire
 * answers.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams,
 * ViewReviewQuestionnaireConfirmationRenderOptions | ViewReviewQuestionnaireSuccessRenderOptions>}
 */
export const confirmQuestionnaireReview = async ({ params, session }, response) => {
	const { reviewQuestionnaire } = /** @type {QuestionnaireReview} */ (
		lpaSession.getQuestionnaireReview(session, params.appealId)
	);

	if (response.locals.errors) {
		const appeal = await lpaService.findAppealById(params.appealId);

		response.render('lpa/questionnaire-confirmation', {
			appeal,
			reviewQuestionnaire
		});
	} else {
		const appeal = await lpaService.confirmQuestionnaireReview(
			params.appealId,
			reviewQuestionnaire
		);

		response.render('lpa/questionnaire-success', { appeal });
	}
};

/**
 * @typedef {object} EditListedBuildingRenderOptions
 * @property {Appeal} appeal
 * @property {string} listedBuildingDescription
 */

/** @type {import('@pins/express').QueryHandler<AppealParams, EditListedBuildingRenderOptions>} */
export const editListedBuildingDescription = async ({ params }, response) => {
	const appeal = await lpaService.findAppealById(params.appealId);

	response.render('lpa/edit-listed-building-description', {
		appeal,
		listedBuildingDescription: appeal.ListedBuildingDesc
	});
};

/**
 * @typedef {object} ListedBuildingDescriptionBody
 * @property {string} listedBuildingDescription
 */

/** @type {import('@pins/express').CommandHandler<AppealParams, EditListedBuildingRenderOptions, ListedBuildingDescriptionBody>} */
export const updateListedBuildingDescription = async ({ body, params }, response) => {
	if (response.locals.errors) {
		const appeal = await lpaService.findAppealById(params.appealId);

		response.render('lpa/edit-listed-building-description', {
			appeal,
			listedBuildingDescription: appeal.ListedBuildingDesc
		});
	} else {
		await lpaService.updateAppeal(params.appealId, body);

		response.redirect(`/lpa/appeals/${params.appealId}`);
	}	
};

/**
 * @typedef {object} NewAppealDocumentsParams
 * @property {number} appealId
 * @property {DocumentType} documentType
 */

/**
 * @typedef {object} NewAppealDocumentsRenderOptions
 * @property {Appeal} appeal
 * @property {DocumentType} documentType
 */

/**
 * Load a page allowing the user to upload documents to an incomplete review
 * questionnaire.
 *
 * @type {import('@pins/express').QueryHandler<NewAppealDocumentsParams,
 * NewAppealDocumentsRenderOptions>}
 */
export const newAppealDocuments = async ({ params }, response) => {
	const appeal = await lpaService.findAppealById(params.appealId);

	response.render('lpa/appeal-documents', { appeal, documentType: params.documentType });
};

/**
 * Upload additional documents to an appeal, according to a given `appealId` and
 * `documentType`.
 *
 * @type {import('@pins/express').CommandHandler<NewAppealDocumentsParams,
 * NewAppealDocumentsRenderOptions>}
 */
export const uploadAppealDocuments = async ({ files, params }, response) => {
	if (response.locals.errors) {
		const appeal = await lpaService.findAppealById(params.appealId);

		response.render('lpa/appeal-documents', { appeal, documentType: params.documentType });
	} else {
		await Promise.all(
			/** @type {Express.Multer.File[]} **/ (files).map((file) =>
				lpaService.uploadDocument(params.appealId, {
					documentType: params.documentType,
					file
				})
			)
		);
		response.redirect(`/lpa/appeals/${params.appealId}`);
	}
};
