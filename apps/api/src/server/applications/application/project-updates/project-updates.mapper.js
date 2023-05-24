/**
 * @param {import('@prisma/client').ProjectUpdate} projectUpdate
 * @returns {import('@pins/applications').ProjectUpdate}
 */
export function mapProjectUpdate(projectUpdate) {
	return {
		id: projectUpdate.id,
		caseId: projectUpdate.caseId,
		authorId: projectUpdate.authorId,
		dateCreated: projectUpdate.dateCreated.toISOString(),
		emailSubscribers: projectUpdate.emailSubscribers,
		status: projectUpdate.status,
		datePublished: projectUpdate.datePublished?.toISOString(),
		htmlContent: projectUpdate.htmlContent
	};
}
