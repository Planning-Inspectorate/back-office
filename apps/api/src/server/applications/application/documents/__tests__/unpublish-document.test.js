import { request } from '../../../../app-test.js';
import { applicationFactoryForTests } from '../../../../utils/application-factory-for-tests.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const application1 = applicationFactoryForTests({
	id: 1,
	title: 'EN010003 - NI Case 3 Name',
	description: 'EN010003 - NI Case 3 Name Description',
	caseStatus: 'pre-application'
});

/**
 * @type {any[]}
 */
const documentVersions = [
	{
		documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
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
		publishedStatus: 'published',
		redactedStatus: null,
		redacted: false
	}
];

const document = {
	guid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
	reference: 'test-ref',
	folderId: 1,
	createdeAt: new Date(),
	isDeleted: false,
	latestVersionId: 1,
	caseId: 1,
	documentVersion: documentVersions,
	latestDocumentVersion: documentVersions[0]
};

describe('Published documents', () => {
	test('returns all documents metadata on a case', async () => {
		// GIVEN
		// @ts-ignore
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		// @ts-ignore
		databaseConnector.document.findMany.mockResolvedValue([document]);

		const filesGuid = ['688fad5e-b41c-45d5-8fb3-dcad37d38092'];
		// WHEN
		const response = await request.get(
			`/applications/1/documents/properties?guids=${JSON.stringify(filesGuid)}`
		);

		// THEN
		expect(response.status).toEqual(200);
		expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
			where: {
				guid: {
					in: ['688fad5e-b41c-45d5-8fb3-dcad37d38092']
				},
				isDeleted: false
			},
			include: {
				documentVersion: true
			}
		});
		expect(response.body).toEqual([
			{
				author: '',
				caseRef: null,
				dateCreated: 1678726449,
				datePublished: null,
				description: null,
				documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
				documentId: null,
				documentRef: null,
				documentType: '',
				examinationRefNo: '',
				fileName: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
				filter1: null,
				filter2: null,
				folderId: null,
				fromFrontOffice: false,
				mime: 'image/png',
				originalFilename: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
				privateBlobContainer: '',
				privateBlobPath: '',
				publishedStatus: 'published',
				redactedStatus: '',
				representative: null,
				size: 4375,
				sourceSystem: 'back-office',
				stage: null,
				version: 1
			}
		]);
	});

	test('returns published documents metadata on a case', async () => {
		// GIVEN
		// @ts-ignore
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		// @ts-ignore
		databaseConnector.document.findMany.mockResolvedValue([document]);

		const filesGuid = ['688fad5e-b41c-45d5-8fb3-dcad37d38092'];
		// WHEN
		const response = await request.get(
			`/applications/1/documents/properties?guids=${JSON.stringify(filesGuid)}&published=true`
		);

		// THEN
		expect(response.status).toEqual(200);
		expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
			where: {
				guid: {
					in: ['688fad5e-b41c-45d5-8fb3-dcad37d38092']
				},
				isDeleted: false
			},
			include: {
				documentVersion: true
			}
		});
		expect(response.body).toEqual([
			{
				author: '',
				caseRef: null,
				dateCreated: 1678726449,
				datePublished: null,
				description: null,
				documentGuid: '688fad5e-b41c-45d5-8fb3-dcad37d38092',
				documentId: null,
				documentRef: null,
				documentType: '',
				examinationRefNo: '',
				fileName: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
				filter1: null,
				filter2: null,
				folderId: null,
				fromFrontOffice: false,
				mime: 'image/png',
				originalFilename: '8883cbfd43ed5b261961cd258d2f6fcb (1)',
				privateBlobContainer: '',
				privateBlobPath: '',
				publishedStatus: 'published',
				redactedStatus: '',
				representative: null,
				size: 4375,
				sourceSystem: 'back-office',
				stage: null,
				version: 1
			}
		]);
	});
});
