import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import { getCase, getRepresentations } from './applications-relevant-reps.service.js';
const view = 'applications/representations/representations.njk';
const detailsView = 'applications/representations/representation-details/representation-details.njk';

import * as express from 'express';
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function relevantRepsApplications(req, res) {
	const { id } = req.params;
	const caseReference = await getCase(id);
	const representations = await getRepresentations(id);

	const representationsVieModel = getRepresentationsViewModel(representations);
	const caseReferenceViewModel = getCaseReferenceViewModel(caseReference);

	return res.render(view, {
		representations: representationsVieModel,
		caseReference: caseReferenceViewModel,
		caseId: id
		
	});
}

// /**
//  * @param {express.Request} req
//  * @param {express.Response} res
//  */
// export async function relevantRepDetails(req, res) {
// 	const { id, representationId } = req.params;

// 	const caseReference = await getCase(id);
// 	const caseReferenceViewModel = getCaseReferenceViewModel(caseReference);

// 	console.log(id)
// 	console.log( representationId )
// 	return res.render(detailsView, {
// 		test: 'Hello World!',
// 		caseId: id,
// 		representationId,
// 		caseReference: caseReferenceViewModel,
// 	});
// }
