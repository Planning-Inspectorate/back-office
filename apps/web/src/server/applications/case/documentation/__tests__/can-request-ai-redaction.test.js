import { canRequestAiRedaction } from '../utils/can-request-ai-redaction.js';

import { fixtureReadyToPublishDocumentationPdfFile } from '../../../../../../testing/applications/fixtures/documentation-files.js';

describe('canRequestAiRedaction', () => {
	const baseDocument = {
		...fixtureReadyToPublishDocumentationPdfFile,
		redactedStatus: 'not_redacted'
	};

	it('returns true for a PDF with an eligible redactedStatus', () => {
		const document = {
			...baseDocument,
			redactedStatus: 'not_redacted'
		};

		expect(canRequestAiRedaction(document)).toBe(true);
	});

	it('returns false when mime type is not PDF', () => {
		const document = {
			...baseDocument,
			mime: 'image/png'
		};

		expect(canRequestAiRedaction(document)).toBe(false);
	});

	it.each(['awaiting_ai_redaction', 'ai_redaction_review_required'])(
		'returns false when redactedStatus is %s',
		(status) => {
			const document = {
				...baseDocument,
				redactedStatus: status
			};

			expect(canRequestAiRedaction(document)).toBe(false);
		}
	);

	it('returns true for other redactedStatus values', () => {
		const document = {
			...baseDocument,
			redactedStatus: 'ai_redaction_failed'
		};

		expect(canRequestAiRedaction(document)).toBe(true);
	});
});
