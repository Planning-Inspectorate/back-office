const { databaseConnector } = await import('#utils/database-connector.js');
import { jest } from '@jest/globals';
import { request } from '#app-test';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_DOCUMENT } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';

const application1 = {
	id: 100000000,
	documentReference: 'BC0110001',
	modifiedAt: '2024-01-17T14:32:37.530Z',
	createdAt: '2024-01-16T16:44:26.710Z',
	description:
		'A description of test case 1 which is a case of subsector type Office Use. A David case',
	title: 'Office Use Test Application 1',
	hasUnpublishedChanges: true,
	applicantId: 100000000,
	ApplicationDetails: {
		id: 100000000,
		caseId: 100000000,
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
const DocumentToDelete = {
	guid: '1111-2222-3333',
	documentReference: 'BC0110001-000004',
	folderId: 10003,
	createdAt: '2024-01-31T14:18:26.834Z',
	isDeleted: true,
	latestVersionId: 1,
	caseId: 100000000,
	documentType: 'document',
	fromFrontOffice: false
};

const documentVersionWithDocumentToDelete = {
	guid: '1111-2222-3333',
	version: 1,
	lastModified: null,
	documentType: null,
	published: false,
	sourceSystem: 'back-office-applications',
	origin: null,
	originalFilename: 'Small.pdf',
	fileName: 'Small',
	representative: null,
	description: 'desc',
	owner: 'Genoveva Glover',
	author: 'Billy',
	securityClassification: null,
	mime: 'application/pdf',
	horizonDataID: null,
	fileMD5: null,
	virusCheckStatus: null,
	size: 7945,
	stage: null,
	filter1: 'Filter 1',
	privateBlobContainer: 'document-service-uploads',
	privateBlobPath: '/application/BC010001/1111-2222-3333/1',
	publishedBlobContainer: 'published-documents',
	publishedBlobPath: 'published/BC010001-Small.pdf',
	dateCreated: new Date('2023-02-27T10:00:00Z'),
	datePublished: new Date('2023-02-27T10:00:00Z'),
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'not_checked',
	publishedStatusPrev: 'not_checked',
	redactedStatus: null,
	redacted: false,
	transcriptGuid: null,
	Document: {
		guid: '1111-2222-3333',
		documentReference: 'BC010001-000002',
		folderId: 1,
		createdAt: '2022-12-12 17:12:25.9610000',
		isDeleted: false,
		latestVersionId: 1,
		caseId: 100000001,
		documentType: 'document',
		fromFrontOffice: false,
		folder: {
			id: 10003,
			displayNameEn: 'Project management',
			displayOrder: 100,
			parentFolderId: null,
			caseId: 100000001,
			stage: null,
			case: {
				id: 100000001,
				reference: 'BC010001'
			}
		}
	},
	DocumentActivityLog: [],
	transcript: null
};
const publishedDoc = {
	...documentVersionWithDocumentToDelete,
	published: true,
	publishedStatus: 'published'
};

const expectedDeleteMessagePayload = {
	documentId: '1111-2222-3333',
	version: 1,
	filename: 'Small',
	originalFilename: 'Small.pdf',
	size: 7945,
	documentURI:
		'https://127.0.0.1:10000/document-service-uploads/application/BC010001/1111-2222-3333/1',
	publishedDocumentURI: 'https://127.0.0.1:10000/published-documents/published/BC010001-Small.pdf',
	dateCreated: '2023-02-27T10:00:00.000Z',
	datePublished: '2023-02-27T10:00:00.000Z',
	caseId: 100000001,
	documentReference: 'BC010001-000002',
	mime: 'application/pdf',
	publishedStatus: 'not_checked',
	sourceSystem: 'back-office-applications',
	owner: 'Genoveva Glover',
	author: 'Billy',
	description: 'desc',
	filter1: 'Filter 1'
};

describe('delete Document', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('The test case involves deleting a document setting its "isDeleted" property to "true".', async () => {
		// GIVEN
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			documentVersionWithDocumentToDelete
		);
		databaseConnector.document.findUnique.mockResolvedValue(DocumentToDelete);
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		const isDeleted = true;

		// WHEN
		const response = await request
			.post('/applications/100000001/documents/1111-2222-3333/delete')
			.send({});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ isDeleted });
		expect(databaseConnector.documentVersion.findUnique).toHaveBeenCalledWith({
			include: {
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
				},
				DocumentActivityLog: {
					orderBy: {
						createdAt: 'desc'
					}
				},
				transcript: {
					select: {
						documentReference: true
					}
				}
			},
			where: {
				documentGuid_version: { documentGuid: '1111-2222-3333', version: 1 }
			}
		});

		expect(databaseConnector.document.delete).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333'
			}
		});

		// and test broadcast event message
		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			NSIP_DOCUMENT,
			[expectedDeleteMessagePayload],
			EventType.Delete,
			{}
		);
	});

	test('should fail to delete document because document is published', async () => {
		// GIVEN
		databaseConnector.documentVersion.findUnique.mockResolvedValue(publishedDoc);

		// WHEN
		const response = await request
			.post('/applications/100000001/documents/1111-2222-3333/delete')
			.send({});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: 'unable to delete document guid 1111-2222-3333 related to caseId 100000001'
		});
	});

	test('should fail if document is not found', async () => {
		// GIVEN
		databaseConnector.documentVersion.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request
			.post('/applications/100000001/documents/1111-2222-3333/delete')
			.send({});

		// THEN
		expect(response.status).toEqual(404);

		expect(response.body).toEqual({
			errors: 'document not found: guid 1111-2222-3333 related to caseId 100000001'
		});
	});
});
