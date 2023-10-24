import { jest } from '@jest/globals';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

import { request } from '../../../../app-test.js';
import { applicationStates } from '../../../state-machine/application.machine.js';

const generatesDocumentMetadataResponse = (
	/** @type {Record<string, any>} */ updateResponseValues
) => ({
	...updateResponseValues,
	documentGuid: '1111-2222-3333',
	documentId: 12,
	documentRef: null,
	folderId: null,
	caseRef: 'EN01-823011',
	sourceSystem: 'Back Office',
	privateBlobContainer: '',
	privateBlobPath: '',
	author: '',
	fileName: '',
	originalFilename: '',
	dateCreated: null,
	size: 0,
	mime: '',
	publishedStatus: '',
	redactedStatus: '',
	datePublished: null,
	version: 1,
	filter1: null,
	filter2: null,
	examinationRefNo: '',
	fromFrontOffice: false,
	transcript: ''
});

const mockResolvedDocumentValue = (/** @type {Record<string, any>} */ updateResponseValues) => ({
	...updateResponseValues,
	guid: '1111-2222-3333',
	folderId: 1,
	privateBlobContainer: 'document-service-uploads',
	documentURI: '/application/BC010001/1111-2222-3333/my_doc.doc',
	status: applicationStates.draft,
	createdAt: '2022-12-12 17:12:25.9610000',
	redacted: true
});

const mockResolvedDocumentVersionValue = (
	/** @type {Record<string, any>} */ updateResponseValues
) => ({
	...updateResponseValues,
	version: 1,
	documentId: 12,
	createdAt: '2023-02-28T11:59:38.129Z',
	lastModified: '2023-02-28T11:59:38.129Z',
	documentGuid: '1111-2222-3333',
	Document: {
		folder: {
			case: {
				id: 3,
				reference: 'EN01-823011',
				title: 'EN010003 - NI Case 3 Name',
				description: 'test',
				createdAt: '2023-03-10T13:49:09.666Z',
				modifiedAt: '2022-06-15T13:14:42.000Z',
				publishedAt: null,
				CaseStatus: [{ id: 1, status: 'draft' }]
			}
		}
	}
});

describe('store Document metadata', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('This test case verifies that the metadata is correctly associated with the appropriate document and case when creating/updating document metadata.', async () => {
		databaseConnector.document.findUnique.mockResolvedValue(mockResolvedDocumentValue());

		databaseConnector.documentVersion.upsert.mockResolvedValue(mockResolvedDocumentVersionValue());

		const { body, statusCode } = await request
			.post('/applications/1/documents/1111-2222-3333/metadata')
			.send({
				version: 1,
				dateCreated: '2023-02-28T11:59:38.129Z',
				lastModified: '2023-02-28T11:59:38.129Z'
			});

		const generatedResponse = generatesDocumentMetadataResponse({ documentId: 12 });

		expect(body).toEqual(generatedResponse);

		const upsertCalledWIth = {
			version: 1,
			dateCreated: '2023-02-28T11:59:38.129Z',
			lastModified: '2023-02-28T11:59:38.129Z'
		};

		expect(statusCode).toEqual(200);

		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledWith({
			create: {
				...upsertCalledWIth,
				Document: { connect: { guid: '1111-2222-3333' } }
			},
			where: { documentGuid_version: { documentGuid: '1111-2222-3333', version: 1 } },
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
				guid: '1111-2222-3333'
			}
		});
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
