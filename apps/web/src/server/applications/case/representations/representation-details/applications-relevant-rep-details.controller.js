import * as express from 'express';

import { getCase } from '../../../representations/applications-relevant-reps.service.js';
import { getRepresentationDetails } from './applications-relevant-rep-details.service.js';

import { getRepresentationDetailsViewModel } from './application-representation-details.view-model.js';
import { getCaseReferenceViewModel } from '../../../representations/application-representations.view-model.js';

const view = 'applications/representations/representation-details/representation-details.njk';



/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function relevantRepDetails(req, res) {
	const { caseId, representationId } = req.params;
	
	const caseReference = await getCase(caseId);
	const representationDetails = await getRepresentationDetails( caseId, representationId )

	const caseReferenceViewModel = getCaseReferenceViewModel( caseReference );
	const representationDetailsViewModel = getRepresentationDetailsViewModel( representationDetails )

	return res.render(view, {
		test: 'Hello World!',
		caseId: caseId,
		representationId,
		caseReference: caseReferenceViewModel,
		representationDetails: representationDetailsViewModel,
	});
}
