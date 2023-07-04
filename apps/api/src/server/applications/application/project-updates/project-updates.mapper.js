/**
 * Map a project update from the database to the type returned by the API
 *
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

/**
 * @typedef {import('../../../../message-schemas/events/nsip-project-update.d.ts').NSIPProjectUpdate} NSIPProjectUpdate
 */

/**
 * Create a payload (event) for the given update
 *
 * @param {import('@prisma/client').ProjectUpdate} update
 * @param {string} caseReference
 * @returns {NSIPProjectUpdate}
 */
export function buildProjectUpdatePayload(update, caseReference) {
	/** @type {NSIPProjectUpdate} */
	const payload = {
		id: update.id,
		caseReference,
		updateContentEnglish: update.htmlContent,
		updateStatus: update.status
	};

	if (update.htmlContentWelsh) {
		payload.updateContentWelsh = update.htmlContentWelsh;
	}
	if (update.datePublished) {
		payload.updateDate = update.datePublished.toISOString();
	}
	if (update.title) {
		payload.updateName = update.title;
	}

	return payload;
}
