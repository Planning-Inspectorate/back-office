/**
 * Redirect to relevant reps section if folderName is relevant-representations
 *
 *  @type {import('express').RequestHandler<{folderName: string, caseId: string}>}
 */
export const assertFolderIsNotReps = (request, response, next) => {
	if (request.params.folderName === 'relevant-representations') {
		return response.redirect(
			`/applications-service/case/${request.params.caseId}/relevant-representations`
		);
	}

	next();
};
