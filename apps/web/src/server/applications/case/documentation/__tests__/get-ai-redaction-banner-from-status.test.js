//@ts-nocheck
import { getAiRedactionBannerFromStatus } from '../utils/get-ai-redaction-banner-from-status.js';

describe('getAiRedactionBannerFromStatus', () => {
	const caseId = 100;
	const folderId = 200;

	it('returns success banner with link when status is ai_suggestions_review_required', () => {
		const documentationFile = {
			documentGuid: 'doc-123',
			redactedStatus: 'ai_suggestions_review_required'
		};

		const result = getAiRedactionBannerFromStatus(documentationFile, caseId, folderId);

		expect(result).toMatchObject({
			type: 'success',
			header: 'Redaction suggestions created',
			link: {
				text: 'Review redactions'
			}
		});

		expect(result.link.href).toBeDefined();
	});

	it('returns error banner when status is ai_redaction_failed', () => {
		const documentationFile = {
			documentGuid: 'doc-123',
			redactedStatus: 'ai_redaction_failed'
		};

		const result = getAiRedactionBannerFromStatus(documentationFile, caseId, folderId);

		expect(result).toEqual({
			type: 'error',
			header: '',
			message: 'AI redaction failed - try again'
		});
	});

	it('returns info banner when status is awaiting_ai_suggestions', () => {
		const documentationFile = {
			documentGuid: 'doc-123',
			redactedStatus: 'awaiting_ai_suggestions'
		};

		const result = getAiRedactionBannerFromStatus(documentationFile, caseId, folderId);

		expect(result).toEqual({
			type: 'info',
			header: 'Making redaction suggestions, check back later',
			message: ''
		});
	});

	it('returns undefined for unknown status', () => {
		const documentationFile = {
			documentGuid: 'doc-123',
			redactedStatus: 'unknown_status'
		};

		const result = getAiRedactionBannerFromStatus(documentationFile, caseId, folderId);

		expect(result).toBeUndefined();
	});
});
