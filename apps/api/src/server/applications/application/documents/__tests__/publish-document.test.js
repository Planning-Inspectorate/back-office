import { jest } from '@jest/globals';
import { request } from '#app-test';
const { databaseConnector } = await import('#utils/database-connector.js');
const { eventClient } = await import('#infrastructure/event-client.js');
import { EventType } from '@pins/event-client';
import { NSIP_DOCUMENT } from '#infrastructure/topics.js';

const dateDocCreated = '2022-01-01T11:59:38.129Z';
const dateDocLastModified = '2024-02-05T11:59:38.129Z';
const docGuid = 'D1234';
const application1 = {
	id: 1,
	reference: 'EN0110001',
	title: 'EN0110001 - NI Case 3 Name',
	description: 'test',
	createdAt: '2022-01-01T11:59:38.129Z',
	modifiedAt: '2023-03-10T13:49:09.666Z',
	publishedAt: null,
	CaseStatus: [{ id: 1, status: 'draft' }],
	ApplicationDetails: {
		subSector: {
			sector: {
				name: 'office use'
			}
		}
	}
};

const document1 = {
	guid: docGuid,
	folderId: 2,
	privateBlobContainer: 'test-container',
	privateBlobPath: 'test-path',
	caseId: 1,
	latestVersionNo: 1,
	documentReference: null,
	folder: {
		id: 1,
		displayNameEn: 'Project management',
		displayOrder: 100,
		parentFolderId: null,
		caseId: 1,
		case: application1
	},
	case: application1
};
const documentVersion1 = {
	version: 1,
	documentId: 12,
	caseId: 1,
	documentGuid: docGuid,
	description: 'a test document',
	documentType: 'Doc Category',
	publishedStatus: 'ready_to_publish',
	redactedStatus: 'redacted',
	fileName: 'test-filename',
	originalFilename: 'test-original-filename',
	mime: 'image/png',
	size: 23452,
	author: 'Billy B',
	privateBlobContainer: 'test-container',
	privateBlobPath: 'test-path',
	publishedBlobContainer: 'test-container',
	publishedBlobPath: 'test-path',
	dateCreated: new Date(dateDocCreated),
	lastModified: new Date(dateDocLastModified),
	filter1: 'Filter Category 1',
	filter2: null,
	stage: null,
	representative: null,
	horizonDataID: null,
	transcriptGuid: null
};

const documentWithDocumentVersionWithLatest = {
	...document1,
	documentVersion: [documentVersion1],
	latestDocumentVersion: documentVersion1
};

const documentVersionWithDocument = {
	...documentVersion1,
	Document: document1
};

const expectedEventPayload = {
	documentId: docGuid,
	caseId: 1,
	caseRef: 'EN0110001',
	documentReference: null,
	version: 1,
	filename: 'test-filename',
	originalFilename: 'test-original-filename',
	size: 23452,
	documentURI: 'https://127.0.0.1:10000/test-container/test-path',
	dateCreated: dateDocCreated,
	lastModified: dateDocLastModified,
	author: 'Billy B',
	publishedStatus: 'ready_to_publish',
	redactedStatus: 'redacted',
	publishedDocumentURI: 'https://127.0.0.1:10000/test-container/test-path',
	filter1: 'Filter Category 1',
	filter2: null,
	description: 'a test document',
	documentType: 'Doc Category',
	mime: 'image/png',
	caseType: 'nsip',
	datePublished: null,
	documentCaseStage: null,
	horizonFolderId: null,
	path: 'EN0110001/undefined/test-filename',
	representative: null,
	transcriptId: null
};

// -------   TESTS   ---------------------------------------------------------------
describe('Ready-to-publish-documents', () => {
	test('returns ready-to-publish documents metadata on a case', async () => {
		// GIVEN
		let findManyDocs = [documentWithDocumentVersionWithLatest];
		findManyDocs[0].documentVersion[0].publishedStatus = 'ready_to_publish';
		findManyDocs[0].latestDocumentVersion.publishedStatus = 'ready_to_publish';

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.document.findMany.mockResolvedValue(findManyDocs);
		databaseConnector.document.count.mockResolvedValue(1);

		// WHEN
		const response = await request.post('/applications/1/documents/ready-to-publish').send({
			pageNumber: 1,
			pageSize: 125
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
			include: {
				latestDocumentVersion: true,
				folder: true
			},
			skip: 0,
			take: 125,
			orderBy: [
				{
					createdAt: 'desc'
				}
			],
			where: {
				caseId: 1,
				latestDocumentVersion: {
					publishedStatus: 'ready_to_publish'
				},
				isDeleted: false
			}
		});
		expect(response.body).toEqual({
			page: 1,
			pageDefaultSize: 125,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					documentGuid: docGuid,
					documentId: 12,
					documentRef: null,
					folderId: 1,
					caseRef: 'EN0110001',
					sourceSystem: 'Back Office',
					stage: null,
					privateBlobContainer: 'test-container',
					privateBlobPath: 'test-path',
					author: 'Billy B',
					fileName: 'test-filename',
					originalFilename: 'test-original-filename',
					dateCreated: 1641038378,
					size: 23452,
					mime: 'image/png',
					publishedStatus: 'ready_to_publish',
					redactedStatus: 'redacted',
					datePublished: null,
					description: 'a test document',
					version: 1,
					representative: null,
					documentType: 'Doc Category',
					filter1: 'Filter Category 1',
					filter2: null,
					examinationRefNo: '',
					fromFrontOffice: false,
					transcript: ''
				}
			]
		});
	});
});

describe('Publish documents', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('publishes selected documents on a case from ready-to-publish queue', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'ready_to_publish';

		let docVersionWithDocumentBeforeUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'ready_to_publish'
		};
		let documentVersionWithDocumentAfterUpdate = {
			...docVersionWithDocumentBeforeUpdate,
			publishedStatus: 'publishing',
			publishedStatusPrev: 'not_checked'
		};
		let findManyDocs = [
			{
				guid: docGuid,
				latestVersionId: 1,
				latestDocumentVersion: documentVersion1
			}
		];
		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			docVersionWithDocumentBeforeUpdate
		);
		databaseConnector.document.findMany.mockResolvedValue(findManyDocs);
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch('/applications/1/documents/publish').send({
			documents: [{ guid: docGuid }]
		});

		// THEN
		expect(response.body).toEqual([
			{
				guid: docGuid,
				publishedStatus: 'publishing'
			}
		]);
		expect(response.status).toEqual(200);

		// expect event broadcast
		let expectedEventPayloadAmended = {
			...expectedEventPayload,
			publishedStatus: 'publishing'
		};
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[expectedEventPayloadAmended],
			EventType.Update,
			{ publishing: 'true' }
		);
	});

	test('throws error if document missing properties required for publishing', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'not_checked';

		let docVersionWithDocumentBeforeUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'not_checked',
			filter1: null,
			author: null
		};

		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			docVersionWithDocumentBeforeUpdate
		);
		databaseConnector.document.findMany.mockResolvedValue([]); // no matching publishable docs returned

		// WHEN
		const response = await request.patch('/applications/1/documents/publish').send({
			documents: [{ guid: docGuid }]
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: [{ guid: docGuid }]
		});
	});

	test('returns partial success if some documents missing properties required for publishing', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'ready_to_publish';

		let docVersionWithDocumentBeforeUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'ready_to_publish'
		};
		let documentVersionWithDocumentAfterUpdate = {
			...docVersionWithDocumentBeforeUpdate,
			publishedStatus: 'publishing'
		};
		let findManyDocs = [
			{
				guid: docGuid,
				latestVersionId: 1,
				latestDocumentVersion: documentVersion1
			}
		];

		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			docVersionWithDocumentBeforeUpdate
		);
		databaseConnector.document.findMany.mockResolvedValue(findManyDocs);
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch('/applications/1/documents/publish').send({
			documents: [{ guid: docGuid }, { guid: 'bad_document_to_publish_guid' }]
		});

		// THEN
		expect(response.status).toEqual(207);
		expect(response.body).toEqual({
			successful: [{ guid: docGuid, publishedStatus: 'publishing' }],
			errors: [{ guid: 'bad_document_to_publish_guid' }]
		});

		// expect event broadcast
		let expectedEventPayloadAmended = {
			...expectedEventPayload,
			publishedStatus: 'publishing'
		};
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[expectedEventPayloadAmended],
			EventType.Update,
			{ publishing: 'true' }
		);
	});
});
