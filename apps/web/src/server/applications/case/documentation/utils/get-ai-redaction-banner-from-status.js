import { url } from '../../../../lib/nunjucks-filters/index.js';

/**
 * @param {import('../../../applications.types').DocumentationFile} documentationFile
 * @param {number} caseId
 * @param {number} folderId
 * @returns {{
 * 	type: string,
 * 	header: string,
 * 	message?: string,
 * 	link?: { text: string, href: string }
 * 	} | undefined}
 */
export const getAiRedactionBannerFromStatus = (documentationFile, caseId, folderId) => {
	switch (documentationFile.redactedStatus) {
		case 'ai_suggestions_review_required':
			return {
				type: 'success',
				header: 'Redaction suggestions created',
				link: {
					text: 'Review redactions',
					// this page does not exist and will likely need amending
					// depending on the route of the review page, but this is the general idea
					href: url('review-document-redaction', {
						caseId,
						folderId,
						documentGuid: documentationFile.documentGuid,
						step: 'review-redactions'
					})
				}
			};

		case 'ai_redaction_failed':
			return {
				type: 'error',
				header: '',
				message: 'AI redaction failed - try again'
			};

		case 'awaiting_ai_suggestions':
			return {
				type: 'info',
				header: 'Making redaction suggestions, check back later',
				message: ''
			};

		default:
			return undefined;
	}
};
