import { publishCase } from '../../lib/services/case.service.js';

/** @typedef {import('../../applications.types').Case} Case */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * View the details for a single case
 *
 * @type {import('@pins/express').RenderHandler<{selectedPageType: string, showPublishedBanner: boolean}, {}, {}, {published?: string}, {pageType?: string}>}
 */
export async function viewApplicationsCasePages({ params, query }, response) {
	// note: case details for this case are held in response.locals.case
	const { pageType } = params;
	const showPublishedBanner = query.published === '';
	const selectedPageType = pageType ?? 'overview';

	response.render(`applications/case/${selectedPageType}`, {
		selectedPageType,
		showPublishedBanner
	});
}

/**
 * Send publishing request with updated changes
 *
 * @type {import('@pins/express').RenderHandler<{errors?: ValidationErrors}, {}, {}, {}, {}>}
 */
export async function updateApplicationsCasePublishPage(request, response) {
	const { caseId } = response.locals;
	const { errors } = await publishCase(caseId);

	if (errors) {
		response.render(`applications/case/preview-and-publish`, { errors });
	}

	response.redirect(`../${caseId}/project-information?published`);
}
