import { buildQueryString } from '../../common/components/build-query-string.js';
import { getPaginationInfo } from '../../common/components/pagination/pagination.js';
import { tableSortingHeaderLinks } from '../../common/components/table/table-sorting-header-links.js';
import { getProjectUpdates } from './project-updates.service.js';
import { projectUpdatesRows } from './project-updates.view-model.js';

const view = 'applications/case/project-updates.njk';
const relativeUrl = 'project-updates';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function projectUpdatesPage({ params, query }, res) {
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
			queryOptions.sortBy = '+' + sortBy;
		}
	}

	const projectUpdatesRes = await getProjectUpdates(caseId, buildQueryString(queryOptions));

	return res.render(view, {
		projectUpdatesRows: projectUpdatesRows(projectUpdatesRes.items),
		caseId,
		tableHeaders: tableHeaders(query),
		pagination: getPaginationInfo(query, 'project-updates', projectUpdatesRes),
		queryData: queryOptions
	});
}

/**
 *
 * @param {object} query
 * @returns {import('../../common/components/table/table-sorting-header-links.js').TableHeaderLink[]}
 */
function tableHeaders(query) {
	return [
		tableSortingHeaderLinks(query, 'Date published', 'datePublished', relativeUrl),
		tableSortingHeaderLinks(query, 'Project update', '', relativeUrl),
		tableSortingHeaderLinks(query, 'Email', 'emailSubscribers', relativeUrl),
		tableSortingHeaderLinks(query, 'Status', 'status', relativeUrl),
		tableSortingHeaderLinks(query, 'Action', '', relativeUrl)
	];
}
