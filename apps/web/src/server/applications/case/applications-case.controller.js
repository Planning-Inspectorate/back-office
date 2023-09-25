import { publishCase } from '../common/services/case.service.js';

/** @typedef {import('../applications.types').Case} Case */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/**
 * @typedef {object} CasePageProps
 * @property {string} selectedPageType
 * @property {boolean} [isFirstTimePublished]
 * @property {boolean} [showPublishedBanner]
 * @property {ValidationErrors} [errors]
 */

/**
 * View the details for a single case
 *
 * @type {import('@pins/express').RenderHandler<CasePageProps, {}, {}, {}, {pageType?: string}>}
 */
export async function viewApplicationsCasePages({ params }, response) {
	const { pageType } = params;

	const selectedPageType = pageType ?? 'overview';

	response.render(`applications/case/${selectedPageType}`, {
		selectedPageType
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
 * @type {import('@pins/express').RenderHandler<CasePageProps, {}, {}, {}, {}>}
 */
export async function updateApplicationsCasePublishPage(request, response) {
	const { caseId, case: caseToPublish } = response.locals;
	const isAlreadyPublic = caseToPublish.publishedDate;
	const { publishedDate, errors } = await publishCase(caseId);

	response.locals.case = {
		...caseToPublish,
		publishedDate,
		hasUnpublishedChanges: false
	};

	if (errors) {
		return response.render(`applications/case/preview-and-publish`, {
			selectedPageType: 'preview-and-publish',
			errors
		});
	}

	response.render(`applications/case/project-information`, {
		selectedPageType: 'project-information',
		showPublishedBanner: true,
		isFirstTimePublished: !isAlreadyPublic
	});
}
