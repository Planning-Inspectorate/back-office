import { request } from '#app-test';
const { databaseConnector } = await import('#utils/database-connector.js');
const { eventClient } = await import('#infrastructure/event-client.js');

describe('Mark-as-published', () => {
	test('Marks a document as published', async () => {
		// Arrange

		const caseId = 1;
		const documentGuid = '1111-2222-3333';

		const documentFolder = {
			displayNameEn: 'Project documentation',
			case: {
				id: 1,
				reference: 'TR010001',
				CaseStatus: [{ id: 1, status: 'pre-application' }]
			}
		};

		const updatedDocument = {
			Document: {
				guid: documentGuid,
				documentReference: 'TR0110001-000017',
				caseId: 1,
				folderId: 1111,
				folder: documentFolder
			},
			version: 1,
			description: 'file to be published',
			originalFilename: 'original_filename.pdf',
			fileName: 'filename.pdf',
			size: 23452,
			mime: 'application/pdf',
			fileMD5: 'b1946ac92492d2347c6235b4d2611184',
			virusCheckStatus: 'scanned',
			dateCreated: new Date('2023-03-26T00:00:00.000Z'),
			lastModified: null,
			privateBlobContainer: 'document-uploads',
			privateBlobPath: 'published/en010120-filename.pdf',
			publishedBlobContainer: 'document-uploads',
			publishedBlobPath: 'published/en010120-filename.pdf',
			publishedStatus: 'published',
			redactedStatus: 'not_redacted',
			horizonDataID: null,
			transcriptGuid: null,
			examinationRefNo: null,
			documentType: 'Rule 8 letter',
			securityClassification: 'public',
			sourceSystem: 'back-office-applications',
			origin: 'pins',
			owner: 'owner1',
			author: 'author1',
			representative: 'ZZZ Agency',
			filter1: 'Deadline 2',
			filter2: 'Scoping Option Report'
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

		const includeFullDocument = {
			Document: {
				include: {
					folder: {
						include: {
							case: {
								include: {
									CaseStatus: true
								}
							}
						}
					}
				}
			}
		};

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.document.findUnique.mockResolvedValue(documentWithVersions);
		databaseConnector.folder.findUnique.mockResolvedValue(documentFolder);
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
			include: includeFullDocument,
			where: {
				documentGuid_version: {
					documentGuid: documentGuid,
					version: 1
				}
			}
		});

		const expectedEventPayload = {
			caseRef: 'TR010001',
			caseId: 1,
			documentId: documentGuid,
			documentReference: 'TR0110001-000017',
			description: 'file to be published',
			version: 1,
			filename: 'filename.pdf',
			originalFilename: 'original_filename.pdf',
			size: 23452,
			documentURI: 'https://127.0.0.1:10000/document-uploads/published/en010120-filename.pdf',
			publishedDocumentURI:
				'https://127.0.0.1:10000/document-uploads/published/en010120-filename.pdf',
			dateCreated: '2023-03-26T00:00:00.000Z',
			path: 'TR010001/Project documentation/filename.pdf',
			caseType: 'nsip',
			datePublished: null,
			lastModified: null,
			documentCaseStage: null,
			transcriptId: null,
			horizonFolderId: null,
			examinationRefNo: null,
			documentType: 'Rule 8 letter',
			securityClassification: 'public',
			sourceSystem: 'back-office-applications',
			origin: 'pins',
			owner: 'owner1',
			author: 'author1',
			representative: 'ZZZ Agency',
			filter1: 'Deadline 2',
			filter2: 'Scoping Option Report',
			mime: 'application/pdf',
			fileMD5: 'b1946ac92492d2347c6235b4d2611184',
			virusCheckStatus: 'scanned',
			publishedStatus: 'published',
			redactedStatus: 'not_redacted'
		};

		expect(response.status).toEqual(200);

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-document',
			[expectedEventPayload],
			'Publish',
			{}
		);
	});
});
