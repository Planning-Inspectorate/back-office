import { getSelectedOptionsText } from '../representation/utils/get-selected-options-text.js';
import { getPageTitles } from './utils/get-page-titles.js';
import { getPageLinks } from './utils/get-page-links.js';
import { getRepresentationWorkflowValues } from './utils/get-representation-workflow-values.js';
import { getOrganisationOrFullname } from './utils/get-organisation-or-fullname.js';
import { getRepModePageURLs } from './utils/get-rep-mode-page-urls.js';
import { getRepresentationExcerpts } from './utils/get-representation-excerpts.js';
import { getRelevantRepFolder } from './applications-relevant-rep-details.service.js';

/**
 * @param {object|*} params
 * @param {object|*} locals
 * @param {object|*} query
 * @return {Promise<object>}
 */
export const getRepresentationDetailsViewModel = async (
	{ caseId, representationId },
	{ repMode },
	{ representation }
) => ({
	...getPageLinks(caseId, repMode, representationId, representation.status),
	...getPageTitles(representation.status),
	caseId,
	representationId,
	selectedOptionsText: getSelectedOptionsText(representation),
	representationExcerpts: getRepresentationExcerpts(representation),
	representationWorkflowValues: getRepresentationWorkflowValues(representation),
	relevantRepDocumentFolder: await getRelevantRepFolder(caseId),
	organisationOrFullname: getOrganisationOrFullname(representation.represented),
	repModePageURLs: getRepModePageURLs(representation)
});
