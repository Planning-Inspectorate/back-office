import { request } from '#app-test';
import config from '#config/config.js';
const { databaseConnector } = await import('#utils/database-connector.js');
import { EventType } from '@pins/event-client';
import { NSIP_DOCUMENT } from '#infrastructure/topics.js';
import { buildDocumentFolderPath } from '../document.service.js';
import { buildNsipDocumentPayload } from '#infrastructure/payload-builders/nsip-document.js';
import { jest } from '@jest/globals';
const { eventClient } = await import('#infrastructure/event-client.js');

const application = {
	id: 1,
	reference: 'case reference',
	applicant: {
		organisationName: 'organisation name'
	}
};

const updatedDocResponse = {
	guid: 'a24f43d4-a3d1-4b38-8633-cb78fc5cc67c',
	reference: 'BC0110001-000016',
	folderId: 28,
	createdAt: '2024-01-31T18:09:40.765Z',
	isDeleted: false,
	latestVersionId: 1,
	caseId: 100000000,
	documentType: 'document',
	fromFrontOffice: false
};
const upsertedDocVersionResponse = {
	documentGuid: 'a24f43d4-a3d1-4b38-8633-cb78fc5cc67c',
	version: 1,
	lastModified: null,
	documentType: null,
	published: false,
	sourceSystem: 'back-office-applications',
	origin: null,
	originalFilename: 'Small1.pdf',
	fileName: 'Small1',
	representative: null,
	description: null,
	owner: 'Rodrick Shanahan',
	author: null,
	securityClassification: null,
	mime: 'application/pdf',
	horizonDataID: null,
	fileMD5: null,
	virusCheckStatus: null,
	size: 7945,
	stage: 'pre-application',
	filter1: null,
	privateBlobContainer: 'private-blob',
	privateBlobPath: '/application/BC0110001/a24f43d4-a3d1-4b38-8633-cb78fc5cc67c/1',
	publishedBlobContainer: null,
	publishedBlobPath: null,
	dateCreated: new Date('2024-01-31T18:17:12.692Z'),
	datePublished: null,
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'not_checked',
	publishedStatusPrev: null,
	redactedStatus: null,
	redacted: false,
	transcriptGuid: null,
	Document: {
		guid: 'a24f43d4-a3d1-4b38-8633-cb78fc5cc67c',
		documentReference: 'BC0110001-000017',
		folderId: 28,
		createdAt: new Date('2024-01-31T18:17:12.673Z'),
		isDeleted: false,
		latestVersionId: 1,
		caseId: 100000000,
		documentType: 'document',
		fromFrontOffice: false,
		folder: {
			id: 1,
			case: {
				reference: 'BC0110001',
				id: 1,
				title: 'BC0110001 - NI Case 3 Name',
				description: 'test',
				createdAt: '2022-01-01T11:59:38.129Z',
				modifiedAt: '2023-03-10T13:49:09.666Z',
				publishedAt: null,
				CaseStatus: [{ id: 1, status: 'draft' }]
			}
		}
	}
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

describe('Create documents', () => {
	beforeAll(() => {
		saveEnvVars();

		config.blobStorageUrl = 'blob-store-host';
		config.blobStorageContainer = 'blob-store-container';
	});
	afterAll(() => {
		restoreEnvVars();
	});

	test('saves documents information and returns create documents with Blob Storage URLs', async () => {
		const guid = 'some-guid';

		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);

		databaseConnector.folder.findMany.mockResolvedValue([{ id: 1, displayNameEn: 'folder 1' }]);
		databaseConnector.folder.findUnique.mockResolvedValue({
			id: 1,
			caseId: 1,
			documentCount: 0,
			path: '/1'
		});
		databaseConnector.document.create.mockResolvedValue({ id: 1, guid, name: 'test doc' });
		databaseConnector.folder.findUnique.mockResolvedValue({
			id: 1,
			caseId: 1,
			documentCount: 0,
			path: '/1'
		});
		databaseConnector.$executeRaw = jest
			.fn()
			.mockResolvedValue({ id: 1, caseId: 1, documentCount: 1, path: '/1' });
		databaseConnector.document.findFirst.mockResolvedValueOnce(null);
		databaseConnector.documentVersion.upsert.mockResolvedValue(upsertedDocVersionResponse);
		databaseConnector.document.update.mockResolvedValue(updatedDocResponse);

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

		// get the folder path and file name, needed for payload
		const filePath = await buildDocumentFolderPath(
			upsertedDocVersionResponse.Document.folderId,
			upsertedDocVersionResponse.Document.folder.case.reference,
			upsertedDocVersionResponse.fileName
		);

		// @ts-ignore
		const eventPayload = buildNsipDocumentPayload(upsertedDocVersionResponse, filePath);

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
			duplicates: [],
			deleted: []
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

		// EXPECT event broadcast
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[eventPayload],
			EventType.Create,
			{}
		);
	});

	test('returns file names which failed to upload', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);

		databaseConnector.folder.findUnique.mockResolvedValue({ id: 1, caseId: 1 });
		databaseConnector.document.findFirst
			.mockResolvedValueOnce({ isDeleted: false })
			.mockResolvedValueOnce({ isDeleted: true });
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
			},
			// TODO Remove comments when the flag 'applics-861-fo-submissions' is removed
			// {
			// 	folderId: 1,
			// 	documentName: 'test doc',
			// 	documentType: 'application/pdf',
			// 	documentSize: 1024,
			// 	fromFrontOffice: true
			// },
			{
				folderId: 1,
				documentName: 'test doc deleted',
				documentType: 'application/pdf',
				documentSize: 1024
			}
		]);

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			failedDocuments: [],
			// TODO Replace above with below when the flag 'applics-861-fo-submissions' is removed
			// failedDocuments: ['test doc'],
			duplicates: ['test doc'],
			deleted: ['test doc deleted']
		});
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
