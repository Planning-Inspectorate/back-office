import { request } from '../../../../app-test.js';
import { applicationFactoryForTests } from '../../../../utils/application-factory-for-tests.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const application1 = applicationFactoryForTests({
	id: 1,
	title: 'EN010003 - NI Case 3 Name',
	description: 'EN010003 - NI Case 3 Name Description',
	caseStatus: 'pre-application'
});

const { eventClient } = await import('../../../../infrastructure/event-client.js');

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
		expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
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
					fromFrontOffice: false
				}
			]
		});
	});
});

describe('Publish documents', () => {
	test('publishes selected documents on a case from ready-to-publish queue', async () => {
		// GIVEN
		const updatedPublishedDocument = {
			Document: {
				guid: 'document_to_publish_guid'
			},
			version: 1,
			originalFilename: 'original_filename.pdf',
			fileName: 'filename.pdf',
			size: 23452,
			dateCreated: new Date('2023-03-26T00:00:00.000Z'),
			privateBlobContainer: 'document-uploads',
			privateBlobPath: 'en010120/filename.pdf',
			publishedStatus: 'publishing'
		};

		databaseConnector.document.findMany.mockResolvedValue([
			{
				guid: 'document_to_publish_guid',
				latestVersionId: 1
			}
		]);

		databaseConnector.case.findUnique.mockResolvedValue(application1);

		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.documentVersion.update.mockResolvedValue(updatedPublishedDocument);
		databaseConnector.documentVersion.findMany.mockResolvedValue([
			{ documentGuid: 'document_to_publish_guid', version: 1 }
		]);

		// WHEN
		const response = await request.patch('/applications/1/documents/publish').send({
			documents: [{ guid: 'document_to_publish_guid' }]
		});

		// THEN
		expect(response.body).toEqual([
			{
				guid: 'document_to_publish_guid',
				publishedStatus: 'publishing'
			}
		]);
		expect(response.status).toEqual(200);

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
	});

	test('throws error if document missing properties required publishing', async () => {
		// GIVEN
		databaseConnector.document.findMany.mockResolvedValueOnce([
			{
				guid: 'document_to_publish_guid',
				latestVersionId: 1
			}
		]);
		databaseConnector.documentVersion.update.mockResolvedValue({
			Document: {
				guid: 'document_to_publish_guid',
				reference: 'document-reference',
				case: {
					id: 1,
					reference: 'case-reference'
				}
			}
		});

		// WHEN
		const response = await request.patch('/applications/1/documents/publish').send({
			documents: [{ guid: 'document_to_publish_guid' }, { guid: 'bad_document_to_publish_guid' }]
		});

		// THEN
		expect(response.status).toEqual(500);
		expect(response.body).toEqual({
			errors: [{ guid: 'bad_document_to_publish_guid' }]
		});
	});
});
