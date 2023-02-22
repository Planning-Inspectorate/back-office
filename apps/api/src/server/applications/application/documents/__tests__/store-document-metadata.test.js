import { jest } from '@jest/globals';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

import supertest from 'supertest';
import { app } from '../../../../app.js';
import { applicationStates } from '../../../state-machine/application.machine.js';

const request = supertest(app);

describe('store Document metadata', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('This test case verifies that the metadata is correctly associated with the appropriate document and case when updating document name', async () => {
		databaseConnector.document.findFirst.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my_doc.doc',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
			status: applicationStates.draft,
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true
		});

		databaseConnector.document.update.mockResolvedValue({});

		databaseConnector.documentVersion.upsert.mockResolvedValue({
			version: 1,
			createdAt: '2023-02-28T11:59:38.129Z',
			lastModified: '2023-02-28T11:59:38.129Z',
			documentGuid: '1111-2222-3333'
		});

		const { body, statusCode } = await request
			.post('/applications/1/documents/1111-2222-3333/metadata')
			.send({
				documentName: 'documentName',
				version: 2
			});

		expect(body).toEqual({
			documentGuid: '1111-2222-3333',
			documentId: '',
			caseRef: null,
			documentName: '',
			sourceSystem: 'Back Office',
			blobStorageContainer: '',
			blobStoragePath: '',
			author: '',
			fileName: '',
			originalFilename: '',
			dateCreated: null,
			size: 0,
			mime: '',
			publishedStatus: '',
			redactedStatus: '',
			status: null,
			datePublished: null,
			version: 1,
			stage: null,
			filter1: null,
			examinationRefNo: ''
		});

		const upsertCalledWIth = {
			version: 2,
			documentGuid: '1111-2222-3333'
		};

		expect(statusCode).toEqual(200);

		expect(databaseConnector.document.update).toBeCalledWith({
			where: {
				guid: upsertCalledWIth?.documentGuid
			},
			data: {
				name: 'documentName'
			}
		});

		expect(databaseConnector.documentVersion.upsert).toBeCalledWith({
			create: {
				...upsertCalledWIth,
				Document: { connect: { guid: upsertCalledWIth?.documentGuid } }
			},
			where: { documentGuid: upsertCalledWIth.documentGuid },
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

		expect(databaseConnector.document.findFirst).toHaveBeenCalledWith({
			include: { documentVersion: true },
			where: {
				guid: '1111-2222-3333',
				isDeleted: false,
				folder: {
					caseId: 1
				}
			}
		});
	});

	test('This test case verifies that the metadata is correctly associated with the appropriate document and case when creating/updating document metadata.', async () => {
		databaseConnector.document.findFirst.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my_doc.doc',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
			status: applicationStates.draft,
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true
		});

		databaseConnector.documentVersion.upsert.mockResolvedValue({
			version: 1,
			createdAt: '2023-02-28T11:59:38.129Z',
			lastModified: '2023-02-28T11:59:38.129Z',
			documentGuid: '1111-2222-3333'
		});

		const { body, statusCode } = await request
			.post('/applications/1/documents/1111-2222-3333/metadata')
			.send({
				version: 1,
				receivedDate: '2023-02-28T11:59:38.129Z',
				lastModified: '2023-02-28T11:59:38.129Z'
			});

		expect(body).toEqual({
			documentGuid: '1111-2222-3333',
			documentId: '',
			caseRef: null,
			documentName: '',
			sourceSystem: 'Back Office',
			blobStorageContainer: '',
			blobStoragePath: '',
			author: '',
			fileName: '',
			originalFilename: '',
			dateCreated: null,
			size: 0,
			mime: '',
			publishedStatus: '',
			redactedStatus: '',
			status: null,
			datePublished: null,
			version: 1,
			stage: null,
			filter1: null,
			examinationRefNo: ''
		});

		const upsertCalledWIth = {
			version: 1,
			receivedDate: '2023-02-28T11:59:38.129Z',
			lastModified: '2023-02-28T11:59:38.129Z',
			documentGuid: '1111-2222-3333'
		};

		expect(statusCode).toEqual(200);

		expect(databaseConnector.documentVersion.upsert).toBeCalledWith({
			create: {
				...upsertCalledWIth,
				Document: { connect: { guid: upsertCalledWIth?.documentGuid } }
			},
			where: { documentGuid: upsertCalledWIth.documentGuid },
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

		expect(databaseConnector.document.findFirst).toHaveBeenCalledWith({
			include: { documentVersion: true },
			where: {
				guid: '1111-2222-3333',
				isDeleted: false,
				folder: {
					caseId: 1
				}
			}
		});
	});

	test('If the case is not linked to a document, this test case generates a 404 error.', async () => {
		databaseConnector.document.findFirst.mockResolvedValue(null);

		const { body, statusCode } = await request
			.post('/applications/1/documents/1111-2222-3333/metadata')
			.send({ published: false });

		expect(statusCode).toEqual(404);

		expect(body).toEqual({
			errors: 'document not found guid 1111-2222-3333 related to casedId 1'
		});

		expect(databaseConnector.documentVersion.upsert).not.toBeCalled();

		expect(databaseConnector.document.findFirst).toHaveBeenCalledWith({
			include: { documentVersion: true },
			where: {
				guid: '1111-2222-3333',
				isDeleted: false,
				folder: {
					caseId: 1
				}
			}
		});
	});

	test('The test checks if the endpoint returns a 400 bad request error when the request body has the wrong schema.', async () => {
		databaseConnector.document.findFirst.mockResolvedValue(null);

		const { body, statusCode } = await request
			.post('/applications/1/documents/1111-2222-3333/metadata')
			.send({
				published: 1233,
				badFieldThatDoesNotExistOnSchema: 'badFieldThatDoesNotExistOnSchema'
			});

		expect(statusCode).toEqual(400);

		expect(body).toEqual({
			errors: '"published" must be a boolean. "badFieldThatDoesNotExistOnSchema" is not allowed'
		});

		expect(databaseConnector.documentVersion.upsert).not.toBeCalled();

		expect(databaseConnector.document.findFirst).not.toBeCalled();
	});
});
