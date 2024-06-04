import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../constants.js';
import { request } from '../../../../app-test.js';
import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';
const { databaseConnector } = await import('#utils/database-connector.js');

const application1 = applicationFactoryForTests({
	id: 1,
	title: 'EN0110003 - NI Case 3 Name',
	description: 'EN0110003 - NI Case 3 Name Description',
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

const document1_Version1 = {
	documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
	version: 1,
	lastModified: null,
	documentType: '',
	published: false,
	sourceSystem: 'back-office-applications',
	origin: null,
	originalFilename: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
	fileName: 'my testfile',
	representative: null,
	description: null,
	owner: null,
	author: null,
	authorWelsh: null,
	securityClassification: null,
	mime: 'image/png',
	horizonDataID: null,
	fileMD5: null,
	virusCheckStatus: null,
	size: 4375,
	stage: null,
	filter1: null,
	privateBlobContainer: null,
	privateBlobPath: null,
	publishedBlobContainer: null,
	publishedBlobPath: null,
	dateCreated: '2023-03-13T16:54:09.398Z',
	datePublished: null,
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'awaiting_upload',
	redactedStatus: null,
	redacted: false,
	transcriptGuid: null
};

/**
 * @type {any[]}
 */
const documents = [
	{
		guid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
		documentReference: 'EN0110003-000001',
		folderId: 1,
		createdAt: '2023-03-13T16:54:09.282Z',
		isDeleted: false,
		latestVersionId: 1,
		caseId: 1,
		fromFrontOffice: false,
		documentVersion: [document1_Version1],
		latestDocumentVersion: document1_Version1,
		folder: {
			id: 1,
			displayNameEn: 'Project management',
			displayOrder: 100,
			parentFolderId: null,
			caseId: 1,
			stage: null
		}
	}
];

describe('GET search for non S51 Advice documents in a case', () => {
	test('returns 404 error searching for documents if case does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.get('/applications/999/documents?criteria=testfile');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: { id: 'Must be an existing application' }
		});
	});

	test('returns 400 error searching for documents if criteria less than 3 chars', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findFirst.mockResolvedValue(s51AdviceFolder);
		databaseConnector.document.findMany.mockResolvedValue(documents);
		databaseConnector.document.count.mockResolvedValue(1);

		// WHEN
		const response = await request.get('/applications/1/documents?criteria=22');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			page: 1,
			pageCount: 0,
			itemCount: 0,
			items: []
		});
	});

	test('returns paginated set of matching documents using search criteria', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.folder.findFirst.mockResolvedValue(s51AdviceFolder);
		databaseConnector.document.findMany.mockResolvedValue(documents);
		databaseConnector.document.count.mockResolvedValue(1);

		// WHEN
		const response = await request.get('/applications/1/documents?criteria=testfile');

		// THEN
		expect(response.status).toEqual(200);
		expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
			include: {
				documentVersion: true,
				latestDocumentVersion: true,
				folder: true
			},
			skip: 0,
			take: DEFAULT_PAGE_SIZE,
			orderBy: [
				{
					documentReference: 'asc'
				}
			],
			where: {
				caseId: 1,
				AND: {
					OR: [
						{ documentReference: { contains: 'testfile' } },
						{
							latestDocumentVersion: {
								OR: [
									{ fileName: { contains: 'testfile' } },
									{ description: { contains: 'testfile' } },
									{ representative: { contains: 'testfile' } },
									{ author: { contains: 'testfile' } }
								]
							}
						}
					]
				},
				NOT: { folderId: 5 },
				isDeleted: false
			}
		});

		expect(response.body).toEqual({
			page: DEFAULT_PAGE_NUMBER,
			pageDefaultSize: DEFAULT_PAGE_SIZE,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
					documentId: null,
					documentRef: 'EN0110003-000001',
					folderId: 1,
					caseRef: null,
					sourceSystem: 'back-office-applications',
					privateBlobContainer: '',
					privateBlobPath: '',
					author: '',
					authorWelsh: null,
					fileName: 'my testfile',
					originalFilename: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
					dateCreated: 1678726449,
					size: 4375,
					mime: 'image/png',
					publishedStatus: 'awaiting_upload',
					redactedStatus: '',
					datePublished: null,
					description: null,
					descriptionWelsh: null,
					version: 1,
					representative: null,
					stage: null,
					documentType: '',
					filter1: null,
					filter1Welsh: null,
					filter2: null,
					examinationRefNo: '',
					fromFrontOffice: false,
					transcript: ''
				}
			]
		});
	});
});
