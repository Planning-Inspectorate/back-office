import { buildQueryString } from '../../common/components/build-query-string.js';
import { getPaginationInfo } from '../../common/components/pagination/pagination.js';
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
	}

	const projectUpdatesRes = await getProjectUpdates(caseId, buildQueryString(queryOptions));

	return res.render(view, {
		projectUpdatesRows: projectUpdatesRows(projectUpdatesRes.items),
		caseId,
		table: {
			sortLinks: []
		},
		pagination: getPaginationInfo(query, 'project-updates', projectUpdatesRes),
		queryData: queryOptions
	});
}
