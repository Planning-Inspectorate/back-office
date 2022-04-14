import * as validationSession from './validation-session.service.js';
import * as validationService from './validation.service.js';

/** @typedef {import('@pins/validation').Appeal} Appeal */
/** @typedef {import('@pins/validation').AppealDocument} AppealDocument */
/** @typedef {import('@pins/validation').AppealDocumentType} AppealDocumentType */
/** @typedef {import('@pins/validation').AppealOutcomeStatus} AppealOutcomeStatus */

/**
 * @typedef {Object} ViewDashboardRenderOptions
 * @property {Appeal[]} appeals - A collection of new and incomplete appeals.
 */

/**
 * View the new and incomplete appeals awaiting validation.
 *
 * @type {import('@pins/express').QueryHandler<{}, ViewDashboardRenderOptions>}
 */
export async function viewDashboard(_, response) {
	const appeals = await validationService.findAllAppeals();

	response.render('validation/dashboard', { appeals });
}

/**
 * @typedef {Object} AppealParams
 * @property {number} appealId - Unique identifier for the appeal.
 */

/**
 * @typedef {Object} ViewAppealRenderOptions
 * @property {Appeal} appeal - The appeal entity.
 * @property {boolean} canEditReviewOutcomeStatus - A flag to determine whether
 * the outcome options be visible. This applies to 'incomplete' appeals only.
 * @property {AppealOutcomeStatus=} reviewOutcomeStatus - The outcome status
 * with which to populate the outcome form.
 */

/**
 * @typedef {Object} ViewAppealQueryParams
 * @property {string=} edit - A UI flag as to whether the review outcome options
 * have been made visible by the user. This applies only to 'incomplete' appeals
 * where displaying the review outcome options first requires an additional
 * 'Change outcome' action to be performed in the UI.
 */

/**
 * Load the review appeal page used for recording an outcome on a new or
 * incomplete appeal.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, ViewAppealRenderOptions, ViewAppealQueryParams>}
 */
export async function viewAppeal({ query, session, params }, response) {
	const appeal = await validationService.findAppealById(params.appealId);
	const state = validationSession.getReviewOutcome(session, params.appealId);

	response.render('validation/appeal-details', {
		appeal,
		canEditReviewOutcomeStatus: Boolean(query.edit),
		reviewOutcomeStatus: state?.status
	});
}

/**
 * @typedef {Object} AppealOutcomeBody
 * @property {AppealOutcomeStatus} status - the outcome chosen by the user reviewing the appeal
 */

/**
 * Record the outcome for a new or incomplete appeal.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, ViewAppealRenderOptions, AppealOutcomeBody>}
 */
export async function updateAppealOutcome({ body, params, session }, response) {
	if (response.locals.errors) {
		response.render('validation/appeal-details', {
			appeal: await validationService.findAppealById(params.appealId),
			canEditReviewOutcomeStatus: true,
			reviewOutcomeStatus: body.status
		});
		return;
	}

	validationSession.setReviewOutcomeStatus(session, {
		appealId: params.appealId,
		status: body.status
	});

	response.redirect(`/validation/appeals/${params.appealId}/review-outcome`);
}

/**
 * @typedef {Object} EditAppellantNameRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {string} appellantName - The appellant name used to populate the
 * edit form.
 */

/**
 * Load a page allowing the user to edit the appellant name for an appeal.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, EditAppellantNameRenderOptions>}
 */
export async function editAppellantName({ params }, response) {
	const appeal = await validationService.findAppealById(params.appealId);

	response.render('validation/edit-appellant-name', {
		appealId: params.appealId,
		appellantName: appeal.AppellantName
	});
}

/**
 * @typedef {Object} UpdateAppellantNameBody
 * @property {string} AppellantName - The appellant name to save to the appeal.
 */

/**
 * Update the appellant name belonging to a given `appealId`.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, EditAppellantNameRenderOptions, UpdateAppellantNameBody>}
 */
export async function updateAppellantName({ body, params }, response) {
	if (response.locals.errors) {
		response.render('validation/edit-appellant-name', {
			appealId: params.appealId,
			appellantName: body.AppellantName
		});
		return;
	}
	await validationService.updateAppealDetails(params.appealId, body);

	response.redirect(`/validation/appeals/${params.appealId}`);
}

/**
 * @typedef {Object} EditAppealSiteRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {Appeal['AppealSite']} Address - The appeal site used to populate the
 * edit form.
 */

/**
 * Load a page allowing the user to edit the appeal site belonging to an appeal.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, EditAppealSiteRenderOptions>}
 */
export async function editAppealSite({ params }, response) {
	const appeal = await validationService.findAppealById(params.appealId);

	response.render('validation/edit-appeal-site', {
		appealId: appeal.AppealId,
		Address: appeal.AppealSite
	});
}

/**
 * @typedef {object} UpdateAppealSiteBody 
 * @property {Appeal['AppealSite']} Address
*/

/**
 * Update the appeal site belonging to a given `appealId`.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, EditAppealSiteRenderOptions, UpdateAppealSiteBody>}
 */
export async function updateAppealSite({ body, params }, response) {
	if (response.locals.errors) {
		response.render('validation/edit-appeal-site', {
			appealId: params.appealId,
			...body
		});
		return;
	}

	await validationService.updateAppealDetails(params.appealId, body);

	response.redirect(`/validation/appeals/${params.appealId}`);
}

/**
 * @typedef {Object} EditLocalPlanningDeptRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {string} localPlanningDepartment - The local planning department
 * with which to populate the edit form.
 * @property {string[]} source - A collection of local planning
 * department names from which the user will choose the local planning
 * department.
 */

/**
 * Load a page allowing the user to edit the local planning department belonging
 * to an appeal.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, EditLocalPlanningDeptRenderOptions>}
 */
export async function editLocalPlanningDepartment({ params }, response) {
	const [appeal, source] = await Promise.all([validationService.findAppealById(params.appealId), validationService.findAllLocalPlanningDepartments()]);

	response.render('validation/edit-local-planning-department', {
		appealId: appeal.AppealId,
		localPlanningDepartment: appeal.LocalPlanningDepartment,
		source
	});
}

/**
 * @typedef {Object} UpdateLocalPlanningDeptBody
 * @property {string} LocalPlanningDepartment - The local planning department
 * to save to the appeal.
 */

/**
 * Update the local planning department belonging to a given `appealId`.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, EditLocalPlanningDeptRenderOptions, UpdateLocalPlanningDeptBody>}
 */
export async function updateLocalPlanningDepartment({ body, params }, response) {
	if (response.locals.errors) {
		const source = await validationService.findAllLocalPlanningDepartments();

		response.render('validation/edit-local-planning-department', {
			appealId: params.appealId,
			localPlanningDepartment: body.LocalPlanningDepartment,
			source
		});
		return;
	}

	await validationService.updateAppealDetails(params.appealId, body);

	response.redirect(`/validation/appeals/${params.appealId}`);
}

/**
 * @typedef {Object} EditPlanningApplicationRefRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {string} planningApplicationReference - The planning application
 * reference with which to populate the edit form.
 */

/**
 * Load a page allowing the user to edit the planning application reference belonging
 * to a given `appealId`.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, EditPlanningApplicationRefRenderOptions>}
 */
export async function editPlanningApplicationReference({ params }, response) {
	const appeal = await validationService.findAppealById(params.appealId);

	response.render('validation/edit-planning-application-reference', {
		appealId: appeal.AppealId,
		planningApplicationReference: appeal.PlanningApplicationReference
	});
}

/**
 * @typedef {Object} UpdatePlanningApplicationRefBody
 * @property {string} PlanningApplicationReference - The planning application
 * reference to save to the appeal.
 */

/**
 * Update the planning application reference belonging to a given `appealId`.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, EditPlanningApplicationRefRenderOptions, UpdatePlanningApplicationRefBody>}
 */
export async function updatePlanningApplicationReference({ body, params }, response) {
	if (response.locals.errors) {
		response.render('validation/edit-planning-application-reference', {
			appealId: params.appealId,
			planningApplicationReference: body.PlanningApplicationReference
		});
		return;
	}

	await validationService.updateAppealDetails(params.appealId, body);

	response.redirect(`/validation/appeals/${params.appealId}`);
}

/**
 * @typedef {Object} EditDocumentsParams
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {AppealDocumentType} documentType - A dash-cased representation of the document
 * type, (used for compatibility with a url).
 */

/**
 * @typedef {Object} EditDocumentsRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {AppealDocument[]} documents - All documents belonging to the appeal.
 * @property {AppealDocumentType} documentType - The type of document to display in the page.
 */

/**
 * Load a page allowing the user to upload documents to an appeal.
 *
 * @type {import('@pins/express').QueryHandler<EditDocumentsParams, EditDocumentsRenderOptions>}
 */
export async function editDocuments({ params }, response) {
	const appeal = await validationService.findAppealById(params.appealId);

	response.render('validation/edit-documents', {
		appealId: params.appealId,
		documentType: params.documentType,
		documents: appeal.Documents
	});
}

/**
 * Upload additional documents to an appeal, according to a given `appealId` and `documentType`.
 *
 * @type {import('@pins/express').CommandHandler<EditDocumentsParams, EditDocumentsRenderOptions>}
 */
export async function uploadDocuments({ files, params }, response) {
	if (response.locals.errors) {
		const appeal = await validationService.findAppealById(params.appealId);

		response.render('validation/edit-documents', {
			appealId: params.appealId,
			documentType: params.documentType,
			documents: appeal.Documents
		});
		return;
	}

	await Promise.all(
		/** @type {Express.Multer.File[]} **/ (files).map((file) =>
			validationService.uploadDocument(params.appealId, { documentType: params.documentType, file })
		)
	);
	response.redirect(`/validation/appeals/${params.appealId}`);
}

/**
 * @typedef {Object} NewReviewOutcomeRenderOptions
 * @property {Appeal} appeal - The appeal entity.
 * @property {import('./validation.service').OutcomeData} reviewOutcome - The
 * review outcome data with which to populate the page form.
 */

/**
 * Enter further details required as part of the review outcome journey.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, NewReviewOutcomeRenderOptions>}
 */
export async function newReviewOutcome({ params, session }, response) {
	const appeal = await validationService.findAppealById(params.appealId);
	const reviewOutcome = /** @type {import('./validation-session.service').ReviewOutcomeState} */ (
		validationSession.getReviewOutcome(session, params.appealId)
	);

	response.render(`validation/review-outcome-${reviewOutcome.status}`, { appeal, reviewOutcome });
}

/** @typedef {import('./validation.service').OutcomeData} ReviewOutcomeBody */

/**
 * Create the details for the valid appeal outcome journey in the session.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, NewReviewOutcomeRenderOptions, ReviewOutcomeBody>}
 */
export async function createReviewOutcome({ body, params, session }, response) {
	if (response.locals.errors) {
		const appeal = await validationService.findAppealById(params.appealId);

		response.render(`validation/review-outcome-${body.status}`, { appeal, reviewOutcome: body });
		return;
	}
	validationSession.setReviewOutcome(session, { appealId: params.appealId, ...body });

	response.redirect(`/validation/appeals/${params.appealId}/review-outcome/confirm`);
}

/**
 * @typedef {Object} ViewReviewOutcomeConfirmationRenderOptions
 * @property {Appeal} appeal - The appeal entity.
 * @property {import('./validation.service.js').OutcomeData} reviewOutcome - The
 * outcome data for either a valid, invalid or incomplete review.
 */

/**
 * View the check and confirm page for the entered review outcome.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, ViewReviewOutcomeConfirmationRenderOptions>}
 */
export async function viewReviewOutcomeConfirmation({ params, session }, response) {
	const appeal = await validationService.findAppealById(params.appealId);
	const reviewOutcome = /** @type {import('./validation-session.service').ReviewOutcomeState} */ (
		validationSession.getReviewOutcome(session, params.appealId)
	);

	response.render(`validation/review-outcome-${reviewOutcome.status}-confirmation`, {
		appeal,
		reviewOutcome
	});
}

/**
 * @typedef {import('@pins/validation').IncompleteReasons} ConfirmReviewOutcomeBody
 * @property {boolean} confirmation - The checkbox confirming that the user has understood. This only applies to invalid appeals.
 */

/** @typedef {ViewReviewOutcomeConfirmationRenderOptions} ViewReviewOutcomeSuccessRenderOptions */

/**
 * Create the details for the valid appeal outcome journey in the session.
 *
 * @type {import('@pins/express').CommandHandler<
 * 	AppealParams,
 * 	ViewReviewOutcomeConfirmationRenderOptions | ViewReviewOutcomeSuccessRenderOptions,
 *  ConfirmReviewOutcomeBody
 * >}
 */
export async function confirmReviewOutcome({ params, session }, response) {
	const { appealId, ...reviewOutcome } = validationSession.getReviewOutcome(session, params.appealId);
	const appeal = await validationService.findAppealById(appealId);

	if (response.locals.errors) {
		response.render(`validation/review-outcome-${reviewOutcome.status}-confirmation`, {
			appeal,
			reviewOutcome
		});
		return;
	}
	await validationService.recordOutcome(appealId, reviewOutcome);

	validationSession.destroyReviewOutcome(session);

	response.render('validation/review-outcome-success', { appeal, reviewOutcome });
}
