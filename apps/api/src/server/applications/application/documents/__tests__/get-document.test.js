import { request } from '../../../../app-test.js';
import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';
const { databaseConnector } = await import('#utils/database-connector.js');

const application1 = applicationFactoryForTests({
	id: 1,
	title: 'EN010003 - NI Case 3 Name',
	description: 'EN010003 - NI Case 3 Name Description',
	caseStatus: 'pre-application'
});

const s51AdviceFolder = {
	id: 5,
	displayNameEn: 'S51 advice',
	displayOrder: 500,
	parentFolderId: null,
	caseId: 1,
	stage: null
};

/**
 * @type {any[]}
 */
const documents = [
	{
		guid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
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
		latestDocumentVersion: {
			documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
			version: 1,
			lastModified: null,
			documentType: '',
			published: false,
			sourceSystem: 'back-office',
			stage: null,
			origin: null,
			originalFilename: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
			fileName: 'my testfile',
			representative: null,
			description: null,
			owner: null,
			author: null,
			securityClassification: null,
			mime: 'image/png',
			horizonDataID: null,
			fileMD5: null,
			privateBlobPath: null,
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
			redacted: false
		},
		folder: {
			id: 1,
			displayNameEn: 'Project management',
			displayOrder: 100,
			parentFolderId: null,
			caseId: 1
		}
	}
];

describe('GET non S51 Advice documents in a case', () => {
	test('returns paginated set of matching documents using search criteria', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findFirst.mockResolvedValue(s51AdviceFolder);
		databaseConnector.document.findMany.mockResolvedValue(documents);
		databaseConnector.document.count.mockResolvedValue(1);

		// WHEN
		const response = await request.get('/applications/1/documents?criteria=testfile');
		console.log('response:', response);
		// THEN
		expect(response.status).toEqual(200);
		/* expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
			include: {
				latestDocumentVersion: true,
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
				caseId: 1,
				latestDocumentVersion: {
					publishedStatus: 'ready_to_publish'
				},
				isDeleted: false
			}
		}); */
		expect(response.body).toEqual({
			page: 1,
			pageDefaultSize: 125,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
					documentId: null,
					documentRef: null,
					folderId: 1,
					caseRef: null,
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
					examinationRefNo: '',
					fromFrontOffice: false,
					transcript: ''
				}
			]
		});
	});
});
