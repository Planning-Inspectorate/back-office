import { request } from '../../../../app-test.js';
import { applicationFactoryForTests } from '../../../../utils/application-factory-for-tests.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

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
		guid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
		name: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
		folderId: 1,
		privateBlobContainer: null,
		privateBlobPath: null,
		status: 'awaiting_upload',
		createdAt: '2023-03-13T16:54:09.282Z',
		redacted: false,
		fileSize: 0,
		fileType: null,
		isDeleted: false,
		versionId: null,
		documentVersion: [
			{
				documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
				folderId: 1,
				version: 1,
				lastModified: null,
				documentType: '',
				published: false,
				sourceSystem: 'back-office',
				stage: null,
				origin: null,
				originalFilename: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
				fileName: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
				representative: null,
				description: null,
				owner: null,
				author: null,
				securityClassification: null,
				mime: 'image/png',
				horizonDataID: null,
				fileMD5: null,
				path: null,
				virusCheckStatus: null,
				size: 4375,
				filter1: null,
				privateBlobContainer: null,
				dateCreated: '2023-03-13T16:54:09.398Z',
				datePublished: null,
				isDeleted: false,
				examinationRefNo: null,
				filter2: null,
				publishedStatus: 'awaiting_upload',
				redactedStatus: null,
				redacted: false,
				privateBlobPath: null
			}
		],
		folder: {
			id: 1,
			displayNameEn: 'Project management',
			displayOrder: 100,
			parentFolderId: null,
			caseId: 1
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
					documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
					documentId: null,
					documentRef: null,
					caseRef: null,
					folderId: 1,
					sourceSystem: 'back-office',
					stage: null,
					privateBlobContainer: '',
					privateBlobPath: '',
					author: '',
					fileName: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
					originalFilename: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
					dateCreated: 1_678_726_449,
					size: 4375,
					mime: 'image/png',
					publishedStatus: 'awaiting_upload',
					redactedStatus: '',
					datePublished: null,
					description: null,
					version: 1,
					representative: null,
					documentType: '',
					filter1: null,
					filter2: null,
					examinationRefNo: ''
				}
			]
		});
	});
});
