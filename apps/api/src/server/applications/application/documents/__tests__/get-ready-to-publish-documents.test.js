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

/**
 * @type {any[]}
 */
const documents = [
	{
		guid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
		name: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
		folderId: 1,
		blobStorageContainer: null,
		blobStoragePath: null,
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
				version: 1,
				lastModified: null,
				documentType: '',
				published: false,
				sourceSystem: 'back-office',
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
				stage: null,
				filter1: null,
				blobStorageContainer: null,
				dateCreated: '2023-03-13T16:54:09.398Z',
				datePublished: null,
				isDeleted: false,
				examinationRefNo: null,
				filter2: null,
				publishedStatus: 'awaiting_upload',
				redactedStatus: null,
				redacted: false,
				documentURI: null
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

describe('Ready-to-publish-documents', () => {
	test('returns ready-to-publish documents metadata on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.document.findMany.mockResolvedValue(documents);
		databaseConnector.document.count.mockResolvedValue(1);

		// WHEN
		const response = await request.post('/applications/1/documents/ready-to-publish').send({
			pageNumber: 1,
			pageSize: 125
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(databaseConnector.document.findMany).toBeCalledWith({
			include: {
				documentVersion: true,
				folder: true
			},
			skip: 0,
			take: 125,
			orderBy: [
				{
					createdAt: 'desc'
				}
			],
			where: {
				documentVersion: {
					some: {
						version: 1,
						publishedStatus: 'ready_to_publish'
					}
				}
			}
		});
		expect(response.body).toEqual({
			page: 1,
			pageDefaultSize: 125,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
					documentId: null,
					folderId: 1,
					caseRef: null,
					sourceSystem: 'back-office',
					blobStorageContainer: '',
					documentURI: '',
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
