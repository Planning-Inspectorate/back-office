import { publishCase } from '../../lib/services/case.service.js';

/** @typedef {import('../../applications.types').Case} Case */

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * View the details for a single case
 *
 * @type {import('@pins/express').RenderHandler<{selectedPageType: string, showPublishedBanner: boolean, isFirstTimePublished: boolean}, {}, {}, {published?: string}, {pageType?: string}>}
 */
export async function viewApplicationsCasePages({ params, query }, response) {
	// note: case details for this case are held in response.locals.case
	const { pageType } = params;
	const { published } = query;
	const showPublishedBanner = published === '1' || published === '2';
	const isFirstTimePublished = published === '1';
	const selectedPageType = pageType ?? 'overview';

	response.render(`applications/case/${selectedPageType}`, {
		selectedPageType,
		showPublishedBanner,
		isFirstTimePublished
	});
}

/**
 * View page for previewing and publishing case
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewApplicationsCasePublishPage(request, response) {
	response.render(`applications/case/preview-and-publish`);
}

/**
 * Send publishing request with updated changes
 *
 * @type {import('@pins/express').RenderHandler<{errors?: ValidationErrors}, {}, {}, {}, {}>}
 */
export async function updateApplicationsCasePublishPage(request, response) {
	const { caseId, case: caseToPublish } = response.locals;
	const isAlreadyPublic = caseToPublish.publishedDate;
	const { errors } = await publishCase(caseId);

	if (errors) {
		response.render(`applications/case/preview-and-publish`, { errors });
	}

	response.redirect(`../${caseId}/project-information?published=${isAlreadyPublic ? 2 : 1}`);
}
