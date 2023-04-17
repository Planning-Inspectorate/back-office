import * as express from 'express';
import querystring from 'node:querystring';
import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import { getCase, getRepresentations } from './applications-relevant-reps.service.js';
const view = 'applications/representations/representations.njk';

/**
 *
 * @param {any} query
 * @returns {string}
 */
const buildQueryString = (query) => querystring.stringify(query);

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function relevantRepsApplications({ params, query }, res) {
	const { id } = params;

	const queryString = buildQueryString(query);
	const caseReference = await getCase(id);
	const representations = await getRepresentations(id, queryString);

	const representationsVieModel = getRepresentationsViewModel(representations);
	const caseReferenceViewModel = getCaseReferenceViewModel(caseReference);

	return res.render(view, {
		representations: representationsVieModel,
		caseReference: caseReferenceViewModel,
		caseId: id,
		searchTerm: query.searchTerm
	});
}
