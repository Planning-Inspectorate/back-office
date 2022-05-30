import * as inspectorService from './inspector.service.js';
import * as inspectorSession from './inspector-session.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./inspector.locals').AppealLocals} AppealLocals */

/** @typedef {import('@pins/appeals').Inspector.Appeal} Appeal */
/** @typedef {import('@pins/appeals').Inspector.AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/appeals').Inspector.AppealSummary} AppealSummary */
/** @typedef {import('@pins/appeals').Inspector.SiteVisitType} SiteVisitType */
/** @typedef {import('./inspector-session.service').DecisionState} DecisionState */
/** @typedef {import('./inspector-session.service').SiteVisitState} SiteVisitState */

/**
 * @typedef {object} ViewDashboardRenderProps
 * @property {AppealSummary[]} appeals
 * @property {number[]} assignedAppealIds - A list of appeal ids assigned to the
 * user during this session. These will be used for denoting the 'New' status on
 * the dashboard.
 */

/**
 * View the dashboard listing the inspector's assigned appeals.
 *
 * @type {import('@pins/express').RenderHandler<ViewDashboardRenderProps>}
 */
export async function viewDashboard({ session }, response) {
	const appeals = await inspectorService.findAllAssignedAppeals();
	const assignedAppealIds = inspectorSession.getAssignedAppealIds(session);

	response.render('appeals/inspector/dashboard', { appeals, assignedAppealIds });
}

/**
 * @typedef {object} ViewAvailableAppealsRenderProps
 * @property {AppealSummary[]} appeals
 * @property {ValidationErrors=} errors
 * @property {number[]=} selectedappealIds
 */

/**
 * View a list of appeals available for assignment to the inspector.
 *
 * @type {import('@pins/express').RenderHandler<ViewAvailableAppealsRenderProps>}
 */
export async function viewAvailableAppeals(_, response) {
	const appeals = await inspectorService.findAllUnassignedAppeals();

	response.render('appeals/inspector/assign-appeals', { appeals });
}

/**
 * @typedef {object} AssignAvailableAppealsBody
 * @property {number[]} appealIds
 */

/**
 * @typedef {object} AssignAppealsSuccessRenderProps
 * @property {AppealSummary[]} appeals
 */

/**
 * @type {import('@pins/express').RenderHandler<Required<ViewAvailableAppealsRenderProps> |
 * AssignAppealsSuccessRenderProps, {}, AssignAvailableAppealsBody>}
 */
export async function assignAvailableAppeals({ body, errors, session }, response) {
	if (errors) {
		const appeals = await inspectorService.findAllUnassignedAppeals();

		return response.render('appeals/inspector/assign-appeals', {
			appeals,
			errors,
			selectedappealIds: body.appealIds || []
		});
	}

	const { successfullyAssigned, unsuccessfullyAssigned } =
		await inspectorService.assignAppealsToUser(body.appealIds);

	if (unsuccessfullyAssigned.length === 0) {
		// Save a copy of the assigned appeals so as to capture the 'New' status on the dashboard
		inspectorSession.addAssignedAppealIds(session, body.appealIds);

		response.render('appeals/inspector/assign-appeals-success', { appeals: successfullyAssigned });
	} else {
		response.render('appeals/inspector/assign-appeals-error', { appeals: unsuccessfullyAssigned });
	}
}

/**
 * @typedef {object} ViewAppealDetailsRenderProps
 * @property {Appeal} appeal
 */

/**
 * View an appeal assigned to the user.
 *
 * @type {import('@pins/express').RenderHandler<ViewAppealDetailsRenderProps, AppealLocals>}
 */
export async function viewAppealDetails({ locals }, response) {
	response.render('appeals/inspector/appeal-details', { appeal: locals.appeal });
}

/**
 * @typedef {object} NewSiteVisitRenderProps
 * @property {Appeal} appeal
 * @property {ValidationErrors=} errors
 * @property {string=} siteVisitDate
 * @property {string=} siteVisitTimeSlot
 * @property {SiteVisitType} siteVisitType
 */

/**
 * Book a site visit by entering the site visit details.
 *
 * @type {import('@pins/express').RenderHandler<NewSiteVisitRenderProps, AppealLocals>}
 */
export async function newSiteVisit({ locals, session }, response) {
	const { appeal, appealId } = locals;
	const siteVisitData = inspectorSession.getSiteVisit(session, appealId);

	response.render('appeals/inspector/book-site-visit', {
		appeal,
		siteVisitType: appeal.provisionalSiteVisitType,
		...siteVisitData
	});
}

/**
 * @typedef {object} CreateSiteVisitBody
 * @property {string} siteVisitDate
 * @property {string} siteVisitTimeSlot
 * @property {SiteVisitType} siteVisitType
 */

/**
 * Book a site visit by entering the site visit details.
 *
 * @type {import('@pins/express').RenderHandler<NewSiteVisitRenderProps, AppealLocals, CreateSiteVisitBody>}
 */
export async function createSiteVisit({ baseUrl, body, errors, locals, session }, response) {
	const { appeal, appealId } = locals;

	if (errors) {
		return response.render('appeals/inspector/book-site-visit', { appeal, errors, ...body });
	}
	inspectorSession.setSiteVisit(session, { appealId, ...body });

	response.redirect(`${baseUrl}/appeals/${appealId}/confirm-site-visit`);
}

/**
 * @typedef ViewSiteVisitConfirmationRenderProps
 * @property {Appeal} appeal
 * @property {ValidationErrors=} errors
 * @property {string} siteVisitDate
 * @property {string} siteVisitTimeSlot
 * @property {SiteVisitType} siteVisitType
 */

/**
 * Display a confirmation page to the user using the site data from the session.
 *
 * @type {import('@pins/express').RenderHandler<ViewSiteVisitConfirmationRenderProps, AppealLocals>}
 */
export async function viewSiteVisitConfirmation({ locals, session }, response) {
	const { appeal, appealId } = locals;
	const siteVisitData = /** @type {SiteVisitState} */ (
		inspectorSession.getSiteVisit(session, appealId)
	);

	response.render('appeals/inspector/book-site-visit-confirmation', { appeal, ...siteVisitData });
}

/**
 * @typedef ConfirmSiteVisitSuccessRenderProps
 * @property {Appeal} appeal
 */

/**
 * Confirm a site visit using the data in the inspector session.
 *
 * @type {import('@pins/express').RenderHandler<ConfirmSiteVisitSuccessRenderProps, AppealLocals>}
 */
export async function confirmSiteVisit({ locals, session }, response) {
	const { appealId, ...siteVisitData } = /** @type {SiteVisitState} */ (
		inspectorSession.getSiteVisit(session, locals.appealId)
	);
	const updatedAppeal = await inspectorService.bookSiteVisit(appealId, siteVisitData);

	inspectorSession.destroySiteVisit(session);

	response.render('appeals/inspector/book-site-visit-success', { appeal: updatedAppeal });
}

/**
 * @typedef {object} NewDecisionRenderProps
 * @property {Appeal} appeal
 * @property {AppealOutcome=} outcome
 * @property {ValidationErrors=} errors
 * @property {import('@pins/express').MulterFile=} decisionLetter
 */

/**
 * Record a decision on an appeal following a site visit.
 *
 * @type {import('@pins/express').RenderHandler<NewDecisionRenderProps, AppealLocals>}
 */
export async function newDecision({ locals, session }, response) {
	const { appeal, appealId } = locals;
	// Note that if the user returns to this page via either the 'Back' link or
	// refreshing the page, then their previously uploaded file will be need to be
	// reselected as there's no way to prepopulate an input[type="file"].
	const decisionData = inspectorSession.getDecision(session, appealId);

	response.render('appeals/inspector/issue-decision', { appeal, ...decisionData });
}

/**
 * @typedef {object} CreateDecisionBody
 * @property {AppealOutcome} outcome
 * @property {import('@pins/express').MulterFile} decisionLetter
 */

/**
 * Book a site visit by entering the site visit details.
 *
 * @type {import('@pins/express').RenderHandler<Required<NewDecisionRenderProps>,
 * AppealLocals, CreateDecisionBody>}
 */
export async function createDecision({ baseUrl, body, locals, errors, session }, response) {
	const { appeal, appealId } = locals;

	if (errors) {
		return response.render('appeals/inspector/issue-decision', {
			appeal,
			decisionLetter: body.decisionLetter,
			errors,
			outcome: body.outcome
		});
	}
	inspectorSession.setDecision(session, { appealId, ...body });

	response.redirect(`${baseUrl}/appeals/${appealId}/confirm-decision`);
}

/**
 * @typedef {object} ViewDecisionConfirmationRenderProps
 * @property {Appeal} appeal
 * @property {AppealOutcome} outcome
 * @property {import('@pins/express').MulterFile} decisionLetter
 */

/**
 * Display a confirmation page to the user using the decision data from the
 * session.
 *
 * @type {import('@pins/express').RenderHandler<ViewDecisionConfirmationRenderProps, AppealLocals>}
 */
export async function viewDecisionConfirmation({ locals, session }, response) {
	const { appeal, appealId } = locals;
	const decisionData = /** @type {DecisionState} */ (
		inspectorSession.getDecision(session, appealId)
	);

	response.render('appeals/inspector/issue-decision-confirmation', { appeal, ...decisionData });
}

/**
 * Download the decision letter previously uploaded to the session.
 *
 * @type {import('@pins/express').RequestHandler<AppealLocals>}
 */
export function downloadDecisionLetter({ locals, session }, response) {
	const { decisionLetter } = /** @type {DecisionState} */ (
		inspectorSession.getDecision(session, locals.appealId)
	);

	if (decisionLetter.path) {
		response
			.status(200)
			.set('Content-disposition', `attachment; filename="${decisionLetter.originalname}"`)
			.sendFile(decisionLetter.path);
	} else {
		response.status(404).end();
	}
}

/**
 * @typedef ConfirmDecisionSuccessRenderProps
 * @property {Appeal} appeal
 */

/**
 * Confirm a site visit using the data in the inspector session.
 *
 * @type {import('@pins/express').RenderHandler<ConfirmDecisionSuccessRenderProps, AppealLocals>}
 */
export async function confirmDecision({ locals, session }, response) {
	const decisionData = /** @type {DecisionState} */ (
		inspectorSession.getDecision(session, locals.appealId)
	);
	const updatedAppeal = await inspectorService.issueDecision(locals.appealId, decisionData);

	inspectorSession.destroyDecision(session);

	response.render('appeals/inspector/issue-decision-success', { appeal: updatedAppeal });
}
