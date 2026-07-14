import { jest } from '@jest/globals';
import { request } from '#app-test';
const { databaseConnector } = await import('#utils/database-connector.js');

describe('Published GIS boundary documents', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('returns published GIS boundary GeoJSON document metadata', async () => {
		// GIVEN
		const publishedGisBoundaryDocument = {
			guid: '1234',
			caseId: 1,
			documentType: 'GIS shapefile',
			isDeleted: false,
			case: {
				id: 1,
				reference: 'EN0110001',
				title: 'EN0110001 - NI Case 3 Name'
			},
			documentVersion: [
				{
					documentGuid: '1234',
					version: 2,
					publishedStatus: 'published',
					isDeleted: false,
					mime: 'application/geo+json',
					publishedBlobContainer: 'published-documents',
					publishedBlobPath: 'gis-boundaries/EN0110001-boundary.geojson',
					datePublished: '2026-05-05T10:00:00.000Z'
				}
			]
		};

		databaseConnector.document.findMany.mockResolvedValue([publishedGisBoundaryDocument]);

		// WHEN
		const response = await request.get('/applications/documents/gis-boundaries/published');

		// THEN
		expect(response.status).toEqual(200);

		expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
			where: {
				isDeleted: false,
				documentVersion: {
					some: {
						publishedStatus: 'published',
						documentType: 'GIS shapefile',
						isDeleted: false,
						publishedBlobContainer: { not: null },
						publishedBlobPath: { not: null },
						mime: 'application/geo+json'
					}
				}
			},
			include: {
				case: {
					select: {
						id: true,
						reference: true,
						title: true
					}
				},
				documentVersion: {
					where: {
						publishedStatus: 'published',
						documentType: 'GIS shapefile',
						isDeleted: false,
						publishedBlobContainer: { not: null },
						publishedBlobPath: { not: null },
						mime: 'application/geo+json'
					},
					orderBy: {
						version: 'desc'
					},
					take: 1
				}
			}
		});

		expect(response.body).toEqual([
			{
				caseId: 1,
				caseReference: 'EN0110001',
				projectName: 'EN0110001 - NI Case 3 Name',
				documentGuid: '1234',
				version: 2,
				publishedBlobContainer: 'published-documents',
				publishedBlobPath: 'gis-boundaries/EN0110001-boundary.geojson',
				datePublished: '2026-05-05T10:00:00.000Z'
			}
		]);
	});

	test('returns an empty array when there are no published GIS boundary documents', async () => {
		// GIVEN
		databaseConnector.document.findMany.mockResolvedValue([]);

		// WHEN
		const response = await request.get('/applications/documents/gis-boundaries/published');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([]);
	});
});
