import { jest } from '@jest/globals';
import { verifyAllDocumentsHaveRequiredPropertiesForPublishing } from '../document.validators.js';
import { featureFlagClient } from '#utils/feature-flags.js';
const { databaseConnector } = await import('#utils/database-connector.js');

const baseLatestDocumentVersion = {
	mime: 'application/pdf',
	filter1Welsh: null,
	authorWelsh: null,
	descriptionWelsh: null,
	redactedStatus: 'redacted',
	publishedStatus: 'ready_to_publish',
	Document: { case: { ApplicationDetails: { regions: [] } } }
};

beforeEach(() => {
	jest.clearAllMocks();
	jest.spyOn(featureFlagClient, 'isFeatureActive').mockResolvedValue(false);
});

describe('verifyAllDocumentsHaveRequiredPropertiesForPublishing', () => {
	it('treats a document as publishable when it is not already mid-publish', async () => {
		databaseConnector.document.findMany.mockResolvedValue([
			{ guid: 'doc-1', latestVersionId: 1, latestDocumentVersion: baseLatestDocumentVersion }
		]);

		const result = await verifyAllDocumentsHaveRequiredPropertiesForPublishing(['doc-1'], false);

		expect(result.publishable).toEqual([{ documentGuid: 'doc-1', version: 1 }]);
		expect(result.invalid).toEqual([]);
	});

	it('excludes a document already mid-publish and reports it as invalid, instead of resubmitting it (idas-679)', async () => {
		databaseConnector.document.findMany.mockResolvedValue([
			{
				guid: 'doc-1',
				latestVersionId: 2,
				latestDocumentVersion: { ...baseLatestDocumentVersion, publishedStatus: 'publishing' }
			}
		]);

		const result = await verifyAllDocumentsHaveRequiredPropertiesForPublishing(['doc-1'], false);

		expect(result.publishable).toEqual([]);
		expect(result.invalid).toEqual([
			{
				guid: 'doc-1',
				msg: 'This document is already being published - please wait for that to finish before trying again',
				type: 'already-publishing'
			}
		]);
	});
});
