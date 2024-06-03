import { request } from '#app-test';
import { mockApplicationGet } from '#utils/application-factory-for-tests.js';
const { databaseConnector } = await import('#utils/database-connector.js');
const { eventClient } = await import('#infrastructure/event-client.js');
import { EventType } from '@pins/event-client';
import { NSIP_DOCUMENT } from '#infrastructure/topics.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';

const caseRef = 'EN010003';
const dateDocCreated = '2023-03-13T16:54:09.398Z';
const dateDocLastModified = '2024-02-05T11:59:38.129Z';
const docGuid = 'test-doc-1234';

const application1 = {
	id: 1,
	title: `${caseRef} - NI Case 3 Nam`,
	description: `${caseRef} - NI Case 3 Name Description`,
	reference: caseRef
};

/**
 * @type {any[]}
 */
const documentVersions = [
	{
		documentGuid: docGuid,
		version: 1,
		lastModified: new Date(dateDocLastModified),
		documentType: 'Doc Category',
		published: false,
		sourceSystem: 'back-office-applications',
		stage: null,
		origin: null,
		originalFilename: 'test-original-filename',
		fileName: 'test-filename',
		representative: null,
		description: 'a test document',
		owner: null,
		author: 'Billy B',
		securityClassification: null,
		mime: 'image/png',
		horizonDataID: null,
		fileMD5: null,
		virusCheckStatus: null,
		size: 4375,
		filter1: 'Filter Category 1',
		privateBlobPath: 'private-path',
		privateBlobContainer: 'private-blob',
		publishedBlobPath: 'published-path',
		publishedBlobContainer: 'published-blob',
		dateCreated: new Date(dateDocCreated),
		datePublished: null,
		isDeleted: false,
		examinationRefNo: null,
		filter2: null,
		publishedStatus: 'published',
		redactedStatus: 'redacted',
		redacted: false,
		transcriptGuid: null
	}
];

const document1 = {
	guid: docGuid,
	documentReference: 'test-ref',
	folderId: 1,
	privateBlobContainer: 'test-container',
	privateBlobPath: 'test-path',
	caseId: 1,
	createdAt: new Date(),
	isDeleted: false,
	latestVersionId: 1,
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

const documentWithDocumentVersionWithLatest = {
	...document1,
	documentVersion: documentVersions,
	latestDocumentVersion: documentVersions[0]
};

const documentVersionWithDocument = {
	...documentVersions[0],
	Document: document1
};

const expectedEventPayload = buildPayloadEventsForSchema(NSIP_DOCUMENT, {
	documentId: docGuid,
	caseId: 1,
	caseRef: caseRef,
	documentReference: 'test-ref',
	version: 1,
	filename: 'test-filename',
	originalFilename: 'test-original-filename',
	size: 4375,
	documentURI: 'https://127.0.0.1:10000/private-blob/private-path',
	dateCreated: dateDocCreated,
	lastModified: dateDocLastModified,
	author: 'Billy B',
	publishedStatus: 'unpublishing',
	redactedStatus: 'redacted',
	publishedDocumentURI: 'https://127.0.0.1:10000/published-blob/published-path',
	filter1: 'Filter Category 1',
	filter2: null,
	description: 'a test document',
	documentType: 'Doc Category',
	mime: 'image/png',
	caseType: 'nsip',
	datePublished: null,
	documentCaseStage: null,
	horizonFolderId: null,
	path: 'EN010003/undefined/test-filename',
	representative: null,
	transcriptId: null,
	examinationRefNo: null,
	fileMD5: null,
	virusCheckStatus: null,
	sourceSystem: 'back-office-applications',
	origin: null,
	owner: null,
	securityClassification: null
});

// ----------------- TESTS -----------------------------
describe('Unpublishing documents', () => {
	test('returns all documents metadata on a case', async () => {
		// GIVEN
		// @ts-ignore
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(application1));
		// @ts-ignore
		databaseConnector.document.findMany.mockResolvedValue([documentWithDocumentVersionWithLatest]);

		const filesGuid = [docGuid];
		// WHEN
		const response = await request.get(
			`/applications/1/documents/properties?guids=${JSON.stringify(filesGuid)}`
		);

		// THEN
		expect(response.status).toEqual(200);
		expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
			where: {
				guid: {
					in: [docGuid]
				},
				isDeleted: false
			},
			include: {
				documentVersion: true
			}
		});
		expect(response.body).toEqual([
			{
				author: 'Billy B',
				authorWelsh: '',
				caseRef: null,
				dateCreated: 1678726449,
				datePublished: null,
				description: 'a test document',
				descriptionWelsh: null,
				documentGuid: docGuid,
				documentId: null,
				documentRef: null,
				documentType: 'Doc Category',
				examinationRefNo: '',
				transcript: '',
				fileName: 'test-filename',
				filter1: 'Filter Category 1',
				filter1Welsh: null,
				filter2: null,
				folderId: null,
				fromFrontOffice: false,
				mime: 'image/png',
				originalFilename: 'test-original-filename',
				privateBlobContainer: 'private-blob',
				privateBlobPath: 'private-path',
				publishedStatus: 'published',
				redactedStatus: 'redacted',
				representative: null,
				size: 4375,
				sourceSystem: 'back-office-applications',
				stage: null,
				version: 1
			}
		]);
	});

	test('returns published documents metadata on a case', async () => {
		// GIVEN
		// @ts-ignore
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(application1));
		// @ts-ignore
		databaseConnector.document.findMany.mockResolvedValue([documentWithDocumentVersionWithLatest]);

		const filesGuid = [docGuid];
		// WHEN
		const response = await request.get(
			`/applications/1/documents/properties?guids=${JSON.stringify(filesGuid)}&published=true`
		);

		// THEN
		expect(response.status).toEqual(200);
		expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
			where: {
				guid: {
					in: [docGuid]
				},
				isDeleted: false
			},
			include: {
				documentVersion: true
			}
		});
		expect(response.body).toEqual([
			{
				author: 'Billy B',
				authorWelsh: '',
				caseRef: null,
				dateCreated: 1678726449,
				datePublished: null,
				description: 'a test document',
				descriptionWelsh: null,
				documentGuid: docGuid,
				documentId: null,
				documentRef: null,
				documentType: 'Doc Category',
				transcript: '',
				examinationRefNo: '',
				fileName: 'test-filename',
				filter1: 'Filter Category 1',
				filter1Welsh: null,
				filter2: null,
				folderId: null,
				fromFrontOffice: false,
				mime: 'image/png',
				originalFilename: 'test-original-filename',
				privateBlobContainer: 'private-blob',
				privateBlobPath: 'private-path',
				publishedStatus: 'published',
				redactedStatus: 'redacted',
				representative: null,
				size: 4375,
				sourceSystem: 'back-office-applications',
				stage: null,
				version: 1
			}
		]);
	});

	test('unpublishes selected documents on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(application1));
		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'published';

		let docVersionWithDocumentBeforeUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'published'
		};
		let documentVersionWithDocumentAfterUpdate = {
			...docVersionWithDocumentBeforeUpdate,
			publishedStatus: 'unpublishing',
			publishedStatusPrev: 'not_checked'
		};
		let findManyDocs = [
			{
				guid: docGuid,
				latestVersionId: 1,
				latestDocumentVersion: documentVersions[0]
			}
		];
		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			docVersionWithDocumentBeforeUpdate
		);
		databaseConnector.document.findMany.mockResolvedValue(findManyDocs);
		databaseConnector.documentVersion.findMany.mockResolvedValue([
			docVersionWithDocumentBeforeUpdate
		]);
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch('/applications/1/documents/unpublish').send({
			documents: [{ guid: docGuid }]
		});

		// THEN
		expect(response.body).toEqual({
			successful: [docGuid],
			errors: []
		});
		expect(response.status).toEqual(200);

		// expect event broadcast
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			expectedEventPayload,
			EventType.Update,
			{ unpublishing: 'true' }
		);
	});
});
