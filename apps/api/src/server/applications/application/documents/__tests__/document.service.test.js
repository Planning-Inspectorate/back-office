import { jest } from '@jest/globals';
import config from '#config/config.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

import { obtainURLForDocumentVersion } from '../document.service.js';

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

const application = {
	id: 1,
	reference: 'case reference'
};

const caseId = 1234;
const documentGuid = '1111-2222-3333';

const document = {
	documentName: 'test',
	folderId: 1111,
	documentSize: 1111,
	documentType: 'test',
	latestVersionId: 1
};

const documentWithVersions = {
	guid: documentGuid,
	documentName: 'test',
	folderId: 1111,
	documentSize: 1111,
	documentType: 'test',
	latestVersionId: 1,
	documentVersion: [
		{
			version: 1,
			author: 'test',
			publishedStatus: 'published'
		},
		{
			version: 2,
			author: 'test'
		}
	]
};

const documentWithVersionsUnpublished = {
	guid: documentGuid,
	documentName: 'test',
	folderId: 1111,
	documentSize: 1111,
	documentType: 'test',
	latestVersionId: 1,
	documentVersion: [
		{
			version: 1,
			author: 'test',
			publishedStatus: 'awaiting_check'
		},
		{
			version: 2,
			author: 'test'
		}
	]
};

describe('Document service test', () => {
	beforeAll(() => {
		saveEnvVars();

		config.blobStorageUrl = 'blob-store-host';
		config.blobStorageContainer = 'blob-store-container';
	});
	beforeEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		restoreEnvVars();
	});

	test('obtainURLForDocumentVersion throws error when case not exist', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		await expect(obtainURLForDocumentVersion(document, caseId, documentGuid)).rejects.toThrow(
			Error
		);
	});

	test('obtainURLForDocumentVersion throws error when document not exist', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(null);
		await expect(obtainURLForDocumentVersion(document, caseId, documentGuid)).rejects.toThrow(
			Error
		);
	});

	test('obtainURLForDocumentVersion uploads new version of document', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(documentWithVersions);

		const ressponse = await obtainURLForDocumentVersion(document, caseId, documentGuid);

		expect(ressponse.blobStorageHost).toEqual('blob-store-host');
		expect(ressponse.privateBlobContainer).toEqual('blob-store-container');
		expect(ressponse.documents).toEqual([
			{
				GUID: documentGuid,
				blobStoreUrl: `/application/${application.reference}/${documentGuid}/2`,
				caseReference: application.reference,
				caseType: 'application',
				documentName: document.documentName,
				version: 2
			}
		]);
		expect(databaseConnector.document.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.document.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentActivityLog.create).toHaveBeenCalledTimes(2);
	});

	test('obtainURLForDocumentVersion uploads new version of document and does not unblish the document', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(documentWithVersionsUnpublished);

		const ressponse = await obtainURLForDocumentVersion(document, caseId, documentGuid);

		expect(ressponse.blobStorageHost).toEqual('blob-store-host');
		expect(ressponse.privateBlobContainer).toEqual('blob-store-container');
		expect(ressponse.documents).toEqual([
			{
				GUID: documentGuid,
				blobStoreUrl: `/application/${application.reference}/${documentGuid}/2`,
				caseReference: application.reference,
				caseType: 'application',
				documentName: document.documentName,
				version: 2
			}
		]);
		expect(databaseConnector.document.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.document.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentActivityLog.create).toHaveBeenCalledTimes(1);
	});
});
