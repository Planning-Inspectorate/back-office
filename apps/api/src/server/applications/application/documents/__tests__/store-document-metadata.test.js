import { jest } from '@jest/globals';
import { request } from '#app-test';
import { applicationStates } from '../../../state-machine/application.machine.js';
import { EventType } from '@pins/event-client';
import { NSIP_DOCUMENT } from '#infrastructure/topics.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const { eventClient } = await import('#infrastructure/event-client.js');

const dateDocCreated = '2022-01-01T11:59:38.129Z';
const dateDocLastModified = '2024-02-05T11:59:38.129Z';
const docGuid = '1111-2222-3333';

const application1 = {
	id: 1,
	reference: 'EN0110001',
	title: 'EN0110001 - NI Case 3 Name',
	description: 'test',
	createdAt: '2022-01-01T11:59:38.129Z',
	modifiedAt: '2023-03-10T13:49:09.666Z',
	publishedAt: null,
	CaseStatus: [{ id: 1, status: 'draft' }]
};

const generatesDocumentMetadataResponse = (
	/** @type {Record<string, any>} */ updateResponseValues
) => ({
	...updateResponseValues,
	documentGuid: docGuid,
	documentId: 12,
	documentRef: null,
	folderId: null,
	caseRef: 'EN0110001',
	sourceSystem: 'Back Office',
	privateBlobContainer: 'container',
	privateBlobPath: 'path',
	author: '',
	authorWelsh: '',
	descriptionWelsh: null,
	fileName: 'filename.pdf',
	originalFilename: 'original_filename.pdf',
	dateCreated: 1641038378,
	size: 23452,
	mime: '',
	publishedStatus: '',
	redactedStatus: '',
	datePublished: null,
	version: 1,
	filter1: null,
	filter1Welsh: null,
	filter2: null,
	examinationRefNo: '',
	fromFrontOffice: false,
	transcript: ''
});

const mockResolvedDocumentValue = (/** @type {Record<string, any>} */ updateResponseValues) => ({
	...updateResponseValues,
	guid: docGuid,
	folderId: 1,
	privateBlobContainer: 'document-service-uploads',
	documentURI: '/application/BC010001/1111-2222-3333/my_doc.doc',
	status: applicationStates.draft,
	createdAt: dateDocCreated,
	redacted: true
});

const mockDocumentVersionAndDocumentAfterUpdate = (
	/** @type {Record<string, any>} */ updateResponseValues
) => ({
	...updateResponseValues,
	version: 1,
	documentId: 12,
	dateCreated: new Date(dateDocCreated),
	lastModified: new Date(dateDocLastModified),
	documentGuid: docGuid,
	caseRef: 'EN0110001',
	sourceSystem: 'Back Office',
	privateBlobContainer: 'container',
	privateBlobPath: 'path',
	author: '',
	fileName: 'filename.pdf',
	originalFilename: 'original_filename.pdf',
	size: 23452,
	publishedDocumentURI: 'https://127.0.0.1:10000/document-uploads/published/en010120-filename.pdf',
	horizonDataID: null,
	transcriptGuid: null,
	path: 'EN0110001/Folder 1/Folder 2/filename.pdf',
	Document: {
		guid: docGuid,
		caseId: 1,
		documentReference: null,
		folder: {
			case: application1
		},
		case: application1
	}
});

const expectedEventPayload = {
	documentId: docGuid,
	caseId: 1,
	caseRef: 'EN0110001',
	documentReference: null,
	version: 1,
	filename: 'filename.pdf',
	originalFilename: 'original_filename.pdf',
	size: 23452,
	documentURI: 'https://127.0.0.1:10000/container/path',
	dateCreated: dateDocCreated,
	lastModified: dateDocLastModified,
	author: '',
	publishedDocumentURI: null,
	sourceSystem: 'Back Office',
	datePublished: null,
	documentCaseStage: null,
	horizonFolderId: null,
	caseType: 'nsip',
	transcriptId: null,
	path: 'EN0110001/filename.pdf'
};

describe('store Document metadata', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('This test case verifies that the metadata is correctly associated with the appropriate document and case when creating/updating document metadata.', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.document.findUnique.mockResolvedValue(mockResolvedDocumentValue());
		databaseConnector.documentVersion.upsert.mockResolvedValue(
			mockDocumentVersionAndDocumentAfterUpdate()
		);

		const { body, statusCode } = await request
			.post(`/applications/1/documents/${docGuid}/metadata`)
			.send({
				version: 1,
				dateCreated: dateDocCreated,
				lastModified: dateDocLastModified
			});

		const generatedResponse = generatesDocumentMetadataResponse({ documentId: 12 });

		expect(body).toEqual(generatedResponse);

		const upsertCalledWIth = {
			version: 1,
			dateCreated: dateDocCreated,
			lastModified: dateDocLastModified
		};

		expect(statusCode).toEqual(200);

		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledWith({
			create: {
				...upsertCalledWIth,
				Document: { connect: { guid: docGuid } }
			},
			where: { documentGuid_version: { documentGuid: docGuid, version: 1 } },
			update: upsertCalledWIth,
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
				}
			}
		});

		expect(databaseConnector.document.findUnique).toHaveBeenCalledWith({
			where: {
				guid: docGuid
			}
		});

		// expect event broadcast
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[expectedEventPayload],
			EventType.Update,
			{}
		);
	});

	test('If the case is not linked to a document, this test case generates a 404 error.', async () => {
		databaseConnector.document.findUnique.mockResolvedValue(null);

		const response = await request
			.post('/applications/1/documents/1111-2222-3333/metadata')
			.send({ origin: 'pins' });

		expect(response.statusCode).toEqual(404);

		expect(response.body).toEqual({
			errors: 'Document not found: guid 1111-2222-3333'
		});

		expect(databaseConnector.documentVersion.upsert).not.toHaveBeenCalled();

		expect(databaseConnector.document.findUnique).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333'
			}
		});
	});

	test('The test checks if the endpoint returns a 400 bad request error when the request body has the wrong schema.', async () => {
		databaseConnector.document.findFirst.mockResolvedValue(null);

		const { body, statusCode } = await request
			.post('/applications/1/documents/1111-2222-3333/metadata')
			.send({
				published: 1233,
				badFieldThatDoesNotExistOnSchema: 'badFieldThatDoesNotExistOnSchema',
				redactedStatus: 'badFieldThatDoesNotMatchEnum',
				origin: 'badOriginFieldThatDoesNotMatchEnum'
			});

		expect(statusCode).toEqual(400);

		expect(body).toEqual({
			errors:
				'"origin" must be one of [pins, citizen, lpa, ogd]. "redactedStatus" must be one of [not_redacted, redacted]. "published" is not allowed. "badFieldThatDoesNotExistOnSchema" is not allowed'
		});

		expect(databaseConnector.documentVersion.upsert).not.toHaveBeenCalled();

		expect(databaseConnector.document.findFirst).not.toHaveBeenCalled();
	});
});
