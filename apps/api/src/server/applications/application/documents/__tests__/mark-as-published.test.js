import { request } from '#app-test';
const { databaseConnector } = await import('#utils/database-connector.js');
const { eventClient } = await import('#infrastructure/event-client.js');

describe('Mark-as-published', () => {
	test('Marks a document as published', async () => {
		// Arrange

		const caseId = 1;
		const documentGuid = '1111-2222-3333';

		const updatedDocument = {
			Document: {
				guid: documentGuid
			},
			version: 1,
			originalFilename: 'original_filename.pdf',
			fileName: 'filename.pdf',
			size: 23452,
			dateCreated: new Date('2023-03-26T00:00:00.000Z'),
			privateBlobContainer: 'document-uploads',
			privateBlobPath: 'published/en010120-filename.pdf',
			publishedBlobContainer: 'document-uploads',
			publishedBlobPath: 'published/en010120-filename.pdf'
		};

		const documentWithVersions = {
			guid: documentGuid,
			reference: 'BC0110001-000003',
			documentName: 'test',
			folderId: 1111,
			caseId: caseId,
			documentSize: 1111,
			documentType: 'test',
			latestVersionId: 1,
			fromFrontOffice: false,
			documentVersion: [
				{
					documentGuid: documentGuid,
					version: 1,
					author: 'test',
					publishedStatus: 'published',
					fileName: 'Small',
					mime: 'application/pdf',
					size: 7945,
					owner: 'William Wordsworth'
				}
			]
		};

		const application1 = {
			id: caseId,
			reference: 'BC0110001',
			modifiedAt: '2024-01-17T14:32:37.530Z',
			createdAt: '2024-01-16T16:44:26.710Z',
			description:
				'A description of test case 1 which is a case of subsector type Office Use. A David case',
			title: 'Office Use Test Application 1',
			hasUnpublishedChanges: true,
			applicantId: 100000000,
			ApplicationDetails: {
				id: 100000000,
				caseId: caseId,
				subSectorId: 1,
				locationDescription: null,
				zoomLevelId: 4,
				caseEmail: null,
				subSector: {
					id: 1,
					abbreviation: 'BC01',
					name: 'office_use',
					displayNameEn: 'Office Use',
					displayNameCy: 'Office Use',
					sectorId: 1,
					sector: {
						id: 1,
						abbreviation: 'BC',
						name: 'business_and_commercial',
						displayNameEn: 'Business and Commercial',
						displayNameCy: 'Business and Commercial'
					}
				}
			}
		};

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.document.findUnique.mockResolvedValue(documentWithVersions);
		databaseConnector.documentVersion.findUnique.mockResolvedValue(updatedDocument);
		databaseConnector.documentVersion.update.mockResolvedValue(updatedDocument);

		// Act
		const response = await request
			.post('/applications/1/documents/1111-2222-3333/version/1/mark-as-published')
			.send({
				publishedBlobPath: 'published/en010120-filename.pdf',
				publishedBlobContainer: 'published-documents',
				publishedDate: new Date('2023-01-01T00:00:00Z')
			});

		// Assert

		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			data: {
				datePublished: new Date('2023-01-01T00:00:00Z'),
				publishedBlobContainer: 'published-documents',
				publishedBlobPath: 'published/en010120-filename.pdf',
				publishedStatus: 'published',
				publishedStatusPrev: 'publishing'
			},
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			where: {
				documentGuid_version: {
					documentGuid: documentGuid,
					version: 1
				}
			}
		});

		const expectedEventPayload = {
			documentId: documentGuid,
			version: 1,
			filename: 'filename.pdf',
			originalFilename: 'original_filename.pdf',
			size: 23452,
			documentURI: 'https://127.0.0.1:10000/document-uploads/published/en010120-filename.pdf',
			publishedDocumentURI:
				'https://127.0.0.1:10000/document-uploads/published/en010120-filename.pdf',
			dateCreated: '2023-03-26T00:00:00.000Z'
		};

		expect(response.status).toEqual(200);

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-document',
			[expectedEventPayload],
			'Publish'
		);
	});
});
