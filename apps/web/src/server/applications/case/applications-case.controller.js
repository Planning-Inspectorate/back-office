import { BO_GENERAL_S51_CASE_REF } from '@pins/applications';
import { publishCase, unpublishCase } from '../common/services/case.service.js';
import { deleteSessionBanner, getSessionBanner } from '../common/services/session.service.js';
import { allRoles } from './project-team/applications-project-team.controller.js';
import {
	getProjectTeam,
	getManyProjectTeamMembersInfo
} from '../common/services/project-team.service.js';
import { isCaseRegionWales } from '../common/isCaseWelsh.js';

/** @typedef {import('../applications.types').Case} Case */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * View the overview for a single case (legacy)
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function viewApplicationsCaseOverviewLegacy({ session }, response) {
	const {
		caseId,
		case: { reference }
	} = response.locals;

	//hide the page when attempting to view general section 51 case
	if (reference === BO_GENERAL_S51_CASE_REF) {
		return response.render(`app/404`);
	}

	// query the internal database to retrieve roles and ids
	const projectTeamMembers = await getProjectTeam(caseId);

	const displayableMembers = (projectTeamMembers || [])
		// filter NSIP Officer and Case Manager role
		.filter(
			(teamMember) => teamMember.role === 'case_manager' || teamMember.role === 'NSIP_officer'
		)
		// replace role vale with its displayName
		.map((teamMember) => ({
			...teamMember,
			role: allRoles.find((role) => role.value === teamMember.role)?.text || ''
		}))
		// make sure case_manager members come before nsip officers members
		.sort((usr1, usr2) => (usr1.role > usr2.role ? 1 : -1));

	const notDisplayableMembersExist =
		displayableMembers.length === 0 &&
		displayableMembers.length !== (projectTeamMembers || []).length;

	// add users info from the cache containing the results of ms graph api query
	const displayableMembersInfo = await getManyProjectTeamMembersInfo(
		displayableMembers || [],
		session
	);

	response.render(`applications/case/overview-legacy`, {
		selectedPageType: 'overview',
		displayableMembers: displayableMembersInfo,
		notDisplayableMembersExist
	});
}

/**
 * View the overview for a single case
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function viewApplicationsCaseOverview(request, response) {
	const {
		case: { id: caseId, reference }
	} = response.locals;

	//hide the page when attempting to view general section 51 case
	if (reference === BO_GENERAL_S51_CASE_REF) {
		return response.render(`app/404`);
	}

	const projectTeam = await getProjectTeam(caseId);
	const teamMembers = await getManyProjectTeamMembersInfo(projectTeam, request.session);
	const caseIsWelsh = await isCaseRegionWales(
		response.locals.case?.geographicalInformation?.regions
	);
	const caseIsGeneratingStation =
		response.locals.case?.subSector?.name === 'generating_stations' ?? false;

	/** @type {string | null} */
	const caseManager = (() => {
		const userInfo = teamMembers.find((m) => m.role === 'case_manager');
		if (!userInfo) {
			return null;
		}

		return `${userInfo.givenName} ${userInfo.surname}`;
	})();

	/** @type {string[]} */
	const nsipOfficers = teamMembers
		.filter((m) => m.role === 'NSIP_officer')
		.map((m) => `${m.givenName} ${m.surname}`);

	const keyMembers = {
		caseManager,
		nsipOfficers
	};

	const banner = getSessionBanner(request.session);
	deleteSessionBanner(request.session);

	response.render(`applications/case/overview`, {
		errors: request.errors,
		selectedPageType: 'overview',
		keyMembers,
		caseIsWelsh,
		banner,
		caseIsGeneratingStation
	});
}

/**
 * Validate overview before publishing
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function validateApplicationsCaseOverview(request, response) {
    const isGenerating = response.locals.case?.subSector?.name === 'generating_stations';
    const subProjectType = (request.body?.subProjectType || '').trim();

    if (isGenerating && !subProjectType) {
        request.errors = {
            'additionalDetails.subProjectType': { msg: 'Enter a project type' }
        };
        return viewApplicationsCaseOverview(request, response);
    }

    return response.redirect(`${request.baseUrl}/preview-and-publish`);
}

/**
 * View the project information page for a single case
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function viewApplicationsCaseInformation(_, response) {
	response.render('applications/case/project-information', {
		selectedPageType: 'project-information',
		caseIsWelsh: false
	});
}

/**
 * View the unpublish page for a single case
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function viewApplicationsCaseUnpublishPage(_, response) {
	response.render(`applications/case/unpublish`);
}

/**
 * View page for previewing and publishing case
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewApplicationsCasePublishPage(request, response) {
    const isGenerating = response.locals.case?.subSector?.name === 'generating_stations';
    const hasProjectType = !!response.locals.case?.additionalDetails?.subProjectType;

    if (isGenerating && !hasProjectType) {
        request.errors = { 'additionalDetails.subProjectType': { msg: 'Enter a project type' } };
    }

    return response.render(`applications/case/preview-and-publish`, {
        selectedPageType: 'preview-and-publish',
        errors: request.errors
    });
}

/**
 * Handle unpublishing case
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function unpublishApplicationsCase(request, response) {
	const { caseId } = response.locals;

	const { errors } = await unpublishCase(caseId);

	if (errors) {
		return response.render(`applications/case/unpublish`, {
			case: response.locals.case,
			errors
		});
	}

	return response.render('applications/case/project-success-banner', { isUnpublished: true });
}

/**
 * Send publishing request with updated changes
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function updateApplicationsCasePublishPage(request, response) {
	const { caseId, case: caseToPublish } = response.locals;
	const { publishedDate, errors } = await publishCase(caseId);

	response.locals.case = {
		...caseToPublish,
		publishedDate,
		hasUnpublishedChanges: false
	};

	if (errors) {
		return response.render(`applications/case/preview-and-publish`, {
			selectedPageType: 'preview-and-publish',
			errors
		});
	}

	return response.render('applications/case/project-success-banner', {
		isRepublished: !!caseToPublish.publishedDate
	});
}
