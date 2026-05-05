import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DocumentPublishedStatus } from '../../../constants.js';

const { databaseConnector } = await import('#utils/database-connector.js');

jest.mock('#infrastructure/event-broadcasters.js', () => ({
	broadcastNsipDocumentEvent: jest.fn().mockResolvedValue(undefined)
}));

import {
	isDocumentInGisShapefilesFolder,
	markDocumentAsInvalid
} from '../shapefile-processing.service.js';

describe('isDocumentInGisShapefilesFolder', () => {
	beforeEach(() => jest.clearAllMocks());

	it('returns true when document is in GIS Shapefiles folder', async () => {
		databaseConnector.document.findUnique.mockResolvedValue({ guid: 'test-guid', folderId: 42 });
		databaseConnector.folder.findUnique.mockResolvedValue({
			id: 42,
			displayNameEn: 'GIS Shapefiles'
		});

		const result = await isDocumentInGisShapefilesFolder('test-guid');
		expect(result).toBe(true);
	});

	it('returns false when document is in a different folder', async () => {
		databaseConnector.document.findUnique.mockResolvedValue({ guid: 'test-guid', folderId: 10 });
		databaseConnector.folder.findUnique.mockResolvedValue({
			id: 10,
			displayNameEn: 'Pre-application'
		});

		const result = await isDocumentInGisShapefilesFolder('test-guid');
		expect(result).toBe(false);
	});

	it('returns false when document is not found', async () => {
		databaseConnector.document.findUnique.mockResolvedValue(null);

		const result = await isDocumentInGisShapefilesFolder('missing-guid');
		expect(result).toBe(false);
	});
});

describe('markDocumentAsInvalid', () => {
	beforeEach(() => jest.clearAllMocks());

	it('updates document version status to invalid and creates activity log', async () => {
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'test-guid',
			latestVersionId: 1
		});
		databaseConnector.documentVersion.update.mockResolvedValue({
			documentGuid: 'test-guid',
			version: 1,
			publishedStatus: DocumentPublishedStatus.INVALID
		});
		databaseConnector.documentActivityLog.create.mockResolvedValue({});

		await markDocumentAsInvalid('test-guid');

		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { documentGuid_version: { documentGuid: 'test-guid', version: 1 } },
				data: expect.objectContaining({
					publishedStatus: DocumentPublishedStatus.INVALID,
					publishedStatusPrev: DocumentPublishedStatus.NOT_CHECKED
				})
			})
		);
		expect(databaseConnector.documentActivityLog.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					status: DocumentPublishedStatus.INVALID,
					user: 'System'
				})
			})
		);
	});

	it('does nothing when document is not found', async () => {
		databaseConnector.document.findUnique.mockResolvedValue(null);

		await markDocumentAsInvalid('missing-guid');

		expect(databaseConnector.documentVersion.update).not.toHaveBeenCalled();
	});
});
