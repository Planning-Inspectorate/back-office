import { request } from '../../../../app-test.js';
import config from '#config/config.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const application = {
	id: 1,
	reference: 'case reference'
};

/**
 * @type {Object<string, any>}
 */
const envConfig = {};
const envKeys = ['blobStorageUrl', 'blobStorageContainer'];
const saveEnvVars = () => {
	for (const key of envKeys) {
		envConfig[key] = config[key];
	}
};
const restoreEnvVars = () => {
	for (const key of envKeys) {
		config[key] = envConfig[key];
	}
};

describe('Provide document upload URLs', () => {
	beforeAll(() => {
		saveEnvVars();

		config.blobStorageUrl = 'blob-store-host';
		config.blobStorageContainer = 'blob-store-container';
	});
	afterAll(() => {
		restoreEnvVars();
	});

	test('saves documents information and returns upload URL', async () => {
		const guid = 'some-guid';

		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);

		databaseConnector.folder.findUnique.mockResolvedValue({ id: 1, caseId: 1 });
		databaseConnector.document.create.mockResolvedValue({ id: 1, guid, name: 'test doc' });
		databaseConnector.document.findFirst.mockResolvedValueOnce(null);
		databaseConnector.documentVersion.upsert.mockResolvedValue({});

		// WHEN
		const response = await request.post('/applications/1/documents').send([
			{
				folderId: 1,
				documentName: 'test doc',
				documentType: 'application/pdf',
				documentSize: 1024
			}
		]);

		const blobPath = `/application/${application.reference}/${guid}/1`;

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			blobStorageHost: 'blob-store-host',
			privateBlobContainer: 'blob-store-container',
			documents: [
				{
					blobStoreUrl: blobPath,
					documentName: 'test doc',
					GUID: 'some-guid'
				}
			],
			failedDocuments: [],
			duplicates: []
		});

		const metadata = {
			documentGuid: guid,
			originalFilename: 'test doc',
			privateBlobPath: '/some/path/test doc'
		};

		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledTimes(2);

		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledWith({
			create: {
				Document: { connect: { guid: 'some-guid' } },
				originalFilename: 'test doc',
				fileName: 'test doc',
				mime: 'application/pdf',
				size: 1024,
				version: 1
			},
			include: {
				Document: { include: { folder: { include: { case: { include: { CaseStatus: true } } } } } }
			},
			update: {
				fileName: 'test doc',
				originalFilename: 'test doc',
				mime: 'application/pdf',
				size: 1024,
				version: 1
			},
			where: { documentGuid_version: { documentGuid: 'some-guid', version: 1 } }
		});

		expect(databaseConnector.documentVersion.upsert).toHaveBeenLastCalledWith({
			create: {
				privateBlobContainer: 'blob-store-container',
				privateBlobPath: blobPath,
				Document: { connect: { guid: metadata?.documentGuid } },
				version: 1
			},
			where: { documentGuid_version: { documentGuid: metadata?.documentGuid, version: 1 } },

			update: {
				privateBlobContainer: 'blob-store-container',
				privateBlobPath: blobPath,
				version: 1
			},
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
	});

	test('returns file names which failed to upload', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);

		databaseConnector.folder.findUnique.mockResolvedValue({ id: 1, caseId: 1 });
		databaseConnector.document.create.mockImplementation(() => {
			throw new Error();
		});
		databaseConnector.documentVersion.upsert.mockResolvedValue({});

		// WHEN
		const response = await request.post('/applications/1/documents').send([
			{
				folderId: 1,
				documentName: 'test doc',
				documentType: 'application/pdf',
				documentSize: 1024
			}
		]);

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({ failedDocuments: [], duplicates: ['test doc'] });
	});

	test('throws error if folder id does not belong to case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.folder.findUnique.mockResolvedValue({ id: 1, caseId: 2 });

		// WHEN
		const response = await request.post('/applications/1/documents').send([
			{
				folderId: 2,
				documentName: 'test doc',
				documentType: 'application/pdf',
				documentSize: 1024
			}
		]);

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'[0].folderId': 'Folder must belong to case'
			}
		});
	});

	test('throws error if not all document details provided', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.folder.findUnique.mockResolvedValue({ id: 1, caseId: 1 });

		// WHEN
		const response = await request.post('/applications/1/documents').send([{}]);

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'[0].documentName': 'Must provide a document name',
				'[0].documentSize': 'Must provide a document size',
				'[0].documentType': 'Must provide a document type',
				'[0].folderId': 'Must provide a folder id'
			}
		});
	});

	test('throws error if no documents provided', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.folder.findUnique.mockResolvedValue({ id: 1, caseId: 1 });

		// WHEN
		const response = await request.post('/applications/1/documents').send([]);

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'': 'Must provide documents to upload'
			}
		});
	});

	test('checks invalid case id', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);
		databaseConnector.folder.findUnique.mockResolvedValue({ id: 1, caseId: 1 });

		// WHEN
		const response = await request.post('/applications/2/documents');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});
});
