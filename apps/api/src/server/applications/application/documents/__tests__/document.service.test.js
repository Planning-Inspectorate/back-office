import { jest } from '@jest/globals';
const { databaseConnector } = await import('../../../../utils/database-connector.js');
const { default: got } = await import('got');

import { obtainURLForDocumentVersion } from '../document.service.js';

const document = {
	documentName: 'test',
	folderId: 1111,
	documentSize: 1111,
	documentType: 'test',
	latestVersionId: 1
};

const documentWithVersions = {
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

const application = {
	id: 1,
	reference: 'case reference'
};

const caseId = 1234;
const documentGuid = '1111-2222-3333';

describe('Document service test', () => {
	beforeEach(() => {
		jest.clearAllMocks();
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
		got.post.mockReturnValue({
			json: jest.fn().mockResolvedValue({
				blobStorageHost: 'blob-store-host',
				blobStorageContainer: 'blob-store-container',
				documents: [document]
			})
		});

		const ressponse = await obtainURLForDocumentVersion(document, caseId, documentGuid);

		expect(ressponse.blobStorageHost).toEqual('blob-store-host');
		expect(ressponse.blobStorageContainer).toEqual('blob-store-container');
		expect(ressponse.documents).toEqual([document]);
		expect(databaseConnector.document.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.document.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentActivityLog.create).toHaveBeenCalledTimes(2);
	});

	test('obtainURLForDocumentVersion uploads new version of document and does not unblish the document', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(documentWithVersionsUnpublished);
		got.post.mockReturnValue({
			json: jest.fn().mockResolvedValue({
				blobStorageHost: 'blob-store-host',
				blobStorageContainer: 'blob-store-container',
				documents: [document]
			})
		});

		const ressponse = await obtainURLForDocumentVersion(document, caseId, documentGuid);

		expect(ressponse.blobStorageHost).toEqual('blob-store-host');
		expect(ressponse.blobStorageContainer).toEqual('blob-store-container');
		expect(ressponse.documents).toEqual([document]);
		expect(databaseConnector.document.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.document.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentActivityLog.create).toHaveBeenCalledTimes(1);
	});
});
