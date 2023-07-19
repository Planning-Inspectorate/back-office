import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
import { contentIsSafe } from './project-updates.validators.js';
import BackOfficeAppError from '#utils/app-error.js';

/**
 * Map a project update from the database to the type returned by the API
 *
 * @param {import('@prisma/client').ProjectUpdate} projectUpdate
 * @returns {import('@pins/applications').ProjectUpdate}
 */
export function mapProjectUpdate(projectUpdate) {
	// check HTML content is safe
	if (projectUpdate.htmlContent && !contentIsSafe(projectUpdate.htmlContent)) {
		throw newContentUnsafeError(projectUpdate.id);
	}
	if (projectUpdate.htmlContentWelsh && !contentIsSafe(projectUpdate.htmlContentWelsh)) {
		throw newContentUnsafeError(projectUpdate.id, 'Welsh');
	}

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
 * @throws {Error} if the HTML content isn't safe
 */
export function buildProjectUpdatePayload(update, caseReference) {
	/** @type {NSIPProjectUpdate} */
	const payload = {
		id: update.id,
		caseReference,
		updateContentEnglish: update.htmlContent,
		updateStatus: update.status
	};

	// check HTML content is safe
	if (!contentIsSafe(payload.updateContentEnglish)) {
		throw newContentUnsafeError(update.id);
	}

	if (update.htmlContentWelsh) {
		payload.updateContentWelsh = update.htmlContentWelsh;
		// check HTML content is safe
		if (!contentIsSafe(payload.updateContentWelsh)) {
			throw newContentUnsafeError(update.id, 'Welsh');
		}
	}
	if (update.datePublished) {
		payload.updateDate = update.datePublished.toISOString();
	}
	if (update.title) {
		payload.updateName = update.title;
	}

	return payload;
}

/**
 * Map a request body to a create request object, and sanitise the HTML
 *
 * @param {*} body
 * @param {number} caseId
 * @returns {import('@prisma/client').Prisma.ProjectUpdateCreateInput}
 */
export function projectUpdateCreateReq(body, caseId) {
	/** @type {import('@prisma/client').Prisma.ProjectUpdateCreateInput} */
	const createReq = {
		emailSubscribers: body.emailSubscribers,
		status: body.status,
		htmlContent: body.htmlContent,
		case: {
			connect: {
				id: caseId
			}
		}
	};
	if (body.authorId) {
		createReq.author = {
			connect: {
				id: parseInt(body.authorId)
			}
		};
	}
	if (body.title) {
		createReq.title = body.title;
	}
	if (body.htmlContentWelsh) {
		createReq.htmlContentWelsh = body.htmlContentWelsh;
	}

	return createReq;
}

/**
 * Map a request body to a update request object, and sanitise the HTML
 *
 * @param {*} body
 * @returns {import('@prisma/client').Prisma.ProjectUpdateUpdateInput}
 */
export function projectUpdateUpdateReq(body) {
	/** @type {import('@prisma/client').Prisma.ProjectUpdateUpdateInput} */
	const updateReq = {};
	if (Object.prototype.hasOwnProperty.call(body, 'emailSubscribers')) {
		updateReq.emailSubscribers = body.emailSubscribers;
	}
	if (body.status) {
		updateReq.status = body.status;
		if (updateReq.status === ProjectUpdate.Status.published) {
			updateReq.datePublished = new Date();
		}
	}
	if (body.title) {
		updateReq.title = body.title;
	}
	if (body.htmlContent) {
		updateReq.htmlContent = body.htmlContent;
	}
	if (body.htmlContentWelsh) {
		updateReq.htmlContentWelsh = body.htmlContentWelsh;
	}

	return updateReq;
}

/**
 *
 * @param {number} id
 * @param {string} language
 * @returns {UnsafeContentError}
 */
function newContentUnsafeError(id, language = 'English') {
	return new UnsafeContentError(`unsafe ${language} HTML content for update: ${id}`);
}

export class UnsafeContentError extends BackOfficeAppError {}
