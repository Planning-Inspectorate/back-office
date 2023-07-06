import { getCaseReferenceViewModel } from '../application-representations.view-model.js';
import { getCase } from '../applications-relevant-reps.service.js';
import { getSelectedOptionsText } from '../representation/utils/get-selected-options-text.js';
import { getRepModeLinks, repModeLinkOptions } from '../utils/get-rep-mode-links.js';
import { getRepresentationDetailsViewModel } from './application-representation-details.view-model.js';
import {
	getRelevantRepFolder,
	getRepresentationDetails
} from './applications-relevant-rep-details.service.js';
import { getWorkflowValues } from './utils/get-workflow-values.js';

const view = 'applications/representations/representation-details/representation-details.njk';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function relevantRepDetails(req, res) {
	const { caseId, representationId } = req.params;
	const { locals } = res;

	const caseReference = await getCase(caseId);
	const representationDetails = await getRepresentationDetails(caseId, representationId);
	const relevantRepDocumentFolder = await getRelevantRepFolder(caseId);

	const caseReferenceViewModel = getCaseReferenceViewModel(caseReference);
	const representationDetailsViewModel = getRepresentationDetailsViewModel(representationDetails);

	return res.render(view, {
		caseId,
		representationId,
		caseReference: caseReferenceViewModel,
		representationDetails: representationDetailsViewModel,
		changeLinks: getRepModeLinks(locals.representation.pageURLs, repModeLinkOptions.change),
		selectedOptionsText: getSelectedOptionsText(locals.representation),
		relevantRepDocumentFolder,
		workflow: getWorkflowValues(locals.representation)
	});
}
