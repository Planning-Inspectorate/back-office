/**
 * @param {string | null} stage
 *
 * @returns {import('pins-data-model').Schemas.Folder.caseStage.enum} caseStage
 */
export const folderCaseStageMapper = (stage) => {
	const caseStage = stage?.toString().toLowerCase() ?? null;
	switch (caseStage) {
		case `developer's application`:
			return 'developers_application';
		case 'post-decision':
			return 'post_decision';
		default:
			return caseStage;
	}
};
