import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DocumentPublishedStatus } from '../../../constants.js';

const { databaseConnector } = await import('#utils/database-connector.js');

jest.mock('#infrastructure/event-broadcasters.js', () => ({
	broadcastNsipDocumentEvent: jest.fn().mockResolvedValue(undefined)
}));

import {
	isDocumentInGisShapefilesFolder,
	markDocumentAsInvalid,
	createGeoJsonDocumentVersion
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
		databaseConnector.documentVersion.findUnique.mockResolvedValue(null);
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
		expect(databaseConnector.documentVersion.findUnique).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { documentGuid_version: { documentGuid: 'test-guid', version: 1 } }
			})
		);
	});

	it('does nothing when document is not found', async () => {
		databaseConnector.document.findUnique.mockResolvedValue(null);

		await markDocumentAsInvalid('missing-guid');

		expect(databaseConnector.documentVersion.update).not.toHaveBeenCalled();
	});
});

describe('createGeoJsonDocumentVersion', () => {
	beforeEach(() => jest.clearAllMocks());

	const baseParams = {
		documentGuid: 'doc-guid',
		caseId: 1,
		geoJsonFileName: 'boundary.geojson',
		geoJsonBlobPath: 'path/to/boundary.geojson',
		blobContainer: 'uploads',
		geoJsonSizeBytes: 2048
	};

	const mockCase = {
		id: 1,
		reference: 'EN010001',
		description: 'Test project description',
		applicant: { organisationName: 'Test Org' }
	};

	const mockDocument = {
		guid: 'doc-guid',
		latestVersionId: 1,
		documentVersion: [{ version: 1, filter1Welsh: null, authorWelsh: null }]
	};

	it('creates a new GeoJSON document version and updates latestVersionId', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(mockCase);
		databaseConnector.document.findUnique.mockResolvedValue(mockDocument);
		databaseConnector.documentVersion.upsert.mockResolvedValue({
			documentGuid: 'doc-guid',
			version: 2
		});
		databaseConnector.document.update.mockResolvedValue({});
		databaseConnector.documentActivityLog.create.mockResolvedValue({});
		// getById call to broadcast
		databaseConnector.documentVersion.findUnique.mockResolvedValue(null);

		await createGeoJsonDocumentVersion(baseParams);

		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				create: expect.objectContaining({
					version: 2,
					fileName: 'boundary.geojson',
					mime: 'application/geo+json',
					originalFilename: 'boundary.geojson',
					size: 2048,
					privateBlobPath: 'path/to/boundary.geojson',
					privateBlobContainer: 'uploads',
					redactedStatus: 'no_redaction_required',
					publishedStatus: DocumentPublishedStatus.NOT_CHECKED
				})
			})
		);

		expect(databaseConnector.document.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { guid: 'doc-guid' },
				data: expect.objectContaining({ latestVersionId: 2 })
			})
		);
	});

	it('throws when case is not found', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		databaseConnector.document.findUnique.mockResolvedValue(mockDocument);

		await expect(createGeoJsonDocumentVersion(baseParams)).rejects.toThrow('Case not found: 1');
	});

	it('throws when document is not found', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(mockCase);
		databaseConnector.document.findUnique.mockResolvedValue(null);

		await expect(createGeoJsonDocumentVersion(baseParams)).rejects.toThrow(
			'Document not found: doc-guid'
		);
	});
});
