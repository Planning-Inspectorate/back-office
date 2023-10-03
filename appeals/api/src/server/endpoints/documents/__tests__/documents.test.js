// @ts-nocheck
import { jest } from '@jest/globals';
import * as folderRepository from '#repositories/folder.repository.js';
import {
	appeal,
	folder,
	addDocumentsRequest,
	addDocumentVersionRequest,
	blobInfo,
	documentCreated,
	documentUpdated,
	documentVersionCreated,
	documentVersionRetrieved,
	savedFolder
} from '#tests/documents/mocks.js';
import * as mappers from '../documents.mapper.js';
import * as service from '../documents.service.js';
import * as controller from '../documents.controller.js';
import { request } from '../../../app-test.js';
import {
	azureAdUserId,
	documentRedactionStatuses,
	documentRedactionStatusIds,
	householdAppeal
} from '../../../tests/data.js';
import joinDateAndTime from '#utils/join-date-and-time.js';
import {
	AUDIT_TRAIL_DOCUMENT_UPLOADED,
	ERROR_DOCUMENT_REDACTION_STATUSES_MUST_BE_ONE_OF,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_UUID,
	ERROR_NOT_FOUND
} from '#endpoints/constants.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const { default: got } = await import('got');

describe('/appeals/:appealId/document-folders/:folderId', () => {
	describe('GET', () => {
		test('gets a single document folder', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			databaseConnector.folder.findUnique.mockResolvedValue(savedFolder);

			const response = await request
				.get(`/appeals/${householdAppeal.id}/document-folders/${savedFolder.id}`)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				id: savedFolder.id,
				path: savedFolder.path,
				caseId: savedFolder.caseId,
				documents: [
					{
						id: savedFolder.documents[0].guid,
						name: savedFolder.documents[0].name
					}
				]
			});
		});
	});
});

describe('/appeals/:appealId/documents', () => {
	let requestBody;

	beforeEach(() => {
		requestBody = {
			documents: [
				{
					id: '987e66e0-1db4-404b-8213-8082919159e9',
					receivedDate: '2023-09-22',
					redactionStatus: 1
				},
				{
					id: '8b107895-b8c9-467f-aad0-c09daafeaaad',
					receivedDate: '2023-09-23',
					redactionStatus: 2
				}
			]
		};
	});

	describe('PATCH', () => {
		test('updates multiple documents', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			databaseConnector.documentRedactionStatus.findMany.mockResolvedValue(
				documentRedactionStatuses
			);

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(databaseConnector.document.update).toHaveBeenCalledTimes(2);
			expect(databaseConnector.document.update).toHaveBeenCalledWith({
				data: {
					receivedAt: joinDateAndTime(requestBody.documents[0].receivedDate),
					documentRedactionStatusId: requestBody.documents[0].redactionStatus
				},
				where: {
					guid: requestBody.documents[0].id
				}
			});
			expect(databaseConnector.document.update).toHaveBeenCalledWith({
				data: {
					receivedAt: joinDateAndTime(requestBody.documents[1].receivedDate),
					documentRedactionStatusId: requestBody.documents[1].redactionStatus
				},
				where: {
					guid: requestBody.documents[1].id
				}
			});
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				documents: [
					{
						id: requestBody.documents[0].id,
						receivedDate: joinDateAndTime(requestBody.documents[0].receivedDate),
						redactionStatus: requestBody.documents[0].redactionStatus
					},
					{
						id: requestBody.documents[1].id,
						receivedDate: joinDateAndTime(requestBody.documents[1].receivedDate),
						redactionStatus: requestBody.documents[1].redactionStatus
					}
				]
			});
		});

		test('returns an error if appealId is not numeric', async () => {
			const response = await request
				.patch('/appeals/one/documents')
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					appealId: ERROR_MUST_BE_NUMBER
				}
			});
		});

		test('returns an error if appealId is not found', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(null);

			const response = await request
				.patch('/appeals/3/documents')
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(404);
			expect(response.body).toEqual({
				errors: {
					appealId: ERROR_NOT_FOUND
				}
			});
		});

		test('returns an error if documents.*.id is not given', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

			delete requestBody.documents[0].id;

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					'documents[0].id': ERROR_MUST_BE_UUID
				}
			});
		});

		test('returns an error if documents.*.id is not a uuid', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

			requestBody.documents[0].id = 1;

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					'documents[0].id': ERROR_MUST_BE_UUID
				}
			});
		});

		test('returns an error if documents.*.receivedDate is not given', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

			delete requestBody.documents[0].receivedDate;

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					'documents[0].receivedDate': ERROR_MUST_BE_CORRECT_DATE_FORMAT
				}
			});
		});

		test('returns an error if documents.*.receivedDate is not in the correct format', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

			requestBody.documents[0].receivedDate = '22/09/2023';

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					'documents[0].receivedDate': ERROR_MUST_BE_CORRECT_DATE_FORMAT
				}
			});
		});

		test('returns an error if documents.*.receivedDate does not contain leading zeros', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

			requestBody.documents[0].receivedDate = '2023-5-5';

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					'documents[0].receivedDate': ERROR_MUST_BE_CORRECT_DATE_FORMAT
				}
			});
		});

		test('returns an error if documents.*.receivedDate is not a valid date', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

			requestBody.documents[0].receivedDate = '2023-02-30';

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					'documents[0].receivedDate': ERROR_MUST_BE_CORRECT_DATE_FORMAT
				}
			});
		});

		test('returns an error if documents.*.redactionStatus is not given', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			databaseConnector.documentRedactionStatus.findMany.mockResolvedValue(
				documentRedactionStatuses
			);

			delete requestBody.documents[0].redactionStatus;

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					documents: stringTokenReplacement(ERROR_DOCUMENT_REDACTION_STATUSES_MUST_BE_ONE_OF, [
						documentRedactionStatusIds.join(', ')
					])
				}
			});
		});

		test('returns an error if documents.*.redactionStatus is a value that does not exist', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			databaseConnector.documentRedactionStatus.findMany.mockResolvedValue(
				documentRedactionStatuses
			);

			requestBody.documents[0].redactionStatus = 4;

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/documents`)
				.send(requestBody)
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					documents: stringTokenReplacement(ERROR_DOCUMENT_REDACTION_STATUSES_MUST_BE_ONE_OF, [
						documentRedactionStatusIds.join(', ')
					])
				}
			});
		});
	});

	describe('POST', () => {
		test('updates multiple documents', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			databaseConnector.documentRedactionStatus.findMany.mockResolvedValue(
				documentRedactionStatuses
			);
			databaseConnector.user.upsert.mockResolvedValue({
				id: 1,
				azureAdUserId
			});

			databaseConnector.$transaction = jest.fn().mockImplementation((callback) =>
				callback({
					document: {
						create: jest.fn().mockResolvedValue(documentCreated),
						update: jest.fn().mockResolvedValue(documentUpdated)
					},
					documentVersion: {
						upsert: jest.fn().mockResolvedValue(documentVersionCreated),
						findFirst: jest.fn().mockResolvedValue(documentVersionRetrieved)
					}
				})
			);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/documents`)
				.send({
					...requestBody,
					blobStorageHost: 'blobStorageHost',
					blobStorageContainer: 'blobStorageContainer'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(databaseConnector.document.update).toHaveBeenCalledTimes(2);
			expect(databaseConnector.document.update).toHaveBeenCalledWith({
				data: {
					receivedAt: joinDateAndTime(requestBody.documents[0].receivedDate),
					documentRedactionStatusId: requestBody.documents[0].redactionStatus
				},
				where: {
					guid: requestBody.documents[0].id
				}
			});
			expect(databaseConnector.document.update).toHaveBeenCalledWith({
				data: {
					receivedAt: joinDateAndTime(requestBody.documents[1].receivedDate),
					documentRedactionStatusId: requestBody.documents[1].redactionStatus
				},
				where: {
					guid: requestBody.documents[1].id
				}
			});
			expect(databaseConnector.auditTrail.create).toHaveBeenCalledTimes(2);
			expect(databaseConnector.auditTrail.create).toHaveBeenCalledWith({
				data: {
					appealId: householdAppeal.id,
					details: stringTokenReplacement(AUDIT_TRAIL_DOCUMENT_UPLOADED, [documentUpdated.name]),
					loggedAt: expect.any(Date),
					userId: householdAppeal.caseOfficer.id
				}
			});
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				documents: [
					{
						GUID: documentUpdated.guid,
						blobStoreUrl: `appeal/${householdAppeal.reference.replace(/\//g, '-')}/${
							documentUpdated.guid
						}/v1/${documentUpdated.name}`,
						documentName: documentUpdated.name
					},
					{
						GUID: documentUpdated.guid,
						blobStoreUrl: `appeal/${householdAppeal.reference.replace(/\//g, '-')}/${
							documentUpdated.guid
						}/v1/${documentUpdated.name}`,
						documentName: documentUpdated.name
					}
				]
			});
		});
	});
});

describe('appeals documents', () => {
	describe('appeals folders', () => {
		test('all document folders are linked to the correct appeal', async () => {
			const appealId = 2000;
			const foldersForCase = mappers.mapDefaultCaseFolders(appealId);
			expect(foldersForCase.length).toBeGreaterThan(0);
			foldersForCase.forEach((f) => expect(f.caseId).toEqual(appealId));
		});

		test('finds all top level folders when case has folders attached', async () => {
			databaseConnector.folder.findMany.mockResolvedValue(mappers.mapDefaultCaseFolders(10));
			const folders = await folderRepository.getByCaseId(10);
			expect(folders).toEqual(mappers.mapDefaultCaseFolders(10));
		});
	});

	describe('mappers', () => {
		test('appeal reference is safely escaped for blob URLs', async () => {
			const mappedRef = mappers.mapCaseReferenceForStorageUrl(appeal.reference);
			expect(mappedRef).not.toContain('/');
			expect(blobInfo.blobStoreUrl).toContain(mappedRef);
		});

		test('blob URL includes GUID and version', async () => {
			const mappedPath = mappers.mapBlobPath(
				blobInfo.GUID,
				blobInfo.caseReference,
				blobInfo.documentName || 'test',
				1
			);
			expect(mappedPath).toContain('/v1/');
			expect(mappedPath).toContain(blobInfo.GUID);
		});
	});

	describe('post documents', () => {
		test('post single document throws error when case not exist', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(null);
			got.post.mockReturnValue({ json: jest.fn().mockResolvedValue(null) });
			await expect(controller.addDocuments).rejects.toThrow(Error);
		});

		test('add new version thows error when document not exist', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(appeal);
			databaseConnector.document.findUnique.mockResolvedValue(null);
			got.post.mockReturnValue({ json: jest.fn().mockResolvedValue(null) });

			await expect(service.addVersionToDocument).rejects.toThrow(Error);
		});

		test('post single document', async () => {
			const mappedReq = mappers.mapDocumentsForDatabase(
				appeal.id,
				addDocumentsRequest.blobStorageHost,
				addDocumentsRequest.blobStorageContainer,
				addDocumentsRequest.documents
			);
			mappedReq.forEach((m) => {
				expect(m.blobStorageHost).toEqual(addDocumentsRequest.blobStorageHost);
				expect(m.blobStorageContainer).toEqual(addDocumentsRequest.blobStorageContainer);
			});

			const prismaMock = {
				document: {
					create: jest.fn().mockResolvedValue(documentCreated),
					update: jest.fn().mockResolvedValue(documentUpdated)
				},
				documentVersion: {
					upsert: jest.fn().mockResolvedValue(documentVersionCreated),
					findFirst: jest.fn().mockResolvedValue(documentVersionRetrieved)
				}
			};

			databaseConnector.$transaction = jest
				.fn()
				.mockImplementation((callback) => callback(prismaMock));
			const response = await service.addDocumentsToAppeal(addDocumentsRequest, appeal);
			expect(response).toEqual({ documents: [blobInfo] });
		});

		test('post new document version', async () => {
			const mappedReq = mappers.mapDocumentsForDatabase(
				appeal.id,
				addDocumentVersionRequest.blobStorageHost,
				addDocumentVersionRequest.blobStorageContainer,
				[addDocumentVersionRequest.document]
			);
			mappedReq.forEach((m) => {
				expect(m.blobStorageHost).toEqual(addDocumentVersionRequest.blobStorageHost);
				expect(m.blobStorageContainer).toEqual(addDocumentVersionRequest.blobStorageContainer);
			});

			const prismaMock = {
				document: {
					findFirst: jest.fn().mockResolvedValue(documentCreated),
					update: jest.fn().mockResolvedValue(documentUpdated)
				},
				documentVersion: {
					upsert: jest.fn().mockResolvedValue(documentVersionCreated),
					findFirst: jest.fn().mockResolvedValue(documentVersionRetrieved)
				}
			};

			databaseConnector.$transaction = jest
				.fn()
				.mockImplementation((callback) => callback(prismaMock));

			const response = await service.addVersionToDocument(
				addDocumentVersionRequest,
				appeal,
				documentCreated.guid
			);
			expect(response).toEqual({ documents: [blobInfo] });
		});
	});

	describe('documents services', () => {
		test('get folders for appeal', async () => {
			databaseConnector.folder.findMany.mockReturnValue([folder]);
			const folders = await service.getFoldersForAppeal(appeal, 'appellantCase');
			expect(folders).toEqual([folder]);
		});
	});
});
