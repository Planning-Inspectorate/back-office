import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import { getCase, getRepresentations } from './applications-relevant-reps.service.js';
const view = 'applications/representations/representations.njk';

import * as express from 'express';
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function relevantRepsApplications(req, res) {
	const { caseId } = req.params;
	const caseReference = await getCase(caseId);
	const representations = await getRepresentations(caseId);

	const representationsVieModel = getRepresentationsViewModel(representations);
	const caseReferenceViewModel = getCaseReferenceViewModel(caseReference);

	return res.render(view, {
		representations: representationsVieModel,
		caseReference: caseReferenceViewModel,
		caseId
	});
}
