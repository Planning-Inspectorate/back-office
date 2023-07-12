import { url } from '../../../lib/nunjucks-filters/url.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import { getPaginationInfo } from '../../common/components/pagination/pagination.js';
import { tableSortingHeaderLinks } from '../../common/components/table/table-sorting-header-links.js';
import { bodyToCreateRequest } from './project-updates.mapper.js';
import { createProjectUpdate, getProjectUpdates } from './project-updates.service.js';
import { createFormView, projectUpdatesRows } from './project-updates.view-model.js';

const view = 'applications/case/project-updates.njk';
const formView = 'applications/case/project-updates/project-updates-form.njk';

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
	return res.render(formView, createFormView(res.locals.case, req.errors, req.body));
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
		step: 'status',
		projectUpdateId
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
