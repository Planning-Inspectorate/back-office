import { Readable } from 'node:stream';
import { jest } from '@jest/globals';

const mockGetPublishedGisBoundaryDocuments = jest.fn();
const mockUploadStream = jest.fn();
const mockDownloadStream = jest.fn();

jest.unstable_mockModule('../../gis-boundary-api-client.js', () => ({
	getPublishedGisBoundaryDocuments: mockGetPublishedGisBoundaryDocuments
}));

jest.unstable_mockModule('../../blob-client.js', () => ({
	blobClient: {
		uploadStream: mockUploadStream,
		downloadStream: mockDownloadStream
	}
}));

jest.unstable_mockModule('../../config.js', () => ({
	default: {
		BLOB_PUBLISH_CONTAINER: 'published-documents'
	}
}));

const { assertValidGeoJsonFeatureCollection, rebuildMasterGeoJson } = await import(
	'../master-geojson.js'
);

describe('master-geojson', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('throws when GeoJSON is not a FeatureCollection', () => {
		expect(() => assertValidGeoJsonFeatureCollection({ type: 'Feature' })).toThrow(
			'Invalid GeoJSON FeatureCollection'
		);
	});

	test('rebuilds the master GeoJSON from published GIS boundary documents', async () => {
		// GIVEN
		mockGetPublishedGisBoundaryDocuments.mockResolvedValue([
			{
				caseId: 1,
				caseReference: 'EN0110001',
				projectName: 'Project One',
				documentGuid: 'D1234',
				version: 2,
				publishedBlobContainer: 'published-documents',
				publishedBlobPath: 'gis-boundaries/project-one.geojson'
			},
			{
				caseId: 2,
				caseReference: 'EN0110002',
				projectName: 'Project Two',
				documentGuid: 'D5678',
				version: 1,
				publishedBlobContainer: 'published-documents',
				publishedBlobPath: 'gis-boundaries/project-two.geojson'
			}
		]);

		const projectOneGeoJson = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {
						caseReference: 'EN0110001',
						projectName: 'Project One'
					},
					geometry: {
						type: 'Polygon',
						coordinates: []
					}
				}
			]
		};

		const projectTwoGeoJson = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {
						caseReference: 'EN0110002',
						projectName: 'Project Two'
					},
					geometry: {
						type: 'Polygon',
						coordinates: []
					}
				}
			]
		};

		mockDownloadStream
			.mockResolvedValueOnce({
				readableStreamBody: Readable.from([Buffer.from(JSON.stringify(projectOneGeoJson))])
			})
			.mockResolvedValueOnce({
				readableStreamBody: Readable.from([Buffer.from(JSON.stringify(projectTwoGeoJson))])
			});

		let uploadedJson = '';

		mockUploadStream.mockImplementation(async (_container, stream) => {
			for await (const chunk of stream) {
				uploadedJson += chunk.toString();
			}
		});

		const mockLog = {
			info: jest.fn()
		};

		// WHEN
		await rebuildMasterGeoJson(mockLog);

		// THEN
		expect(mockGetPublishedGisBoundaryDocuments).toHaveBeenCalledTimes(1);

		expect(mockDownloadStream).toHaveBeenCalledTimes(2);

		expect(mockDownloadStream).toHaveBeenNthCalledWith(
			1,
			'published-documents',
			'gis-boundaries/project-one.geojson'
		);

		expect(mockDownloadStream).toHaveBeenNthCalledWith(
			2,
			'published-documents',
			'gis-boundaries/project-two.geojson'
		);

		expect(mockUploadStream).toHaveBeenCalledWith(
			'published-documents',
			expect.anything(),
			'gis-boundaries/all-project-boundaries.geojson',
			'application/geo+json'
		);

		const parsedMasterGeoJson = JSON.parse(uploadedJson);

		expect(parsedMasterGeoJson).toEqual({
			type: 'FeatureCollection',
			features: [
				expect.objectContaining({
					properties: expect.objectContaining({
						caseReference: 'EN0110001',
						projectName: 'Project One'
					})
				}),
				expect.objectContaining({
					properties: expect.objectContaining({
						caseReference: 'EN0110002',
						projectName: 'Project Two'
					})
				})
			]
		});
	});

	test('throws when upload fails', async () => {
		mockGetPublishedGisBoundaryDocuments.mockResolvedValue([]);

		mockUploadStream.mockRejectedValue(new Error('Upload failed'));

		await expect(
			rebuildMasterGeoJson({
				info: jest.fn()
			})
		).rejects.toThrow('Upload failed');
	});

	test('throws when downloaded blob contains invalid JSON', async () => {
		mockGetPublishedGisBoundaryDocuments.mockResolvedValue([
			{
				caseReference: 'EN0110001',
				publishedBlobContainer: 'published-documents',
				publishedBlobPath: 'gis-boundaries/project-one.geojson'
			}
		]);

		mockDownloadStream.mockResolvedValue({
			readableStreamBody: Readable.from([Buffer.from('{invalid-json')])
		});

		await expect(
			rebuildMasterGeoJson({
				info: jest.fn()
			})
		).rejects.toThrow();
	});

	test('throws when downloaded project GeoJSON is invalid', async () => {
		mockGetPublishedGisBoundaryDocuments.mockResolvedValue([
			{
				caseReference: 'EN0110001',
				publishedBlobContainer: 'published-documents',
				publishedBlobPath: 'gis-boundaries/project-one.geojson'
			}
		]);

		mockDownloadStream.mockResolvedValue({
			readableStreamBody: Readable.from([Buffer.from(JSON.stringify({ type: 'Feature' }))])
		});

		await expect(
			rebuildMasterGeoJson({
				info: jest.fn()
			})
		).rejects.toThrow('Invalid GeoJSON FeatureCollection');
	});
});
