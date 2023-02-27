import { jest } from '@jest/globals';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

import supertest from 'supertest';
import { app } from '../../../../app.js';
import { applicationStates } from '../../../state-machine/application.machine.js';

const request = supertest(app);

const documentMetadata = {
	id: 1,
	documentGuid: '1111-2222-3333',
	horizonDataID: '',
	version: '',
	path: '',
	virusCheckStatus: '',
	fileMD5: '',
	mime: '',
	fileSize: 0,
	fileType: '',
	dateCreated: '',
	lastModified: '',
	datePublished: '',
	documentType: '',
	securityClassification: '',
	sourceSystem: '',
	origin: '',
	owner: '',
	author: '',
	representative: '',
	description: '',
	stage: 1
};

describe('store Document metadata', () => {
	beforeEach(() => {
		jest.clearAllMocks();
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

		databaseConnector.documentMetadata.upsert.mockResolvedValue(documentMetadata);

		const { body, statusCode } = await request
			.post('/applications/1/documents/1111-2222-3333/metadata')
			.send(documentMetadata);

		expect(body).toEqual(documentMetadata);
		expect(statusCode).toEqual(200);
		expect(databaseConnector.documentMetadata.upsert).toBeCalledWith({
			create: {
				...documentMetadata,
				Document: { connect: { guid: documentMetadata?.documentGuid } }
			},
			where: { id: documentMetadata.id },
			update: documentMetadata,
			include: {
				Document: true
			}
		});

		expect(databaseConnector.document.findFirst).toHaveBeenCalledWith({
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
			.send(documentMetadata);

		expect(statusCode).toEqual(404);

		expect(body).toEqual({
			errors: 'document not found guid 1111-2222-3333 related to casedId 1'
		});

		expect(databaseConnector.documentMetadata.upsert).not.toBeCalled();

		expect(databaseConnector.document.findFirst).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333',
				isDeleted: false,
				folder: {
					caseId: 1
				}
			}
		});
	});
});
