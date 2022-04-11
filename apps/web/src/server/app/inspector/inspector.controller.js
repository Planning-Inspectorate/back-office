import * as inspectorSession from './inspector-session.service.js';
import * as inspectorService from './inspector.service.js';

/** @typedef {import('@pins/inspector').Appeal} Appeal */
/** @typedef {import('@pins/inspector').AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/inspector').AppealSummary} AppealSummary */
/** @typedef {import('@pins/inspector').SiteVisitType} SiteVisitType */
/** @typedef {import('./inspector-session.service').DecisionState} DecisionState} */
/** @typedef {import('./inspector-session.service').SiteVisitState} SiteVisitState} */

/**
 * @typedef {Object} ViewDashboardRenderOptions
 * @property {AppealSummary[]} appeals - A collection of appeals assigned to the user.
 */

/**
 * View the dashboard listing the inspector's assigned appeals.
 *
 * @type {import('@pins/express').QueryHandler<{}, ViewDashboardRenderOptions>}
 */
export async function viewDashboard(_, response) {
	const appeals = await inspectorService.findAllAssignedAppeals();

	response.render('inspector/dashboard', { appeals });
}

/**
 * @typedef {Object} ViewAvailableAppealsRenderOptions
 * @property {AppealSummary[]} appeals - A collection of appeals available for
 * assignment to the inspector.
 * @property {number[]=} selectedappealIds - An array of appeal ids already
 * selected in the page form.
 */

/**
 * View a list of appeals available for assignment to the inspector.
 *
 * @type {import('@pins/express').QueryHandler<{}, ViewAvailableAppealsRenderOptions>}
 */
export async function viewAvailableAppeals(_, response) {
	const appeals = await inspectorService.findAllUnassignedAppeals();

	response.render('inspector/assign-appeals', { appeals });
}

/**
 * @typedef {Object} AssignAvailableAppealsBody
 * @property {number[]} appealIds - An array of appealIds to be assigned
 */

/**
 * @typedef {Object} AssignAppealsSuccessRenderOptions
 * @property {AppealSummary[]} appeals - The appeals successfully assigned to the user.
 */

/**
 * @type {import('@pins/express').CommandHandler<{}, ViewAvailableAppealsRenderOptions | AssignAppealsSuccessRenderOptions, AssignAvailableAppealsBody>}
 */
export async function assignAvailableAppeals({ body }, response) {
	const appeals = await inspectorService.findAllUnassignedAppeals();

	if (response.locals.errors) {
		response.render('inspector/assign-appeals', {
			appeals,
			selectedappealIds: body.appealIds || []
		});
	} else {
		const assignedAppeals = await inspectorService.assignAppealsToUser(body.appealIds);

		response.render('inspector/assign-appeals-success', { appeals: assignedAppeals });
	}
}

/**
 * @typedef {Object} AppealParams
 * @property {number} appealId – Unique identifier for the appeal.
 */

/**
 * @typedef {Object} ViewAppealDetailsRenderOptions
 * @property {Appeal} appeal – The appeal entity.
 */

/**
 * View an appeal assigned to the user.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, ViewAppealDetailsRenderOptions>}
 */
export async function viewAppealDetails({ params }, response) {
	const appeal = await inspectorService.findAppealById(params.appealId);

	response.render('inspector/appeal-details', { appeal });
}

/**
 * @typedef {Object} NewSiteVisitRenderOptions
 * @property {Appeal} appeal – The appeal entity.
 * @property {string=} siteVisitDate - The date of the site to populate the form.
 * @property {string=} siteVisitTimeSlot – The time of site to populate the form.
 * @property {SiteVisitType} siteVisitType – The type of site to populate the form.
 */

/**
 * Book a site visit by entering the site visit details.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, NewSiteVisitRenderOptions>}
 */
export async function newSiteVisit({ params, session }, response) {
	const appeal = await inspectorService.findAppealById(params.appealId);
	const siteVisitData = inspectorSession.getSiteVisit(session, params.appealId);

	response.render('inspector/book-site-visit', {
		appeal,
		siteVisitType: appeal.provisionalVisitType,
		...siteVisitData
	});
}

/**
 * @typedef {Object} CreateSiteVisitBody
 * @property {string} siteVisitDate - The date of the site to populate the form.
 * @property {string} siteVisitTimeSlot – The time of site visit to populate the form.
 * @property {SiteVisitType} siteVisitType – The type of site visit to populate the form.
 */

/**
 * Book a site visit by entering the site visit details.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, NewSiteVisitRenderOptions, CreateSiteVisitBody>}
 */
export async function createSiteVisit({ body, params, session }, response) {
	if (response.locals.errors) {
		const appeal = await inspectorService.findAppealById(params.appealId);

		response.render('inspector/book-site-visit', { appeal, ...body });
		return;
	}
	inspectorSession.setSiteVisit(session, { appealId: params.appealId, ...body });

	response.redirect(`/inspector/appeals/${params.appealId}/confirm-site-visit`);
}

/**
 * @typedef ViewSiteVisitConfirmationRenderOptions
 * @property {Appeal} appeal – The appeal entity.
 * @property {string} siteVisitDate - The date of the site visit for confirmation.
 * @property {string} siteVisitTimeSlot – The time of site visit for confirmation.
 * @property {SiteVisitType} siteVisitType – The type of site visit for confirmation.
 */

/**
 * Display a confirmation page to the user using the site data from the session.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, ViewSiteVisitConfirmationRenderOptions>}
 */
export async function viewSiteVisitConfirmation({ params, session }, response) {
	const appeal = await inspectorService.findAppealById(params.appealId);
	const siteVisitData = /** @type {SiteVisitState} */ (inspectorSession.getSiteVisit(session, params.appealId));

	response.render('inspector/book-site-visit-confirmation', { appeal, ...siteVisitData });
}

/**
 * @typedef ConfirmSiteVisitSuccessRenderOptions
 * @property {Appeal} appeal – The updated appeal entity.
 */

/**
 * Confirm a site visit using the data in the inspector session.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, ConfirmSiteVisitSuccessRenderOptions>}
 */
export async function confirmSiteVisit({ params, session }, response) {
	const siteVisitData = /** @type {SiteVisitState} */ (inspectorSession.getSiteVisit(session, params.appealId));
	const updatedAppeal = await inspectorService.bookSiteVisit(params.appealId, siteVisitData);

	inspectorSession.destroy(session);

	response.render('inspector/book-site-visit-success', { appeal: updatedAppeal });
}

/**
 * @typedef {Object} NewDecisionRenderOptions
 * @property {Appeal} appeal – The appeal entity.
 * @property {AppealOutcome=} outcome - The outcome of the decision used to populate the form.
 * @property {Express.Multer.File=} decisionLetter - The outcome of the decision used to populate the form.
 */

/**
 * Record a decision on an appeal following a site visit.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, NewDecisionRenderOptions>}
 */
export async function newDecision({ params, session }, response) {
	const appeal = await inspectorService.findAppealById(params.appealId);
	// Note that if the user returns to this page via either the 'Back' link or
	// refreshing the page, then their previously uploaded file will be need to be
	// reselected as there's no way to prepopulate an input[type="file"].
	const decisionData = inspectorSession.getDecision(session, params.appealId);

	response.render('inspector/issue-decision', { appeal, ...decisionData });
}

/**
 * @typedef {Object} CreateDecisionBody
 * @property {AppealOutcome} outcome - The outcome of the decision for confirmation.
 */

/**
 * Book a site visit by entering the site visit details.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, NewDecisionRenderOptions, CreateDecisionBody>}
 */
export async function createDecision({ body, file, params, session }, response) {
	if (response.locals.errors) {
		const appeal = await inspectorService.findAppealById(params.appealId);

		response.render('inspector/issue-decision', {
			appeal,
			outcome: body.outcome,
			decisionLetter: file
		});
		return;
	}
	inspectorSession.setDecision(session, {
		appealId: params.appealId,
		outcome: body.outcome,
		decisionLetter: /** @type {Express.Multer.File} */ (file)
	});

	response.redirect(`/inspector/appeals/${params.appealId}/confirm-decision`);
}

/**
 * @typedef {Object} ViewDecisionConfirmationRenderOptions
 * @property {Appeal} appeal – The appeal entity.
 * @property {AppealOutcome} outcome - The outcome of the decision for
 * confirmation.
 * @property {Express.Multer.File} decisionLetter - File information for the
 * decision letter uploaded to temporary storage.
 */

/**
 * Display a confirmation page to the user using the decision data from the session.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, ViewDecisionConfirmationRenderOptions>}
 */
export async function viewDecisionConfirmation({ params, session }, response) {
	const appeal = await inspectorService.findAppealById(params.appealId);
	const decisionData = /** @type {DecisionState} */ (inspectorSession.getDecision(session, params.appealId));

	response.render('inspector/issue-decision-confirmation', { appeal, ...decisionData });
}

/**
 * Download the decision letter previously uploaded to the session.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams>}
 */
export function downloadDecisionLetter({ params, session }, response) {
	const { decisionLetter } = /** @type {DecisionState} */ (inspectorSession.getDecision(session, params.appealId));

	response.sendFile(decisionLetter.path, {
		headers: {
			'Content-disposition': `attachment; filename="${decisionLetter.originalname}"`
		}
	});
}

/**
 * @typedef ConfirmDecisionSuccessRenderOptions
 * @property {Appeal} appeal – The updated appeal entity.
 */

/**
 * Confirm a site visit using the data in the inspector session.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, ConfirmDecisionSuccessRenderOptions>}
 */
export async function confirmDecision({ params, session }, response) {
	const decisionData = /** @type {DecisionState} */ (inspectorSession.getDecision(session, params.appealId));
	const updatedAppeal = await inspectorService.issueDecision(params.appealId, decisionData);

	inspectorSession.destroy(session);

	response.render('inspector/issue-decision-success', { appeal: updatedAppeal });
}
