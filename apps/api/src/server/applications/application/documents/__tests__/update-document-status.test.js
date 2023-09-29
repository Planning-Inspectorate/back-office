import { request } from '../../../../app-test.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const document1 = {
	guid: 'D1234',
	folderId: 2,
	privateBlobContainer: 'Container',
	privateBlobPath: 'Container',
	caseId: 1,
	latestVersionNo: 1
};

const documentVersion1 = {
	caseId: 1,
	documentGuid: 'D1234',
	publishedStatus: 'awaiting_virus_check',
	Document: document1
};

const documentToUpdate1 = {
	caseId: 1,
	documentGuid: 'documenttoupdate_1_guid',
	description: 'doc with all required fields for publishing',
	publishedStatus: 'not_checked',
	filter1: 'Filter Category 1',
	redactedStatus: 'redacted',
	author: 'David'
};

// --------------------------------------------------------------------------------------------------

describe('Update document status when awaiting_virus_check', () => {
	test('updates document status when awaiting_virus_check', async () => {
		// GIVEN
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'D1234',

			folderId: 2,
			privateBlobContainer: 'Container',
			privateBlobPath: 'Container',
			caseId: 1,
			latestVersionNo: 1,
			documentVersion: [
				{
					publishedStatus: 'awaiting_upload'
				}
			]
		});
		databaseConnector.documentVersion.update.mockResolvedValue(documentVersion1);

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'awaiting_virus_check'
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
			},
			include: {
				Document: {
					include: {
						case: true
					}
				}
			}
		});
	});
});

describe('Update document statuses and redacted statuses', () => {
	test('updates document status to not_checked AND redacted status to redacted', async () => {
		// GIVEN
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'documenttoupdate_1_guid',

			folderId: 2,
			privateBlobContainer: 'Container',
			privateBlobPath: 'Container',
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
			],
			latestDocumentVersion: documentToUpdate1
		});
		databaseConnector.folder.findUnique.mockResolvedValue({
			caseId: 1
		});
		databaseConnector.documentVersion.update.mockResolvedValue(documentToUpdate1);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			status: 'not_checked',
			redacted: true,
			documents: [{ guid: 'documenttoupdate_1_guid' }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: 'documenttoupdate_1_guid',
				redactedStatus: 'redacted',
				status: 'not_checked'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: 'documenttoupdate_1_guid', version: 1 } },
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				publishedStatus: 'not_checked',
				redactedStatus: 'redacted'
			}
		});
	});

	test('updates document status only to ready_to_publish', async () => {
		// GIVEN
		const documentResponseReadyToPublish = {
			caseId: 1,
			documentGuid: 'documenttoupdate_1a_guid',

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
			redactedStatus: 'unredacted'
		};

		databaseConnector.document.findMany.mockResolvedValue([
			[
				{
					guid: 'documenttoupdate_1a_guid',

					folderId: 2,
					privateBlobContainer: 'Container',
					privateBlobPath: 'Container',
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
					],
					latestDocumentVersion: documentVersionPreResponseReadyToPublish
				}
			]
		]);
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'documenttoupdate_1a_guid',

			folderId: 2,
			privateBlobContainer: 'Container',
			privateBlobPath: 'Container',
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
			],
			latestDocumentVersion: documentVersionPreResponseReadyToPublish
		});
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			documentVersionPreResponseReadyToPublish
		);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.update.mockResolvedValue(documentResponseReadyToPublish);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			status: 'ready_to_publish',
			documents: [{ guid: 'documenttoupdate_1a_guid' }]
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
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				publishedStatus: 'ready_to_publish'
			}
		});
	});

	test('updates document status only to not_checked - redacted status remains unchanged', async () => {
		// GIVEN
		const documentResponseUnredacted = {
			caseId: 1,
			documentGuid: 'documenttoupdate_2_guid',

			description: 'doc with all required fields for publishing',
			publishedStatus: 'not_checked',
			filter1: 'Filter Category 1',
			redactedStatus: 'unredacted',
			author: 'David'
		};

		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'documenttoupdate_2_guid',

			folderId: 2,
			privateBlobContainer: 'Container',
			privateBlobPath: 'Container',
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
			],
			latestDocumentVersion: documentToUpdate1
		});
		databaseConnector.folder.findUnique.mockResolvedValue({
			caseId: 1
		});
		databaseConnector.documentVersion.update.mockResolvedValue(documentResponseUnredacted);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			status: 'not_checked',
			documents: [{ guid: 'documenttoupdate_2_guid' }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: 'documenttoupdate_2_guid',
				redactedStatus: 'unredacted',
				status: 'not_checked'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: 'documenttoupdate_2_guid', version: 1 } },
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				publishedStatus: 'not_checked'
			}
		});
	});

	test('updates redacted status only to redacted - document status remains unchanged', async () => {
		// GIVEN
		const documentResponseStatusUnchanged = {
			caseId: 1,
			documentGuid: 'documenttoupdate_3_guid',

			description: 'doc with all required fields for publishing',
			publishedStatus: 'awaiting_upload',
			redactedStatus: 'redacted'
		};

		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'documenttoupdate_3_guid',

			folderId: 2,
			privateBlobContainer: 'Container',
			privateBlobPath: 'Container',
			documentVersion: [
				{
					documentGuid: 'documenttoupdate_3_guid',
					version: 1,
					description: 'davids doc',
					publishedStatus: 'awaiting_upload',
					redactedStatus: 'unredacted'
				}
			],
			latestDocumentVersion: documentToUpdate1
		});
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.update.mockResolvedValue(documentResponseStatusUnchanged);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			redacted: true,
			documents: [{ guid: 'documenttoupdate_3_guid' }]
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
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				redactedStatus: 'redacted'
			}
		});
	});

	test('updates published status, and sets previous published status', async () => {
		// GIVEN
		const updatedDocument = {
			caseId: 1,
			documentGuid: 'documenttoupdate_1a_guid',

			description: 'doc with all required fields for publishing',
			publishedStatus: 'ready_to_publish',
			filter1: 'Filter Category 1',
			redactedStatus: 'unredacted',
			author: 'David'
		};
		const documentVersion = {
			documentGuid: 'documenttoupdate_1a_guid',
			version: 1,
			description: 'doc with all required fields for publishing',
			author: 'David',
			filter1: 'Filter Category 1',
			publishedStatus: 'checked',
			redactedStatus: 'unredacted'
		};
		const document = {
			...updatedDocument,
			documentVersion
		};

		databaseConnector.document.findMany.mockResolvedValue([document]);
		databaseConnector.document.findUnique.mockResolvedValue({
			...document,
			latestDocumentVersion: documentVersion
		});
		databaseConnector.documentVersion.findUnique.mockResolvedValue(documentVersion);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.update.mockResolvedValue(updatedDocument);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			status: 'ready_to_publish',
			documents: [{ guid: 'documenttoupdate_1a_guid' }]
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
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				publishedStatus: 'ready_to_publish',
				publishedStatusPrev: 'checked'
			}
		});
	});

	describe('revert document published status', () => {
		const tests = [
			{
				guid: 'not-a-document-guid',
				want: {
					status: 404,
					body: {
						errors: 'No document found'
					},
					update: false
				}
			},
			{
				guid: 'document-guid',
				document: {},
				documentVersion: null,
				want: {
					status: 404,
					body: {
						errors: 'No document found'
					},
					update: false
				}
			},
			{
				guid: 'document-guid',
				document: {},
				documentVersion: {},
				want: {
					status: 412,
					body: {
						errors: 'No previous published status to revert to'
					},
					update: false
				}
			},
			{
				guid: 'document-guid',
				document: {},
				documentVersion: {
					publishedStatus: 'ready_to_publish',
					publishedStatusPrev: 'checked'
				},
				want: {
					status: 200,
					body: {},
					update: {
						publishedStatus: 'checked',
						publishedStatusPrev: null
					}
				}
			}
		];

		for (const { name, guid, document, documentVersion, want } of tests) {
			test('' + name, async () => {
				// setup
				databaseConnector.document.findUnique.mockReset();
				databaseConnector.documentVersion.findUnique.mockReset();

				if (document) {
					databaseConnector.document.findUnique.mockResolvedValueOnce({
						...document,
						latestDocumentVersion: documentVersion
					});
				}

				if (documentVersion) {
					databaseConnector.documentVersion.findUnique.mockResolvedValueOnce(documentVersion);
				}

				// action
				const response = await request.post(
					`/applications/1/documents/${guid}/revert-published-status`
				);

				// checks
				expect(response.status).toEqual(want.status);
				expect(response.body).toEqual(want.body);
				if (want.update) {
					// this is OK because we always run some checks
					// eslint-disable-next-line jest/no-conditional-expect
					expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
						where: { documentGuid_version: { documentGuid: guid, version: 1 } },
						include: {
							Document: {
								include: {
									case: true
								}
							}
						},
						data: want.update
					});
				}
			});
		}
	});
});
