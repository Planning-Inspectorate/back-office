import { url } from '../../../lib/nunjucks-filters/url.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import { getPaginationInfo } from '../../common/components/pagination/pagination.js';
import {
	deleteSessionBanner,
	getSessionBanner,
	setSessionBanner
} from '../../common/services/session.service.js';
import { tableSortingHeaderLinks } from '../../common/components/table/table-sorting-header-links.js';
import { bodyToCreateRequest, bodyToUpdateRequest } from './project-updates.mapper.js';
import { projectUpdateRoutes } from './project-updates.router.js';
import {
	createProjectUpdate,
	deleteProjectUpdate,
	getProjectUpdate,
	getProjectUpdates,
	patchProjectUpdate,
	postProjectUpdateFinaliseStatus
} from './project-updates.service.js';
import {
	createDetailsView,
	createContentFormView,
	projectUpdatesRows,
	statusRadioOption,
	sortStatuses,
	typeRadioOption,
	statusFilter
} from './project-updates.view-model.js';
import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
import { featureFlagClient } from '../../../../common/feature-flags.js';

const view = 'applications/case/project-updates.njk';
const formView = 'applications/case/project-updates/project-updates-form.njk';
const detailsView = 'applications/case/project-updates/project-updates-details.njk';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesTable({ query, session }, res) {
	const { caseId } = res.locals;
	const { sortBy = '-datePublished', pageSize = 25, page = 1 } = query;
	const queryOptions = {};
	if (page && pageSize) {
		queryOptions.page = page;
		queryOptions.pageSize = pageSize;
	}
	if (sortBy) {
		queryOptions.sortBy = sortBy;
		if (!String(sortBy).startsWith('-')) {
			// if ascending, append + for the API call
			queryOptions.sortBy = '+' + sortBy;
		}
	}

	const projectUpdatesRes = await getProjectUpdates(caseId, buildQueryString(queryOptions));
	const updatesUrl = url('project-updates', { caseId: parseInt(caseId) });

	const banner = getSessionBanner(session);
	// banner only applies once, so clear it
	deleteSessionBanner(session);
	return res.render(view, {
		banner,
		projectUpdatesRows: projectUpdatesRows(projectUpdatesRes.items),
		caseId,
		tableHeaders: tableHeaders(query, updatesUrl),
		pagination: getPaginationInfo(query, updatesUrl, projectUpdatesRes),
		queryData: queryOptions
	});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesCreateGet(req, res) {
	const { errors, body: values } = req;
	const { case: caseInfo, caseIsWelsh } = res.locals;
	return res.render(
		formView,
		createContentFormView({
			caseInfo,
			errors,
			values,
			caseIsWelsh
		})
	);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesCreatePost(req, res) {
	if (req.errors) {
		return projectUpdatesCreateGet(req, res);
	}
	const { caseId } = res.locals;
	const projectUpdate = bodyToCreateRequest(req.body);
	const created = await createProjectUpdate(caseId, projectUpdate);
	const projectUpdateId = created.id;
	const nextUrl = stepLink(caseId, projectUpdateId, projectUpdateRoutes.type);
	res.redirect(nextUrl);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesContentGet(req, res) {
	const { caseId, projectUpdateId, caseIsWelsh } = res.locals;
	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	const values = {
		backOfficeProjectUpdateContent: projectUpdate.htmlContent,
		backOfficeProjectUpdateContentWelsh: projectUpdate.htmlContentWelsh,
		emailSubscribers: projectUpdate.emailSubscribers,
		...req.body
	};
	const emailSubscribersEditable = projectUpdate.status !== ProjectUpdate.Status.published;
	return res.render(
		formView,
		createContentFormView({
			title: 'Change project update',
			caseInfo: res.locals.case,
			errors: req.errors,
			values,
			emailSubscribersEditable,
			caseIsWelsh
		})
	);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesContentPost(req, res) {
	if (req.errors) {
		return projectUpdatesContentGet(req, res);
	}
	const { caseId, projectUpdateId } = res.locals;

	const projectUpdate = bodyToUpdateRequest(req.body);
	await patchProjectUpdate(caseId, projectUpdateId, projectUpdate);
	const nextUrl = stepLink(caseId, projectUpdateId, projectUpdateRoutes.type);
	res.redirect(nextUrl);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesTypeGet(req, res) {
	const { caseId, projectUpdateId } = res.locals;

	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	const errors = req.errors;
	const pageTitle = 'What information does the update contain?';

	return res.render(formView, {
		case: res.locals.case,
		buttonText: 'Save and continue',
		backLink: stepLink(caseId, projectUpdateId, projectUpdateRoutes.content),
		errors, // for error summary
		pageTitle,
		form: {
			components: [
				{
					type: 'radios',
					name: 'type',
					fieldset: {
						legend: {
							html: pageTitle,
							isPageHeading: true,
							classes: 'govuk-fieldset__legend--l'
						}
					},
					value: projectUpdate.type,
					items: ProjectUpdate.TypesList.map(typeRadioOption),
					errorMessage: errors?.type
				}
			]
		}
	});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesTypePost(req, res) {
	if (req.errors) {
		return projectUpdatesTypeGet(req, res);
	}
	const { caseId, projectUpdateId } = res.locals;

	await patchProjectUpdate(caseId, projectUpdateId, { type: req.body.type });
	const nextUrl = stepLink(caseId, projectUpdateId, projectUpdateRoutes.status);
	res.redirect(nextUrl);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesStatusGet(req, res) {
	const { caseId, projectUpdateId } = res.locals;

	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	const errors = req.errors;

	// which statuses options should be shown, given the current status
	const allowedStatuses = [
		// you can always choose the current status option
		projectUpdate.status,
		// and any other allowed statuses
		...ProjectUpdate.AllowedStatuses[projectUpdate.status]
	].filter(statusFilter(projectUpdate.status));

	const statusOptions = sortStatuses(allowedStatuses);

	const pageTitle =
		projectUpdate.status === ProjectUpdate.Status.draft ? 'Set status' : 'Change status';

	return res.render(formView, {
		case: res.locals.case,
		buttonText: 'Save and continue',
		backLink: stepLink(caseId, projectUpdateId, projectUpdateRoutes.type),
		pageTitle,
		errors, // for error summary
		form: {
			components: [
				{
					type: 'radios',
					name: 'status',
					fieldset: {
						legend: {
							html: pageTitle,
							isPageHeading: true,
							classes: 'govuk-fieldset__legend--l'
						}
					},
					value: projectUpdate.status,
					items: statusOptions.map(statusRadioOption),
					errorMessage: errors?.status
				}
			]
		}
	});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesStatusPost(req, res) {
	if (req.errors) {
		return projectUpdatesStatusGet(req, res);
	}
	const { caseId, projectUpdateId } = res.locals;

	await patchProjectUpdate(caseId, projectUpdateId, { status: req.body.status });
	const nextUrl = stepLink(caseId, projectUpdateId, projectUpdateRoutes.checkAnswers);
	res.redirect(nextUrl);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesCheckAnswersGet(req, res) {
	const { caseId, caseIsWelsh, projectUpdateId } = res.locals;

	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	let title = 'Create your project update';
	let buttonText = 'Save and continue';
	let warningText = projectUpdate.datePublished
		? 'If you edit this project update, the publication date will change. Subscribers will not be notified. If you need to make a change, you must create a new update so subscribers will be informed.'
		: projectUpdate.status === ProjectUpdate.Status.draft
		? undefined
		: 'Check all the information in your project update is correct. When you publish your update an email will be sent to subscribers.';
	let form;
	switch (projectUpdate.status) {
		case ProjectUpdate.Status.draft:
			if (featureFlagClient.isFeatureActive('applic-55-welsh-translation')) {
				buttonText = 'Save project update';
				form = {
					name: 'status',
					value: ProjectUpdate.Status.draft
				};
			}
			break;
		case ProjectUpdate.Status.readyToPublish:
			if (featureFlagClient.isFeatureActive('applic-55-welsh-translation')) {
				buttonText = 'Publish project update';
			} else {
				buttonText = 'Publish';
			}
			form = {
				name: 'status',
				value: ProjectUpdate.Status.published
			};
			break;
		case ProjectUpdate.Status.readyToUnpublish:
			buttonText = 'Unpublish';
			form = {
				name: 'status',
				value: ProjectUpdate.Status.unpublished
			};
			break;
		case ProjectUpdate.Status.published:
			buttonText = 'Publish changes';
			form = {
				name: 'status',
				value: ProjectUpdate.Status.published
			};
			break;
	}
	let deleteButtonLink;
	if (ProjectUpdate.isDeleteable(projectUpdate.status)) {
		deleteButtonLink = stepLink(caseId, projectUpdateId, projectUpdateRoutes.delete);
	}

	return res.render(
		detailsView,
		createDetailsView({
			caseInfo: res.locals.case,
			caseIsWelsh,
			title,
			warningText,
			backLink: stepLink(caseId, projectUpdateId, projectUpdateRoutes.status),
			buttonText,
			deleteButtonLink,
			form,
			projectUpdate
		})
	);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesCheckAnswersPost(req, res) {
	const { caseId, projectUpdateId } = res.locals;

	if (req.body.status) {
		await postProjectUpdateFinaliseStatus(caseId, projectUpdateId);
	}
	let action = 'saved';
	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	switch (projectUpdate.status) {
		case ProjectUpdate.Status.archived:
			action = 'archived';
			break;
		case ProjectUpdate.Status.published:
			action = 'published';
			break;
		case ProjectUpdate.Status.unpublished:
			action = 'unpublished';
			break;
	}
	setSessionBanner(req.session, `Project update ${action}`);
	const nextUrl = url('project-updates', {
		caseId: parseInt(caseId)
	});
	res.redirect(nextUrl);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesReviewGet(req, res) {
	const { caseId, caseIsWelsh, projectUpdateId } = res.locals;

	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	const title = 'Check your project update';
	let buttonText = 'Save project update';
	let buttonLink = url('project-updates-step', {
		caseId: parseInt(caseId)
	});
	let buttonWarning = false;
	const editable = ProjectUpdate.isEditable(projectUpdate.status);
	let deleteButtonLink;
	if (ProjectUpdate.isDeleteable(projectUpdate.status)) {
		if (featureFlagClient.isFeatureActive('applic-55-welsh-translation')) {
			deleteButtonLink = stepLink(caseId, projectUpdateId, projectUpdateRoutes.delete);
		} else {
			buttonText = 'Delete';
			buttonWarning = true;
			buttonLink = stepLink(caseId, projectUpdateId, projectUpdateRoutes.delete);
		}
	}
	return res.render(
		detailsView,
		createDetailsView({
			caseInfo: res.locals.case,
			caseIsWelsh,
			title,
			buttonText,
			buttonWarning,
			buttonLink,
			deleteButtonLink,
			projectUpdate,
			editable
		})
	);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesDeleteGet(req, res) {
	const { caseId, projectUpdateId } = res.locals;

	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	return res.render(formView, {
		errors: res.locals.error,
		caseInfo: res.locals.case,
		title: 'Delete project update',
		buttonText: 'Confirm delete',
		backLink: stepLink(caseId, projectUpdateId, projectUpdateRoutes.review),
		form: {
			components: [
				{
					type: 'html',
					title: 'Content',
					html: projectUpdate.htmlContent
				}
			]
		}
	});
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesDeletePost(req, res) {
	const { caseId, projectUpdateId } = res.locals;

	try {
		await deleteProjectUpdate(caseId, projectUpdateId);
		setSessionBanner(req.session, `Project update deleted`);
	} catch (e) {
		res.locals.error = { error: 'The project update could not be deleted' };
		return projectUpdatesDeleteGet(req, res);
	}
	const nextUrl = url('project-updates', {
		caseId: parseInt(caseId)
	});
	res.redirect(nextUrl);
}

/**
 *
 * @param {object} query
 * @param {string} baseUrl
 * @returns {import('../../common/components/table/table-sorting-header-links.js').TableHeaderLink[]}
 */
function tableHeaders(query, baseUrl) {
	return [
		tableSortingHeaderLinks(query, 'Date published', 'datePublished', baseUrl),
		tableSortingHeaderLinks(query, 'Project update', '', baseUrl),
		tableSortingHeaderLinks(query, 'Email', 'emailSubscribers', baseUrl),
		tableSortingHeaderLinks(query, 'Status', 'status', baseUrl),
		tableSortingHeaderLinks(query, 'Action', '', baseUrl)
	];
}

/**
 * Return a URL for a project updates step
 *
 * @param {string} caseId
 * @param {string} projectUpdateId
 * @param {string} step
 * @returns {string}
 */
function stepLink(caseId, projectUpdateId, step) {
	return url('project-updates-step', {
		caseId: parseInt(caseId),
		step,
		projectUpdateId: parseInt(projectUpdateId)
	});
}
