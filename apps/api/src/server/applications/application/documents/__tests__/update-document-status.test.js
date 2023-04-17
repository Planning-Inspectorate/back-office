import supertest from 'supertest';
import { app } from '../../../../app-test.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const request = supertest(app);

const document1 = {
	caseId: 1,
	documentGuid: 'D1234',
	publishedStatus: 'awaiting_virus_check'
};

const documentToUpdate1 = {
	caseId: 1,
	documentGuid: 'documenttoupdate_1_guid',
	name: 'doc to update 1',
	description: 'doc with all required fields for publishing',
	publishedStatus: 'not_user_checked',
	filter1: 'Filter Category 1',
	redactedStatus: 'redacted',
	author: 'David'
};

// --------------------------------------------------------------------------------------------------
describe('Update document status when uploading', () => {
	test('updates document status when uploading', async () => {
		// GIVEN
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'D1234',
			name: 'Tom',
			folderId: 2,
			blobStorageContainer: 'Container',
			blobStoragePath: 'Container',
			documentVersion: [
				{
					publishedStatus: 'awaiting_upload'
				}
			]
		});
		databaseConnector.folder.findUnique.mockResolvedValue({
			caseId: 1
		});
		databaseConnector.documentVersion.update.mockResolvedValue(document1);

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'uploading'
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			caseId: 1,
			guid: 'D1234',
			status: 'awaiting_virus_check'
		});
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: 'D1234', version: 1 } },
			data: {
				publishedStatus: 'awaiting_virus_check'
			}
		});
	});

	test('throws error if incorrect machine action', async () => {
		// GIVEN

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'wrong-action'
		});

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				application: "Could not transition 'awaiting_upload' using 'wrong-action'."
			}
		});
	});

	test("throws error if incorrect machine action given the document's current state", async () => {
		// GIVEN

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'check_fail'
		});

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				application: "Could not transition 'awaiting_upload' using 'check_fail'."
			}
		});
	});

	test('throws error if no machine action provided', async () => {
		// GIVEN

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send();

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				machineAction: 'Please provide a value for machine action'
			}
		});
	});
});

describe('Update document statuses and redacted statuses', () => {
	test('updates document status to not_user_checked AND redacted status to redacted', async () => {
		// GIVEN
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'documenttoupdate_1_guid',
			name: 'davids doc xxxx',
			folderId: 2,
			blobStorageContainer: 'Container',
			blobStoragePath: 'Container',
			documentVersion: [
				{
					documentGuid: 'documenttoupdate_1_guid',
					version: 1,
					description: 'davids doc',
					author: 'David',
					filter1: 'filter category',
					publishedStatus: 'awaiting_upload',
					redactedStatus: 'unredacted'
				}
			]
		});
		databaseConnector.folder.findUnique.mockResolvedValue({
			caseId: 1
		});
		databaseConnector.documentVersion.update.mockResolvedValue(documentToUpdate1);

		// WHEN
		const response = await request.patch('/applications/1/documents/update').send({
			status: 'not_user_checked',
			redacted: true,
			items: [{ guid: 'documenttoupdate_1_guid' }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: 'documenttoupdate_1_guid',
				redactedStatus: 'redacted',
				status: 'not_user_checked'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: 'documenttoupdate_1_guid', version: 1 } },
			data: {
				publishedStatus: 'not_user_checked',
				redactedStatus: 'redacted'
			}
		});
	});

	test('updates document status only to ready_to_publish', async () => {
		// GIVEN
		const documentResponseReadyToPublish = {
			caseId: 1,
			documentGuid: 'documenttoupdate_1a_guid',
			name: 'doc to update 2',
			description: 'doc with all required fields for publishing',
			publishedStatus: 'ready_to_publish',
			filter1: 'Filter Category 1',
			redactedStatus: 'unredacted',
			author: 'David'
		};
		const documentVersionPreResponseReadyToPublish = {
			documentGuid: 'documenttoupdate_1a_guid',
			version: 1,
			description: 'doc with all required fields for publishing',
			author: 'David',
			filter1: 'Filter Category 1',
			publishedStatus: 'ready_to_publish',
			redactedStatus: 'unredacted'
		};

		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'documenttoupdate_1a_guid',
			name: 'davids doc xxxx',
			folderId: 2,
			blobStorageContainer: 'Container',
			blobStoragePath: 'Container',
			documentVersion: [
				{
					documentGuid: 'documenttoupdate_1a_guid',
					version: 1,
					description: 'davids doc',
					author: 'David',
					filter1: 'filter category',
					publishedStatus: 'awaiting_upload',
					redactedStatus: 'unredacted'
				}
			]
		});
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			documentVersionPreResponseReadyToPublish
		);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.update.mockResolvedValue(documentResponseReadyToPublish);

		// WHEN
		const response = await request.patch('/applications/1/documents/update').send({
			status: 'ready_to_publish',
			items: [{ guid: 'documenttoupdate_1a_guid' }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: 'documenttoupdate_1a_guid',
				redactedStatus: 'unredacted',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: 'documenttoupdate_1a_guid', version: 1 } },
			data: {
				publishedStatus: 'ready_to_publish'
			}
		});
	});

	test('updates document status only to not_user_checked - redacted status remains unchanged', async () => {
		// GIVEN
		const documentResponseUnredacted = {
			caseId: 1,
			documentGuid: 'documenttoupdate_2_guid',
			name: 'doc to update 2',
			description: 'doc with all required fields for publishing',
			publishedStatus: 'not_user_checked',
			filter1: 'Filter Category 1',
			redactedStatus: 'unredacted',
			author: 'David'
		};

		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'documenttoupdate_2_guid',
			name: 'davids doc xxxx',
			folderId: 2,
			blobStorageContainer: 'Container',
			blobStoragePath: 'Container',
			documentVersion: [
				{
					documentGuid: 'documenttoupdate_2_guid',
					version: 1,
					description: 'davids doc',
					author: 'David',
					filter1: 'filter category',
					publishedStatus: 'awaiting_upload',
					redactedStatus: 'unredacted'
				}
			]
		});
		databaseConnector.folder.findUnique.mockResolvedValue({
			caseId: 1
		});
		databaseConnector.documentVersion.update.mockResolvedValue(documentResponseUnredacted);

		// WHEN
		const response = await request.patch('/applications/1/documents/update').send({
			status: 'not_user_checked',
			items: [{ guid: 'documenttoupdate_2_guid' }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: 'documenttoupdate_2_guid',
				redactedStatus: 'unredacted',
				status: 'not_user_checked'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: 'documenttoupdate_2_guid', version: 1 } },
			data: {
				publishedStatus: 'not_user_checked'
			}
		});
	});

	test('updates redacted status only to redacted - document status remains unchanged', async () => {
		// GIVEN
		const documentResponseStatusUnchanged = {
			caseId: 1,
			documentGuid: 'documenttoupdate_3_guid',
			name: 'doc to update 3',
			description: 'doc with all required fields for publishing',
			publishedStatus: 'awaiting_upload',
			redactedStatus: 'redacted'
		};

		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'documenttoupdate_3_guid',
			name: 'davids doc xxxx',
			folderId: 2,
			blobStorageContainer: 'Container',
			blobStoragePath: 'Container',
			documentVersion: [
				{
					documentGuid: 'documenttoupdate_3_guid',
					version: 1,
					description: 'davids doc',
					publishedStatus: 'awaiting_upload',
					redactedStatus: 'unredacted'
				}
			]
		});
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.update.mockResolvedValue(documentResponseStatusUnchanged);

		// WHEN
		const response = await request.patch('/applications/1/documents/update').send({
			redacted: true,
			items: [{ guid: 'documenttoupdate_3_guid' }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: 'documenttoupdate_3_guid',
				redactedStatus: 'redacted',
				status: 'awaiting_upload'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: 'documenttoupdate_3_guid', version: 1 } },
			data: {
				redactedStatus: 'redacted'
			}
		});
	});
});
