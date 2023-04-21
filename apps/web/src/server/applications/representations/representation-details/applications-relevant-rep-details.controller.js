import * as express from 'express';

import { getCase } from '../applications-relevant-reps.service.js';
import { getRepresentationDetails } from './applications-relevant-rep-details.service.js';

import { getRepresentationDetailsViewModel } from './application-representation-details.view-model.js';
import { getCaseReferenceViewModel } from '../application-representations.view-model.js';

const view = 'applications/representations/representation-details/representation-details.njk';



/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function relevantRepDetails(req, res) {
	const { id, representationId } = req.params;
	
	const caseReference = await getCase(id);
	const representationDetails = await getRepresentationDetails( id, representationId )

	const caseReferenceViewModel = getCaseReferenceViewModel( caseReference );
	const representationDetailsViewModel = getRepresentationDetailsViewModel( representationDetails )

	return res.render(view, {
		test: 'Hello World!',
		caseId: id,
		representationId,
		caseReference: caseReferenceViewModel,
		representationDetails: representationDetailsViewModel,
	});
}
