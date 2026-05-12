import { jest } from '@jest/globals';
import { index } from '../index.js';
import { blobClient } from '../../common/blob-client.js';
import { notifyShapefileProcessingResult } from '../src/back-office-api-client.js';
import { validateShapefileContents } from '../src/validate-shapefile.js';
import { shpZipToGeoJson } from '../src/convert-shapefile.js';
import { validateConvertedGeoJson } from '../src/validate-geojson.js';
import { applyGeoJsonMetadata } from '../src/apply-geojson-metadata.js';

jest.mock('../../common/blob-client.js');
jest.mock('../src/back-office-api-client.js');
jest.mock('../src/validate-shapefile.js');
jest.mock('../src/convert-shapefile.js');
jest.mock('../src/validate-geojson.js');
jest.mock('../src/apply-geojson-metadata.js');

describe('process-shapefile function', () => {
	const context = {
		log: Object.assign(jest.fn(), {
			warn: jest.fn(),
			error: jest.fn(),
			info: jest.fn()
		})
	};

	const documentId = 'guid';
	const caseId = 123;
	const documentURI = 'https://storage.example.com/container/application/BC0110001/guid/1/test.zip';
	const message = {
		documentId,
		caseId,
		caseRef: 'BC0110001',
		documentURI,
		originalFilename: 'test.zip',
		dateCreated: '2024-01-31T14:18:26.889Z'
	};

	beforeEach(() => {
		jest.clearAllMocks();
		validateConvertedGeoJson.mockReturnValue({ valid: true, reason: null });
	});

	test('should process a valid shapefile ZIP and notify API', async () => {
		// GIVEN
		const zipBuffer = Buffer.from('zip-content');
		blobClient.downloadStream.mockResolvedValue({
			readableStreamBody: (async function* () {
				yield zipBuffer;
			})()
		});
		validateShapefileContents.mockResolvedValue({
			valid: true,
			missingExtensions: [],
			fileNames: ['test.shp', 'test.shx', 'test.dbf'],
			parseError: null
		});
		shpZipToGeoJson.mockResolvedValue({ type: 'FeatureCollection', features: [] });
		applyGeoJsonMetadata.mockReturnValue({ type: 'FeatureCollection', features: [], metadata: {} });

		// WHEN
		await index(context, message);

		// THEN
		expect(blobClient.downloadStream).toHaveBeenCalledWith(
			'document-service-uploads',
			'application/BC0110001/guid/1/test.zip'
		);
		expect(validateShapefileContents).toHaveBeenCalledWith(zipBuffer);
		expect(shpZipToGeoJson).toHaveBeenCalledWith(zipBuffer);
		expect(blobClient.uploadStream).toHaveBeenCalled();
		expect(notifyShapefileProcessingResult).toHaveBeenCalledWith(
			caseId,
			documentId,
			expect.objectContaining({
				geoJsonFileName: 'test.geojson'
			})
		);
	});

	test('should mark as invalid and NOT re-throw on validation error', async () => {
		// GIVEN
		blobClient.downloadStream.mockResolvedValue({
			readableStreamBody: (async function* () {
				yield Buffer.from('zip');
			})()
		});
		validateShapefileContents.mockResolvedValue({
			valid: false,
			missingExtensions: ['.dbf'],
			fileNames: ['test.shp', 'test.shx'],
			parseError: null
		});

		// WHEN
		await index(context, message);

		// THEN
		expect(notifyShapefileProcessingResult).toHaveBeenCalledWith(caseId, documentId, {
			invalid: true
		});
		expect(context.log.warn).toHaveBeenCalledWith(
			expect.stringContaining('Validation failure'),
			expect.anything()
		);
	});

	test('should mark as invalid when converted GeoJSON fails sanity validation', async () => {
		blobClient.downloadStream.mockResolvedValue({
			readableStreamBody: (async function* () {
				yield Buffer.from('zip');
			})()
		});
		validateShapefileContents.mockResolvedValue({
			valid: true,
			missingExtensions: [],
			fileNames: ['test.shp', 'test.shx', 'test.dbf'],
			parseError: null
		});
		shpZipToGeoJson.mockResolvedValue({ type: 'NotGeoJson' });
		validateConvertedGeoJson.mockReturnValue({
			valid: false,
			reason: 'invalid or missing GeoJSON type'
		});

		await index(context, message);

		expect(blobClient.uploadStream).not.toHaveBeenCalled();
		expect(notifyShapefileProcessingResult).toHaveBeenCalledWith(caseId, documentId, {
			invalid: true
		});
	});

	test('should mark as invalid and NOT re-throw when ZIP parsing fails', async () => {
		blobClient.downloadStream.mockResolvedValue({
			readableStreamBody: (async function* () {
				yield Buffer.from('not-a-valid-shapefile-zip');
			})()
		});
		validateShapefileContents.mockResolvedValue({
			valid: false,
			missingExtensions: ['.shp', '.shx', '.dbf'],
			fileNames: [],
			parseError: 'no layers founds'
		});

		await index(context, message);

		expect(notifyShapefileProcessingResult).toHaveBeenCalledWith(caseId, documentId, {
			invalid: true
		});
		expect(context.log.error).not.toHaveBeenCalledWith(
			expect.stringContaining('Infrastructure error processing document')
		);
	});

	test('should re-throw on infrastructure error (e.g. download failed)', async () => {
		// GIVEN
		blobClient.downloadStream.mockRejectedValue(new Error('Network error'));

		// WHEN & THEN
		await expect(index(context, message)).rejects.toThrow('Network error');
		expect(notifyShapefileProcessingResult).not.toHaveBeenCalled();
	});

	test('should skip if required fields are missing in message', async () => {
		const invalidMessage = { documentId: 'guid' }; // missing caseId, documentURI

		await index(context, invalidMessage);

		expect(blobClient.downloadStream).not.toHaveBeenCalled();
		expect(context.log.warn).toHaveBeenCalledWith(
			expect.stringContaining('Missing required fields'),
			expect.anything()
		);
	});
});
