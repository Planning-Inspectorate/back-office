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
		sentToSubscribers: projectUpdate.sentToSubscribers,
		status: projectUpdate.status,
		datePublished: projectUpdate.datePublished?.toISOString(),
		title: projectUpdate.title,
		htmlContent: projectUpdate.htmlContent,
		htmlContentWelsh: projectUpdate.htmlContentWelsh
	};
}
