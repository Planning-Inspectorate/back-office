import { url } from '../../../lib/nunjucks-filters/url.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import { getPaginationInfo } from '../../common/components/pagination/pagination.js';
import { tableSortingHeaderLinks } from '../../common/components/table/table-sorting-header-links.js';
import { bodyToCreateRequest, bodyToUpdateRequest } from './project-updates.mapper.js';
import { projectUpdateRoutes } from './project-updates.router.js';
import {
	createProjectUpdate,
	getProjectUpdate,
	getProjectUpdates,
	patchProjectUpdate
} from './project-updates.service.js';
import {
	createDetailsView,
	createContentFormView,
	projectUpdatesRows,
	statusRadioOption,
	sortStatuses
} from './project-updates.view-model.js';
import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';

const view = 'applications/case/project-updates.njk';
const formView = 'applications/case/project-updates/project-updates-form.njk';
const detailsView = 'applications/case/project-updates/project-updates-details.njk';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesTable({ params, query }, res) {
	const { caseId } = params;

	const { sortBy, pageSize = 25, page = 1 } = query;
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

	return res.render(view, {
		banner: res.locals.banner,
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
	return res.render(
		formView,
		createContentFormView({
			caseInfo: res.locals.case,
			errors: req.errors,
			values: req.body
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
	const { caseId } = req.params;
	const projectUpdate = bodyToCreateRequest(req.body);
	const created = await createProjectUpdate(caseId, projectUpdate);
	const projectUpdateId = created.id;
	const nextUrl = url('project-updates-step', {
		caseId: parseInt(caseId),
		step: projectUpdateRoutes.status,
		projectUpdateId
	});
	res.redirect(nextUrl);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesContentGet(req, res) {
	const { caseId, projectUpdateId } = req.params;
	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	const values = {
		content: projectUpdate.htmlContent,
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
			emailSubscribersEditable
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
	const { caseId, projectUpdateId } = req.params;
	const projectUpdate = bodyToUpdateRequest(req.body);
	await patchProjectUpdate(caseId, projectUpdateId, projectUpdate);
	const nextUrl = url('project-updates-step', {
		caseId: parseInt(caseId),
		step: projectUpdateRoutes.checkAnswers,
		projectUpdateId: parseInt(projectUpdateId)
	});
	res.redirect(nextUrl);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesStatusGet(req, res) {
	const { caseId, projectUpdateId } = req.params;
	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	const errors = req.errors;

	// which statuses options should be shown, given the current status
	const statusOptions = sortStatuses([
		// you can always chose the current status option
		projectUpdate.status,
		// and any other allowed statuses
		...ProjectUpdate.AllowedStatuses[projectUpdate.status]
			// you can't change an update to published from the status page
			// that happens on the check answers page
			// instead it'd be set to Ready to Publish
			.filter((status) => status !== ProjectUpdate.Status.published)
	]);

	const title =
		projectUpdate.status === ProjectUpdate.Status.draft ? 'Set status' : 'Change status';

	return res.render(formView, {
		case: res.locals.case,
		title,
		buttonText: 'Save and continue',
		errors, // for error summary
		form: {
			components: [
				{
					type: 'radios',
					name: 'status',
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
	const { caseId, projectUpdateId } = req.params;
	await patchProjectUpdate(caseId, projectUpdateId, { status: req.body.status });
	const nextUrl = url('project-updates-step', {
		caseId: parseInt(caseId),
		step: projectUpdateRoutes.checkAnswers,
		projectUpdateId: parseInt(projectUpdateId)
	});
	res.redirect(nextUrl);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesCheckAnswersGet(req, res) {
	const { caseId, projectUpdateId } = req.params;
	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	let buttonText = 'Save and continue';
	let form;
	if (projectUpdate.status === ProjectUpdate.Status.readyToPublish) {
		buttonText = 'Publish';
		form = {
			name: 'status',
			value: ProjectUpdate.Status.published
		};
	}
	return res.render(
		detailsView,
		createDetailsView({
			caseInfo: res.locals.case,
			title: 'Check your project update',
			buttonText,
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
	const { caseId, projectUpdateId } = req.params;
	let banner = 'You have successfully created a draft project update';
	if (req.body.status) {
		await patchProjectUpdate(caseId, projectUpdateId, { status: req.body.status });
		if (req.body.status === ProjectUpdate.Status.published) {
			banner = 'You have successfully published a project update';
		}
	}
	res.locals.banner = banner;
	return projectUpdatesTable(req, res);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesReviewGet(req, res) {
	const { caseId, projectUpdateId } = req.params;
	const projectUpdate = await getProjectUpdate(caseId, projectUpdateId);
	let buttonText;
	let buttonWarning = false;
	let form;
	if (projectUpdate.status === ProjectUpdate.Status.draft) {
		buttonText = 'Delete';
		buttonWarning = true;
		form = {
			name: 'action',
			value: 'delete'
		};
	}
	return res.render(
		detailsView,
		createDetailsView({
			caseInfo: res.locals.case,
			buttonText,
			buttonWarning,
			projectUpdate,
			form
		})
	);
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
