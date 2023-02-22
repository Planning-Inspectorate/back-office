import supertest from 'supertest';
import { app } from '../../../../app.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const request = supertest(app);

const application = {
	id: 1,
	reference: 'case reference'
};

describe('Update Document', () => {
	test('updates document setting status and redacted status', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue({
			id: 9,
			version: null,
			createdAt: '2023-02-28T11:59:38.129Z',
			lastModified: null,
			documentType: '',
			published: false,
			sourceSystem: null,
			origin: null,
			representative: null,
			description: null,
			documentGuid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99',
			datePublished: null,
			owner: null,
			author: 'joe blogs',
			securityClassification: null,
			mime: null,
			horizonDataID: null,
			redacted: false,
			fileMD5: null,
			path: null,
			virusCheckStatus: null,
			size: null,
			stage: null,
			filter1: null,
			filter2: null,
			webfilter: null,
			Document: {
				guid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99',
				name: '5',
				folderId: 5391,
				blobStorageContainer: 'document-service-uploads',
				blobStoragePath: '/application/BC010001/1111-2222-3333/my doc.pdf',
				status: 'awaiting_upload',
				isDeleted: false,
				createdAt: '2023-02-28T11:59:38.129Z',
				fileSize: 0,
				fileType: null,
				versionId: 9,
				folder: {
					id: 5391,
					displayNameEn: '5ssssssssssxxds',
					displayOrder: null,
					parentFolderId: null,
					caseId: 5,
					case: {
						id: 5,
						reference: 'BC0210002',
						modifiedAt: '2023-02-28T10:21:40.758Z',
						createdAt: '2023-02-28T10:21:40.761Z',
						description:
							'A description of test case 2 which is a case of subsector type Research and Development of Products or Processes',
						publishedAt: null,
						title: 'Research and Development of Products or Processes Test Application 2',
						CaseStatus: [
							{
								id: 5,
								status: 'acceptance',
								createdAt: '2023-02-28T10:21:40.761Z',
								valid: true,
								subStateMachineName: null,
								compoundStateName: null,
								caseId: 5
							}
						]
					}
				}
			}
		});

		// WHEN
		const response = await request
			.patch('/applications/1/documents/update')
			.send({ status: 'not_user_checked', redacted: true, items: [{ guid: '1111-2222-3333' }] });

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: '1111-2222-3333'
			}
		]);

		expect(databaseConnector.document.update).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333'
			},
			data: {
				redacted: true,
				status: 'not_user_checked'
			}
		});
	});

	test('throws error if document id does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request
			.patch('/applications/1/documents/update')
			.send({ status: 'not_user_checked', redacted: true, items: [{ guid: 'xxxxx' }] });

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				items: 'Unknown document guid xxxxx'
			}
		});
	});

	test('throws error if no document ids are specified', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request
			.patch('/applications/1/documents/update')
			.send([{ status: 'not_user_checked' }]);

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				items: 'No document guids specified'
			}
		});
	});

	test('checks invalid case id', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request
			.patch('/applications/2/documents/update')
			.send([{ status: 'not_user_checked', items: [{ guid: 'xxxxx' }] }]);

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});

	test('returns document properties for a single document on a case', async () => {
		// GIVEN
		databaseConnector.document.findFirst.mockResolvedValue({
			blobStorageContainer: '',
			blobStoragePath: '',
			status: 'awaiting_upload',
			guid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99'
		});

		databaseConnector.documentVersion.findUnique.mockResolvedValue({
			id: 9,
			version: null,
			createdAt: '2023-02-28T11:59:38.129Z',
			lastModified: null,
			documentType: '',
			published: false,
			sourceSystem: null,
			origin: null,
			representative: null,
			description: null,
			documentGuid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99',
			datePublished: null,
			owner: null,
			author: 'joe blogs',
			securityClassification: null,
			mime: null,
			horizonDataID: null,
			redacted: false,
			fileMD5: null,
			path: null,
			virusCheckStatus: null,
			size: null,
			stage: null,
			filter1: null,
			filter2: null,
			webfilter: null,
			Document: {
				guid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99',
				name: '5',
				folderId: 5391,
				blobStorageContainer: 'document-service-uploads',
				blobStoragePath: '/application/BC010001/1111-2222-3333/my doc.pdf',
				status: 'awaiting_upload',
				isDeleted: false,
				createdAt: '2023-02-28T11:59:38.129Z',
				fileSize: 0,
				fileType: null,
				versionId: 9,
				folder: {
					id: 5391,
					displayNameEn: '5ssssssssssxxds',
					displayOrder: null,
					parentFolderId: null,
					caseId: 5,
					case: {
						id: 5,
						reference: 'BC0210002',
						modifiedAt: '2023-02-28T10:21:40.758Z',
						createdAt: '2023-02-28T10:21:40.761Z',
						description:
							'A description of test case 2 which is a case of subsector type Research and Development of Products or Processes',
						publishedAt: null,
						title: 'Research and Development of Products or Processes Test Application 2',
						CaseStatus: [
							{
								id: 5,
								status: 'acceptance',
								createdAt: '2023-02-28T10:21:40.761Z',
								valid: true,
								subStateMachineName: null,
								compoundStateName: null,
								caseId: 5
							}
						]
					}
				}
			}
		});

		// WHEN
		const response = await request.get(
			'/applications/1/documents/a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99/properties'
		);

		// THEN

		expect(databaseConnector.documentVersion.findUnique).toBeCalledWith({
			where: {
				documentGuid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99'
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
		expect(response.status).toEqual(200);

		expect(response.body).toEqual({
			documentGuid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99',
			documentId: '',
			caseRef: 'BC0210002',
			documentName: '5',
			sourceSystem: 'Back Office',
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my doc.pdf',
			author: 'joe blogs',
			fileName: '',
			originalFilename: '',
			dateCreated: null,
			size: 0,
			mime: '',
			publishedStatus: '',
			redactedStatus: '',
			status: 'awaiting_upload',
			datePublished: null,
			description: null,
			version: null,
			agent: null,
			stage: null,
			documentType: '',
			filter1: null,
			examinationRefNo: ''
		});
	});

	test('checks invalid case id on document properties call', async () => {
		// GIVEN
		databaseConnector.document.findFirst.mockResolvedValue(null);

		// WHEN
		const response = await request.get('/applications/999999/documents/1111-2222-3333/properties');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: 'document not found guid 1111-2222-3333 related to casedId 999999'
		});
	});
});
