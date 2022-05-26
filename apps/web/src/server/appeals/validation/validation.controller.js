import * as validationService from './validation.service.js';
import * as validationSession from './validation-session.service.js';

/** @typedef {import('@pins/appeals').Validation} Validation */
/** @typedef {import('./validation.locals').AppealLocals} AppealLocals */
/** @typedef {import('./validation.locals').AppealDocumentLocals} AppealDocumentLocals */

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('@pins/appeals').Validation.Appeal} Appeal */
/** @typedef {import('@pins/appeals').Address} Address */
/** @typedef {import('@pins/appeals').Validation.AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('@pins/appeals').Validation.IncompleteReasons} IncompleteReasons */
/** @typedef {import('./validation-session.service').ReviewOutcomeState} ReviewOutcome */
/** @typedef {import('./validation.service').OutcomeData} ReviewOutcomeData */

/**
 * @typedef {object} ViewDashboardRenderProps
 * @property {Appeal[]} appeals
 */

/**
 * View the new and incomplete appeals awaiting validation.
 *
 * @type {import('@pins/express').RenderHandler<ViewDashboardRenderProps>}
 */
export async function viewDashboard(_, response) {
	const appeals = await validationService.findAllAppeals();

	response.render('appeals/validation/dashboard', { appeals });
}

/**
 * @typedef {object} ViewAppealRenderProps
 * @property {Appeal} appeal
 * @property {boolean} canEditReviewOutcomeStatus
 * @property {ValidationErrors=} errors
 * @property {AppealOutcomeStatus=} reviewOutcomeStatus
 */

/**
 * @typedef {object} ViewAppealQuery
 * @property {string=} edit - A UI flag as to whether the review outcome options
 * have been made visible by the user. This applies only to 'incomplete' appeals
 * where displaying the review outcome options first requires an additional
 * 'Change outcome' action to be performed in the UI.
 */

/**
 * Load the review appeal page used for recording an outcome on a new or
 * incomplete appeal.
 *
 * @type {import('@pins/express').RenderHandler<ViewAppealRenderProps, AppealLocals, *, *, ViewAppealQuery>}
 */
export async function viewAppeal({ locals, query, session }, response) {
	const { appeal, appealId } = locals;
	const state = validationSession.getReviewOutcome(session, appealId);

	response.render('appeals/validation/appeal-details', {
		appeal,
		canEditReviewOutcomeStatus: Boolean(query.edit),
		reviewOutcomeStatus: state?.status
	});
}

/**
 * @typedef {object} AppealOutcomeBody
 * @property {AppealOutcomeStatus} status
 */

/**
 * Record the outcome for a new or incomplete appeal.
 *
 * @type {import('@pins/express').RenderHandler<Required<ViewAppealRenderProps>,
 * AppealLocals, AppealOutcomeBody>}
 */
export async function updateAppealOutcome({ baseUrl, body, errors, locals, session }, response) {
	const { appeal, appealId } = locals;

	if (errors) {
		return response.render('appeals/validation/appeal-details', {
			appeal,
			canEditReviewOutcomeStatus: true,
			errors,
			reviewOutcomeStatus: body.status
		});
	}
	validationSession.setReviewOutcomeStatus(session, {
		appealId,
		status: body.status
	});

	response.redirect(`${baseUrl}/appeals/${appealId}/review-outcome`);
}

/**
 * @typedef {object} EditAppellantNameRenderProps
 * @property {number} appealId
 * @property {string} appellantName
 * @property {ValidationErrors=} errors
 */

/**
 * Load a page allowing the user to edit the appellant name for an appeal.
 *
 * @type {import('@pins/express').RenderHandler<EditAppellantNameRenderProps, AppealLocals>}
 */
export async function editAppellantName(req, response) {
	const { appeal } = req.locals;

	response.render('appeals/validation/edit-appellant-name', {
		appealId: appeal.AppealId,
		appellantName: appeal.AppellantName
	});
}

/**
 * @typedef {object} UpdateAppellantNameBody
 * @property {string} AppellantName
 */

/**
 * Update the appellant name belonging to an appeal.
 *
 * @type {import('@pins/express').RenderHandler<Required<EditAppellantNameRenderProps>,
 * AppealLocals, UpdateAppellantNameBody>}
 */
export async function updateAppellantName({ baseUrl, body, errors, locals }, response) {
	if (errors) {
		return response.render('appeals/validation/edit-appellant-name', {
			appealId: locals.appealId,
			appellantName: body.AppellantName,
			errors
		});
	}
	await validationService.updateAppealDetails(locals.appealId, body);

	response.redirect(`${baseUrl}/appeals/${locals.appealId}`);
}

/**
 * @typedef {object} EditAppealSiteRenderProps
 * @property {number} appealId
 * @property {Appeal['AppealSite']} appealSite
 * @property {ValidationErrors=} errors
 */

/**
 * Load a page allowing the user to edit the appeal site belonging to an appeal.
 *
 * @type {import('@pins/express').RenderHandler<EditAppealSiteRenderProps, AppealLocals>}
 */
export async function editAppealSite(req, res) {
	const { AppealId, AppealSite } = req.locals.appeal;

	res.render('appeals/validation/edit-appeal-site', {
		appealId: AppealId,
		appealSite: AppealSite
	});
}

/** @typedef {Address} UpdateAppealSiteBody */

/**
 * Update the appeal site belonging to an appeal.
 *
 * @type {import('@pins/express').RenderHandler<Required<EditAppealSiteRenderProps>,
 * AppealLocals, UpdateAppealSiteBody>}
 */
export async function updateAppealSite({ baseUrl, body, errors, locals }, response) {
	if (errors) {
		return response.render('appeals/validation/edit-appeal-site', {
			appealId: locals.appealId,
			appealSite: body,
			errors
		});
	}
	await validationService.updateAppealDetails(locals.appealId, { Address: body });

	response.redirect(`${baseUrl}/appeals/${locals.appealId}`);
}

/**
 * @typedef {object} EditLocalPlanningDeptRenderProps
 * @property {number} appealId
 * @property {ValidationErrors=} errors
 * @property {string} localPlanningDepartment
 * @property {string[]} source
 */

/**
 * Load a page allowing the user to edit the local planning department belonging
 * to an appeal.
 *
 * @type {import('@pins/express').RenderHandler<EditLocalPlanningDeptRenderProps,
 * AppealLocals>}
 */
export async function editLocalPlanningDepartment(req, res) {
	const { appeal } = req.locals;
	const source = await validationService.findAllLocalPlanningDepartments();

	res.render('appeals/validation/edit-local-planning-department', {
		appealId: appeal.AppealId,
		localPlanningDepartment: appeal.LocalPlanningDepartment,
		source
	});
}

/**
 * @typedef {object} UpdateLocalPlanningDeptBody
 * @property {string} LocalPlanningDepartment
 */

/**
 * Update the local planning department belonging to a given `appealId`.
 *
 * @type {import('@pins/express').RenderHandler<Required<EditLocalPlanningDeptRenderProps>,
 * AppealLocals, *, UpdateLocalPlanningDeptBody>}
 */
export async function updateLocalPlanningDepartment({ baseUrl, body, errors, locals }, response) {
	const { appealId } = locals;

	if (errors) {
		const source = await validationService.findAllLocalPlanningDepartments();

		return response.render('appeals/validation/edit-local-planning-department', {
			appealId,
			errors,
			localPlanningDepartment: body.LocalPlanningDepartment,
			source
		});
	}

	await validationService.updateAppealDetails(appealId, body);

	response.redirect(`${baseUrl}/appeals/${appealId}`);
}

/**
 * @typedef {object} EditPlanningApplicationRefRenderProps
 * @property {number} appealId
 * @property {ValidationErrors=} errors
 * @property {string} planningApplicationReference
 */

/**
 * Load a page allowing the user to edit the planning application reference
 * belonging to a given `appealId`.
 *
 * @type {import('@pins/express').RenderHandler<EditPlanningApplicationRefRenderProps,
 * AppealLocals>}
 */
export async function editPlanningApplicationReference({ locals }, response) {
	response.render('appeals/validation/edit-planning-application-reference', {
		appealId: locals.appeal.AppealId,
		planningApplicationReference: locals.appeal.PlanningApplicationReference
	});
}

/**
 * @typedef {object} UpdatePlanningApplicationRefBody
 * @property {string} PlanningApplicationReference
 */

/**
 * Update the planning application reference belonging to a given `appealId`.
 *
 * @type {import('@pins/express').RenderHandler<Required<EditPlanningApplicationRefRenderProps>,
 * AppealLocals, UpdatePlanningApplicationRefBody>}
 */
export async function updatePlanningApplicationReference(
	{ baseUrl, body, errors, locals },
	response
) {
	const { appealId } = locals;

	if (errors) {
		return response.render('appeals/validation/edit-planning-application-reference', {
			appealId,
			errors,
			planningApplicationReference: body.PlanningApplicationReference
		});
	}

	await validationService.updateAppealDetails(appealId, body);

	response.redirect(`${baseUrl}/appeals/${appealId}`);
}

/**
 * @typedef {object} EditDocumentsRenderProps
 * @property {number} appealId
 * @property {import('@pins/appeals').Validation.AppealDocument[]} documents
 * @property {import('@pins/appeals').Validation.AppealDocumentType} documentType
 * @property {ValidationErrors=} errors
 */

/**
 * Load a page allowing the user to upload documents to an appeal.
 *
 * @type {import('@pins/express').RenderHandler<EditDocumentsRenderProps,
 * AppealLocals & AppealDocumentLocals>}
 */
export async function editDocuments({ locals }, response) {
	const { appeal, appealId, documentType } = locals;

	response.render('appeals/validation/appeal-documents', {
		appealId,
		documentType,
		documents: appeal.Documents
	});
}

/**
 * @typedef {object} UploadDocumentsBody
 * @property {import('@pins/express').MulterFile[]} files
 */

/**
 * Upload additional documents to an appeal, according to a given `appealId` and
 * `documentType`.
 *
 * @type {import('@pins/express').RenderHandler<Required<EditDocumentsRenderProps>,
 * AppealLocals & AppealDocumentLocals, UploadDocumentsBody>}
 */
export async function uploadDocuments({ baseUrl, body, errors, locals }, response) {
	const { appeal, appealId, documentType } = locals;

	if (errors) {
		return response.render('appeals/validation/appeal-documents', {
			appealId,
			documentType,
			documents: appeal.Documents,
			errors
		});
	}

	await Promise.all(
		body.files.map((file) => validationService.uploadDocument(appealId, { documentType, file }))
	);
	response.redirect(`${baseUrl}/appeals/${appealId}`);
}

/**
 * @typedef {object} NewReviewOutcomeRenderProps
 * @property {Appeal} appeal
 * @property {ValidationErrors=} errors
 * @property {ReviewOutcomeData} reviewOutcome
 */

/**
 * Enter further details required as part of the review outcome journey.
 *
 * @type {import('@pins/express').RenderHandler<NewReviewOutcomeRenderProps, AppealLocals>}
 */
export async function newReviewOutcome({ locals, session }, response) {
	const { appealId, appeal } = locals;
	const reviewOutcome = /** @type {import('./validation-session.service').ReviewOutcomeState} */ (
		validationSession.getReviewOutcome(session, appealId)
	);

	response.render(`appeals/validation/outcome-${reviewOutcome.status}`, {
		appeal,
		reviewOutcome
	});
}

/** @typedef {import('./validation.service').OutcomeData} ReviewOutcomeBody */

/**
 * Create the details for the valid appeal outcome journey in the session and
 * advance to the confirmation stage of the review outcome journey.
 *
 * @type {import('@pins/express').RenderHandler<Required<NewReviewOutcomeRenderProps>, AppealLocals,
 * ReviewOutcomeBody>}
 */
export async function createReviewOutcome({ baseUrl, body, errors, locals, session }, response) {
	const { appeal, appealId } = locals;

	if (errors) {
		return response.render(`appeals/validation/outcome-${body.status}`, {
			appeal,
			errors,
			reviewOutcome: body
		});
	}
	validationSession.setReviewOutcome(session, { appealId, ...body });

	response.redirect(`${baseUrl}/appeals/${appealId}/review-outcome/confirm`);
}

/**
 * @typedef {object} ViewReviewOutcomeConfirmationRenderProps
 * @property {Appeal} appeal
 * @property {ValidationErrors=} errors
 * @property {import('./validation.service.js').OutcomeData} reviewOutcome
 */

/**
 * View the check and confirm page for the entered review outcome.
 *
 * @type {import('@pins/express').RenderHandler<ViewReviewOutcomeConfirmationRenderProps,
 * AppealLocals>}
 */
export async function viewReviewOutcomeConfirmation({ locals, session }, response) {
	const { appeal, appealId } = locals;
	const reviewOutcome = /** @type {import('./validation-session.service').ReviewOutcomeState} */ (
		validationSession.getReviewOutcome(session, appealId)
	);

	response.render(`appeals/validation/outcome-${reviewOutcome.status}-confirmation`, {
		appeal,
		reviewOutcome
	});
}

/**
 * @typedef {IncompleteReasons} ConfirmReviewOutcomeBody
 * @property {boolean} confirmation
 */

/** @typedef {ViewReviewOutcomeConfirmationRenderProps} ViewReviewOutcomeSuccessRenderProps */

/**
 * Create the details for the valid appeal outcome journey in the session.
 *
 * @type {import('@pins/express').RenderHandler<Required<ViewReviewOutcomeConfirmationRenderProps>
 * | ViewReviewOutcomeSuccessRenderProps, AppealLocals, ConfirmReviewOutcomeBody>}
 */
export async function confirmReviewOutcome({ errors, locals, session }, response) {
	const { appeal, appealId } = locals;
	const reviewOutcome = /** @type {ReviewOutcome} */ (
		validationSession.getReviewOutcome(session, appealId)
	);

	if (errors) {
		return response.render(`appeals/validation/outcome-${reviewOutcome.status}-confirmation`, {
			appeal,
			errors,
			reviewOutcome
		});
	}
	await validationService.recordOutcome(appealId, reviewOutcome);

	validationSession.destroyReviewOutcome(session);

	response.render('appeals/validation/outcome-success', { appeal, reviewOutcome });
}
