import { url } from '../../../lib/nunjucks-filters/url.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import { getPaginationInfo } from '../../common/components/pagination/pagination.js';
import { tableSortingHeaderLinks } from '../../common/components/table/table-sorting-header-links.js';
import { getProjectUpdates } from './project-updates.service.js';
import { projectUpdatesRows } from './project-updates.view-model.js';

const view = 'applications/case/project-updates.njk';

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
