import { jest } from '@jest/globals';
import { request } from '#app-test';
const { databaseConnector } = await import('#utils/database-connector.js');
const { eventClient } = await import('#infrastructure/event-client.js');
import { EventType } from '@pins/event-client';
import { NSIP_DOCUMENT } from '#infrastructure/topics.js';

const dateDocCreated = '2022-01-01T11:59:38.129Z';
const dateDocLastModified = '2024-02-05T11:59:38.129Z';
const docGuid = 'D1234';
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

const document1 = {
	guid: docGuid,
	folderId: 2,
	privateBlobContainer: 'test-container',
	privateBlobPath: 'test-path',
	caseId: 1,
	latestVersionNo: 1,
	reference: null,
	folder: {
		case: application1
	},
	case: application1
};
const documentVersion1 = {
	version: 1,
	documentId: 12,
	caseId: 1,
	documentGuid: docGuid,
	publishedStatus: 'not_checked',
	redactedStatus: 'redacted',
	fileName: 'test-filename',
	originalFilename: 'test-original-filename',
	size: 23452,
	author: 'Billy B',
	privateBlobContainer: 'test-container',
	privateBlobPath: 'test-path',
	publishedBlobContainer: 'test-container',
	publishedBlobPath: 'test-path',
	dateCreated: new Date(dateDocCreated),
	lastModified: new Date(dateDocLastModified),
	filter1: 'Filter Category 1'
};

const documentWithDocumentVersionWithLatest = {
	...document1,
	documentVersion: [documentVersion1],
	latestDocumentVersion: documentVersion1
};

const documentVersionWithDocument = {
	...documentVersion1,
	Document: document1
};

const expectedEventPayload = {
	documentId: docGuid,
	caseId: 1,
	caseRef: 'EN0110001',
	reference: null,
	version: 1,
	filename: 'test-filename',
	originalFilename: 'test-original-filename',
	size: 23452,
	documentURI: 'https://127.0.0.1:10000/test-container/test-path',
	dateCreated: dateDocCreated,
	lastModified: dateDocLastModified,
	author: 'Billy B',
	publishedStatus: 'not_checked',
	redactedStatus: 'redacted',
	publishedDocumentURI: 'https://127.0.0.1:10000/test-container/test-path',
	filter1: 'Filter Category 1'
};

// -------   TESTS   ---------------------------------------------------------------

describe('Update document status when awaiting_virus_check', () => {
	test('updates document status when awaiting_virus_check', async () => {
		// GIVEN
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: docGuid,
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
		let documentVersionWithDocumentAfterUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'awaiting_virus_check'
		};
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch(`/applications/documents/${docGuid}/status`).send({
			machineAction: 'awaiting_virus_check'
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			caseId: 1,
			guid: docGuid,
			status: 'awaiting_virus_check'
		});
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: docGuid, version: 1 } },
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
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('updates document status to not_checked AND redacted status to redacted', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'awaiting_virus_check';
		docBeforeUpdate.documentVersion[0].redactedStatus = 'unredacted';

		let documentVersionWithDocumentAfterUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'not_checked',
			redactedStatus: 'redacted'
		};
		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			status: 'not_checked',
			redacted: true,
			documents: [{ guid: docGuid }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: docGuid,
				redactedStatus: 'redacted',
				status: 'not_checked'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: docGuid, version: 1 } },
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				publishedStatus: 'not_checked',
				publishedStatusPrev: 'awaiting_virus_check',
				redactedStatus: 'redacted'
			}
		});

		// expect event broadcast
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[expectedEventPayload],
			EventType.Update
		);
	});

	test('updates document status only to ready_to_publish', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'not_checked';

		let docVersionWithDocumentBeforeUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'not_checked',
			redactedStatus: 'unredacted'
		};
		let documentVersionWithDocumentAfterUpdate = {
			...docVersionWithDocumentBeforeUpdate,
			publishedStatus: 'ready_to_publish'
		};
		let findManyDocs = [
			{
				guid: docGuid,
				latestVersionId: 1,
				latestDocumentVersion: documentVersion1
			}
		];
		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			docVersionWithDocumentBeforeUpdate
		);
		databaseConnector.document.findMany.mockResolvedValue(findManyDocs);
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			status: 'ready_to_publish',
			documents: [{ guid: docGuid }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: docGuid,
				redactedStatus: 'unredacted',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: docGuid, version: 1 } },
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				publishedStatus: 'ready_to_publish',
				publishedStatusPrev: 'not_checked',
				redactedStatus: undefined
			}
		});

		// expect event broadcast
		let expectedEventPayloadAmended = {
			...expectedEventPayload,
			publishedStatus: 'ready_to_publish',
			redactedStatus: 'unredacted'
		};
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[expectedEventPayloadAmended],
			EventType.Update
		);
	});

	test('updates document status only to not_checked - redacted status remains unchanged', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'awaiting_virus_check';
		docBeforeUpdate.documentVersion[0].redactedStatus = 'unredacted';

		let docVersionWithDocumentBeforeUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'awaiting_virus_check',
			redactedStatus: 'unredacted'
		};
		let documentVersionWithDocumentAfterUpdate = {
			...docVersionWithDocumentBeforeUpdate,
			publishedStatus: 'not_checked',
			redactedStatus: 'unredacted'
		};
		let findManyDocs = [
			{
				guid: docGuid,
				latestVersionId: 1,
				latestDocumentVersion: documentVersion1
			}
		];
		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			docVersionWithDocumentBeforeUpdate
		);
		databaseConnector.document.findMany.mockResolvedValue(findManyDocs);
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			status: 'not_checked',
			documents: [{ guid: docGuid }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: docGuid,
				redactedStatus: 'unredacted',
				status: 'not_checked'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: docGuid, version: 1 } },
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				publishedStatus: 'not_checked',
				publishedStatusPrev: 'awaiting_virus_check',
				redactedStatus: undefined
			}
		});

		// expect event broadcast
		let expectedEventPayloadAmended = {
			...expectedEventPayload,
			publishedStatus: 'not_checked',
			redactedStatus: 'unredacted'
		};
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[expectedEventPayloadAmended],
			EventType.Update
		);
	});

	test('updates redacted status only to redacted - document status remains unchanged', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'not_checked';
		docBeforeUpdate.documentVersion[0].redactedStatus = 'unredacted';

		let docVersionWithDocumentBeforeUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'not_checked',
			redactedStatus: 'unredacted'
		};
		let documentVersionWithDocumentAfterUpdate = {
			...docVersionWithDocumentBeforeUpdate,
			publishedStatus: 'not_checked',
			redactedStatus: 'redacted'
		};
		let findManyDocs = [
			{
				guid: docGuid,
				latestVersionId: 1,
				latestDocumentVersion: documentVersion1
			}
		];
		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			docVersionWithDocumentBeforeUpdate
		);
		databaseConnector.document.findMany.mockResolvedValue(findManyDocs);
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			redacted: true,
			documents: [{ guid: docGuid }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: docGuid,
				redactedStatus: 'redacted',
				status: 'not_checked'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: docGuid, version: 1 } },
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

		// expect event broadcast
		let expectedEventPayloadAmended = {
			...expectedEventPayload,
			publishedStatus: 'not_checked',
			redactedStatus: 'redacted'
		};
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[expectedEventPayloadAmended],
			EventType.Update
		);
	});

	test('updates published status, and sets previous published status', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		let docBeforeUpdate = documentWithDocumentVersionWithLatest;
		docBeforeUpdate.documentVersion[0].publishedStatus = 'not_checked';
		docBeforeUpdate.documentVersion[0].redactedStatus = 'unredacted';

		let docVersionWithDocumentBeforeUpdate = {
			...documentVersionWithDocument,
			publishedStatus: 'not_checked',
			redactedStatus: 'unredacted'
		};
		let documentVersionWithDocumentAfterUpdate = {
			...docVersionWithDocumentBeforeUpdate,
			publishedStatus: 'ready_to_publish',
			redactedStatus: 'unredacted',
			publishedStatusPrev: 'not_checked'
		};
		let findManyDocs = [
			{
				guid: docGuid,
				latestVersionId: 1,
				latestDocumentVersion: documentVersion1
			}
		];
		databaseConnector.document.findUnique.mockResolvedValue(docBeforeUpdate);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.findUnique.mockResolvedValue(
			docVersionWithDocumentBeforeUpdate
		);
		databaseConnector.document.findMany.mockResolvedValue(findManyDocs);
		databaseConnector.documentVersion.update.mockResolvedValue(
			documentVersionWithDocumentAfterUpdate
		);

		// WHEN
		const response = await request.patch('/applications/1/documents').send({
			status: 'ready_to_publish',
			documents: [{ guid: docGuid }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: docGuid,
				redactedStatus: 'unredacted',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: docGuid, version: 1 } },
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			data: {
				publishedStatus: 'ready_to_publish',
				publishedStatusPrev: 'not_checked'
			}
		});

		// expect event broadcast
		let expectedEventPayloadAmended = {
			...expectedEventPayload,
			publishedStatus: 'ready_to_publish',
			redactedStatus: 'unredacted'
		};
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_DOCUMENT,
			[expectedEventPayloadAmended],
			EventType.Update
		);
	});

	describe('revert document published status', () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		const tests = [
			{
				name: 'not-a-document-guid',
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
				name: 'document guid not found',
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
				name: 'no previous state to revert to',
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
				name: 'successful revert to checked status',
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
				databaseConnector.case.findUnique.mockResolvedValue(application1);
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
