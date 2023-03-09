import supertest from 'supertest';
import { app } from '../../../../app.js';
import { applicationFactoryForTests } from '../../../../utils/application-factory-for-tests.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const request = supertest(app);

const application1 = applicationFactoryForTests({
	id: 1,
	title: 'EN010003 - NI Case 3 Name',
	description: 'EN010003 - NI Case 3 Name Description',
	caseStatus: 'pre-application'
});

const folder1 = {
	id: 201,
	displayNameEn: 'Sub Folder 1',
	displayOrder: 100,
	parentFolderId: 20,
	caseId: 1
};

const level1Folders = [
	{
		id: 1,
		displayNameEn: 'Project documentation',
		displayOrder: 100,
		parentFolderId: null,
		caseId: 1
	},
	{
		id: 2,
		displayNameEn: 'Legal advice',
		displayOrder: 200,
		parentFolderId: null,
		caseId: 1
	}
];

const subFolders = [
	{
		id: 101,
		displayNameEn: 'Sub Folder 1',
		displayOrder: 100,
		parentFolderId: 201,
		caseId: 1
	},
	{
		id: 102,
		displayNameEn: 'Sub Folder 2',
		displayOrder: 200,
		parentFolderId: 201,
		caseId: 1
	}
];

const documents = [
	{
		guid: '1111-2222-3333',
		name: 'Document 1',
		folderId: 201,
		status: 'not_user_checked',
		blobStorageContainer: null,
		blobStoragePath: null,
		redacted: false,
		createdAt: new Date(1_658_486_313_000),
		fileType: 'application/pdf',
		fileSize: 1024,
		versionId: 9,
		documentVersion: {
			id: 9,
			version: 1_675_774,
			createdAt: null,
			lastModified: null,
			documentType: '',
			published: false,
			redacted: false,
			isDeleted: false,
			sourceSystem: null,
			origin: null,
			representative: null,
			description: null,
			documentGuid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99',
			owner: '',
			author: '',
			securityClassification: null,
			mime: null,
			horizonDataID: null,
			fileMD5: null,
			path: null,
			virusCheckStatus: null,
			size: 1024,
			stage: null,
			filter1: null,
			filter2: null,
			webfilter: '',
			status: 'not_user_checked'
		}
	}
];

const documentsInFolder201Count = 1;

describe('Get folder details', () => {
	test('returns level 1 folders for a case when id is valid', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findMany.mockResolvedValue(level1Folders);

		// WHEN
		const response = await request.get('/applications/1/folders');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: 1,
				displayNameEn: 'Project documentation',
				displayOrder: 100
			},
			{
				id: 2,
				displayNameEn: 'Legal advice',
				displayOrder: 200
			}
		]);
	});

	test('returns a single folder on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findUnique.mockResolvedValue(folder1);

		// WHEN
		const response = await request.get('/applications/1/folders/201');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			displayNameEn: 'Sub Folder 1',
			displayOrder: 100,
			id: 201
		});
	});

	test('returns the sub folders for a folder on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findMany.mockResolvedValue(subFolders);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });

		// WHEN
		const response = await request.get('/applications/1/folders/201/sub-folders');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: 101,
				displayNameEn: 'Sub Folder 1',
				displayOrder: 100
			},
			{
				id: 102,
				displayNameEn: 'Sub Folder 2',
				displayOrder: 200
			}
		]);
	});

	test('returns 400 error if sub folder id is not a folder on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.get('/applications/1/folders/1000/sub-folders');

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: { folderId: 'Must be an existing folder that belongs to this case' }
		});
	});

	// File tests
	test('returns 400 error getting documents if sub folder id is not a folder on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 10 });

		// WHEN
		const response = await request.post('/applications/1/folders/1000/documents').send({
			pageNumber: 1,
			pageSize: 1
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: { folderId: 'Must be an existing folder that belongs to this case' }
		});
	});

	test('returns 400 error getting documents if sub folder id is valid but not a folder on this case', async () => {
		// GIVEN

		// WHEN
		const response = await request.post('/applications/2/folders/201/documents').send({
			pageNumber: 1,
			pageSize: 1
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: { folderId: 'Must be an existing folder that belongs to this case' }
		});
	});

	test('returns 404 error getting documents if case does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.post('/applications/1000/folders/1/documents').send({
			pageNumber: 1,
			pageSize: 1
		});

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: { id: 'Must be an existing application' }
		});
	});

	test('returns documents in a folder on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.document.findMany.mockResolvedValue(documents);
		databaseConnector.document.count.mockResolvedValue(documentsInFolder201Count);

		// WHEN
		const response = await request.post('/applications/1/folders/201/documents').send({
			pageNumber: 1,
			pageSize: 50
		});

		// THEN
		expect(response.status).toEqual(200);

		expect(response.body).toEqual({
			page: 1,
			pageDefaultSize: 50,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					documentGuid: 'a6f9f2e0-12c9-49b7-8a1c-3b5edc34dd99',
					documentId: null,
					fileName: '',
					originalFilename: '',
					caseRef: null,
					sourceSystem: 'Back Office',
					blobStorageContainer: '',
					documentURI: '',
					author: '',
					dateCreated: null,
					size: 1024,
					mime: '',
					publishedStatus: '',
					redactedStatus: '',
					status: 'not_user_checked',
					datePublished: null,
					description: null,
					version: 1_675_774,
					representative: null,
					stage: null,
					documentType: '',
					filter1: null,
					filter2: null,
					examinationRefNo: ''
				}
			]
		});
	});
});
