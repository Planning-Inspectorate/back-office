import { folderDocumentCaseStageMappings } from '#api-constants';
import {
	mapCaseStatusString,
	projectCaseStageToDocumentCaseStageSchemaMap
} from './map-case-status-string.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.CaseStatus[] | null} caseStatuses
 * @returns {string | object}
 */
export const mapCaseStatus = (caseStatuses) => {
	if (
		typeof caseStatuses === 'undefined' ||
		caseStatuses === null ||
		!Array.isArray(caseStatuses)
	) {
		throw new TypeError('No Case Statuses Provided');
	}

	const validStatus = caseStatuses.find(
		(caseStatus) => typeof caseStatus.status === 'string' && caseStatus.valid
	);

	if (!validStatus) {
		throw new TypeError('No `Case status` with valid status provided');
	}

	return mapCaseStatusString(validStatus.status);
};

/**
 * convert CBOS DB Document Version stage value into the event schema value.
 * Note that these are different values to the Case stage
 *
 * @param {string |null} stage
 * @returns
 */
export const mapDocumentCaseStageToSchema = (stage) => {
	if (!stage) {
		return null;
	}

	const { DEVELOPERS_APPLICATION, POST_DECISION, RELEVANT_REPRESENTATIONS } =
		folderDocumentCaseStageMappings;

	// mostly the schema value is just the lower equivalent, with some exceptions:
	switch (stage) {
		case DEVELOPERS_APPLICATION:
			return 'developers_application';
		case POST_DECISION:
			// note that post decision has inconsistent format in the schema, it uses underscore instead of hyphen
			// our DB 'Post-decision' maps to 'post_decision'
			return 'post_decision';
		case RELEVANT_REPRESENTATIONS:
			return '0'; // special value required by Front Office
		default:
			return stage.toLowerCase();
	}
};

/**
 * Maps the project case stage (CBOS and Schema - both the same) to the document case stage schema value
 *
 * @param {string} caseStage
 * @returns {string |null}
 */
export const mapProjectCaseStageToDocumentCaseStageSchema = (caseStage) => {
	// @ts-ignore
	return projectCaseStageToDocumentCaseStageSchemaMap[caseStage];
};
