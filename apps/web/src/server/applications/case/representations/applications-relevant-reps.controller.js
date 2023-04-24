import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import { getCase, getRepresentations } from './applications-relevant-reps.service.js';
const view = 'applications/representations/representations.njk';

import querystring from 'node:querystring';

/**
 *
 * @param {any} query
 * @returns {string}
 */
const buildQueryString = (query) => querystring.stringify(query);

import * as express from 'express';
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function relevantRepsApplications({ params, query }, res) {
	const { caseId } = params;

	const { searchTerm, sortBy, pageSize = 25, page = 1 } = query;

	const queryString = buildQueryString({
		searchTerm,
		sortBy,
		pageSize,
		page
	});

	const caseReference = await getCase(caseId);
	const representations = await getRepresentations(caseId, queryString);

	const representationsVieModel = getRepresentationsViewModel(representations);
	const caseReferenceViewModel = getCaseReferenceViewModel(caseReference);

	return res.render(view, {
		representations: representationsVieModel,
		caseReference: caseReferenceViewModel,
		caseId,
		queries: {
			searchTerm,
			activeSort: sortBy,
			page,
			pageSize
		}
	});
}
