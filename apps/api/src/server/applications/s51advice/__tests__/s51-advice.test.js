import { jest } from '@jest/globals';
import { request } from '#app-test';
import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';
import { EventType } from '@pins/event-client';
import { NSIP_DOCUMENT, NSIP_S51_ADVICE } from '#infrastructure/topics.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';
const { eventClient } = await import('#infrastructure/event-client.js');
const { databaseConnector } = await import('#utils/database-connector.js');

const validS51AdviceBody = {
	caseId: 100000000,
	title: 'A title',
	enquirer: 'enquirer',
	enquiryMethod: 'email',
	enquiryDate: '2023-02-27T10:00:00Z',
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: '2023-02-27T10:00:00Z',
	adviceDetails: 'adviceDetails'
};

const s51AdviceToBeSaved = {
	caseId: 100000000,
	title: 'A title',
	enquirer: 'enquirer',
	referenceNumber: 1,
	enquiryMethod: 'email',
	enquiryDate: new Date('2023-02-27T10:00'),
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: new Date('2023-02-27T10:00'),
	adviceDetails: 'adviceDetails'
};

const s51AdviceToBeReturned = {
	id: 1,
	caseId: 100000000,
	title: 'Advice title 1',
	firstName: 'William',
	lastName: 'Wordsworth',
	enquirer: 'enquirer orgname',
	referenceNumber: 1,
	enquiryMethod: 'email',
	enquiryDate: new Date('2023-01-21T10:00'),
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: new Date('2023-01-21T10:00'),
	adviceDetails: 'adviceDetails',
	redactedStatus: 'unredacted',
	publishedStatus: 'not_checked',
	publishedStatusPrev: 'not_checked',
	datePublished: null,
	isDeleted: false,
	createdAt: new Date('2023-01-21T10:00'),
	updatedAt: new Date('2023-01-21T10:00')
};

const inValidS51AdviceBody = {
	caseId: 100000000,
	title: null,
	enquirer: 'enquirer',
	enquiryMethod: 'email',
	enquiryDate: '2023-02-27T10:00:00Z',
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: '2023-02-27T10:00:00Z',
	adviceDetails: 'adviceDetails'
};

const applicationBase = applicationFactoryForTests({
	id: 100000000,
	reference: 'BC0110001',
	title: 'BC010001 - NI Case 1 Name',
	description: 'BC010001 - NI Case 1 Name Description',
	caseStatus: 'pre-application',
	applicantId: 1
});

const application1 = {
	...applicationBase,
	ApplicationDetails: {
		id: 100000000,
		caseId: 1,
		subSectorId: 1,
		locationDescription: null,
		zoomLevelId: 4,
		caseEmail: null,
		subSector: {
			id: 1,
			abbreviation: 'BC01',
			name: 'office_use',
			displayNameEn: 'Office Use',
			displayNameCy: 'Office Use',
			sectorId: 1,
			sector: {
				id: 1,
				abbreviation: 'BC',
				name: 'business_and_commercial',
				displayNameEn: 'Business and Commercial',
				displayNameCy: 'Business and Commercial'
			}
		}
	}
};

const s51AdvicesInApplication1Count = 1;

const s51AdvicesOnCase1 = [
	{
		caseId: 100000000,
		id: 1,
		referenceNumber: 1,
		title: 'Advice 1',
		enquirer: 'New Power Company',
		firstName: 'David',
		lastName: 'White',
		enquiryMethod: 'email',
		enquiryDate: new Date('2023-01-01T10:00'),
		enquiryDetails: 'detail',
		adviser: 'PINS Staff',
		adviceDate: new Date('2023-01-01T10:00'),
		adviceDetails: 'good advice',
		publishedStatus: 'not_checked',
		publishedStatusPrev: 'not_checked',
		redactedStatus: 'not_redacted',
		datePublished: null,
		isDeleted: false,
		createdAt: new Date('2023-01-21T10:00'),
		updatedAt: new Date('2023-01-21T10:00'),
		attachments: [],
		totalAttachments: 0
	}
];

const s51AdvicesReadyToPublish = [
	{
		caseId: 100000000,
		id: 1,
		referenceNumber: 1,
		title: 'Advice 1',
		enquirer: 'New Power Company',
		firstName: 'David',
		lastName: 'White',
		enquiryMethod: 'email',
		enquiryDate: '2023-01-01T00:00:00.000Z',
		enquiryDetails: 'detail',
		adviser: 'PINS Staff',
		adviceDate: '2023-01-01T00:00:00.000Z',
		adviceDetails: 'good advice',
		publishedStatus: 'ready_to_publish',
		redactedStatus: 'not_redacted',
		createdAt: '2023-01-01T00:00:00.000Z',
		updatedAt: '2023-01-01T00:00:00.000Z',
		S51AdviceDocument: []
	}
];

const folderContainingDocumentToDelete = {
	id: 10003,
	displayNameEn: 'Project management',
	displayOrder: 100,
	parentFolderId: null,
	caseId: 100000001,
	stage: null,
	case: {
		id: 100000001,
		reference: 'BC0110001',
		CaseStatus: [{ id: 1, valid: true, status: '0' }]
	},
	documentCount: 1,
	path: '/10003'
};

const DocumentToDelete = {
	guid: '458a2020-cafd-4885-a78c-1c13735e1aac',
	documentReference: 'BC0110001-000003',
	folderId: 1734,
	createdAt: '2023-08-16T13:57:21.992Z',
	isDeleted: false,
	latestVersionId: 1,
	caseId: 1,
	fromFrontOffice: false,
	latestDocumentVersion: {
		fileName: '2048px-Pittsburgh_Steelers_logo.svg',
		mime: 'application/pdf',
		size: 207364,
		dateCreated: '2023-08-16T13:57:22.022Z',
		publishedStatus: 'awaiting_upload',
		documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
		version: 1
	},
	folder: folderContainingDocumentToDelete
};

const s51Document = {
	documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
	version: 1,
	lastModified: null,
	documentType: null,
	published: false,
	sourceSystem: 'back-office-applications',
	origin: null,
	originalFilename: 'Small1.pdf',
	fileName: 'Small1',
	representative: null,
	description: null,
	owner: 'Rodrick Shanahan',
	author: null,
	securityClassification: null,
	mime: 'application/pdf',
	horizonDataID: null,
	fileMD5: null,
	virusCheckStatus: null,
	size: 7945,
	stage: '0',
	filter1: null,
	privateBlobContainer: 'private-blob',
	privateBlobPath: '/application/BC0110001/a24f43d4-a3d1-4b38-8633-cb78fc5cc67c/1',
	publishedBlobContainer: null,
	publishedBlobPath: null,
	dateCreated: new Date('2024-01-31T18:17:12.692Z'),
	datePublished: null,
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'not_checked',
	publishedStatusPrev: null,
	redactedStatus: null,
	redacted: false,
	transcriptGuid: null,
	Document: DocumentToDelete
};

const s51AdviceDocuments = [
	{
		id: 1,
		adviceId: 1,
		documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
		Document: {
			guid: '458a2020-cafd-4885-a78c-1c13735e1aac',
			reference: 'BC0110001-000003',
			folderId: 1734,
			createdAt: '2023-08-16T13:57:21.992Z',
			isDeleted: false,
			latestVersionId: 1,
			caseId: 100000000,
			fromFrontOffice: false,
			latestDocumentVersion: {
				fileName: '2048px-Pittsburgh_Steelers_logo.svg',
				mime: 'application/pdf',
				size: 207364,
				dateCreated: '2023-08-16T13:57:22.022Z',
				publishedStatus: 'awaiting_upload',
				documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
				version: 1
			}
		}
	}
];

const expectedDocumentDeleteMessagePayload = buildPayloadEventsForSchema(NSIP_DOCUMENT, {
	documentId: '458a2020-cafd-4885-a78c-1c13735e1aac',
	version: 1,
	filename: 'Small1',
	originalFilename: 'Small1.pdf',
	fileMD5: null,
	size: 7945,
	documentURI:
		'https://127.0.0.1:10000/private-blob/application/BC0110001/a24f43d4-a3d1-4b38-8633-cb78fc5cc67c/1',
	publishedDocumentURI: null,
	dateCreated: '2024-01-31T18:17:12.692Z',
	datePublished: null,
	caseId: 1,
	caseRef: 'BC0110001',
	caseType: 'nsip',
	documentReference: 'BC0110001-000003',
	mime: 'application/pdf',
	publishedStatus: 'not_checked',
	sourceSystem: 'back-office-applications',
	owner: 'Rodrick Shanahan',
	path: 'BC0110001/Project management/Small1',
	author: null,
	description: null,
	documentCaseStage: '0',
	documentType: null,
	examinationRefNo: null,
	filter1: null,
	filter2: null,
	horizonFolderId: null,
	lastModified: null,
	origin: null,
	redactedStatus: null,
	representative: null,
	securityClassification: null,
	transcriptId: null,
	virusCheckStatus: null
});

const s51AdviceToDeletePayload = buildPayloadEventsForSchema(NSIP_S51_ADVICE, {
	caseId: 100000000,
	title: 'Advice 1',
	enquiryDetails: 'detail',
	adviceDetails: 'good advice',
	enquiryDate: '2023-01-01T10:00:00.000Z',
	adviceDate: '2023-01-01T10:00:00.000Z',
	caseReference: 'BC0110001',
	adviceId: 1,
	adviceReference: 'BC0110001-Advice-00001',
	from: 'David White',
	agent: 'New Power Company',
	method: 'email',
	adviceGivenBy: 'PINS Staff',
	status: 'unchecked',
	redactionStatus: 'unredacted',
	attachmentIds: []
});

const s51AdviceToBeReturnedPayload = buildPayloadEventsForSchema(NSIP_S51_ADVICE, {
	caseId: 100000000,
	title: 'Advice title 1',
	enquiryDetails: 'enquiryDetails',
	adviceDetails: 'adviceDetails',
	enquiryDate: '2023-01-21T10:00:00.000Z',
	adviceDate: '2023-01-21T10:00:00.000Z',
	caseReference: 'BC0110001',
	adviceId: 1,
	adviceReference: 'BC0110001-Advice-00001',
	from: 'William Wordsworth',
	agent: 'enquirer orgname',
	method: 'email',
	adviceGivenBy: 'adviser',
	status: 'unchecked',
	redactionStatus: 'unredacted',
	attachmentIds: []
});

// ******* TESTS **********

describe('Test S51 advice API', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('post creates S51 advice when passed valid data', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.count.mockResolvedValue(0);
		databaseConnector.s51Advice.create.mockResolvedValue(s51AdviceToBeReturned);

		const resp = await request.post('/applications/s51-advice').send(validS51AdviceBody);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.create).toHaveBeenCalledWith({
			data: s51AdviceToBeSaved
		});

		// EXPECT event broadcast
		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			NSIP_S51_ADVICE,
			s51AdviceToBeReturnedPayload,
			EventType.Create
		);
	});

	test('post throws 400 error when passed invalid data and does not call create', async () => {
		const resp = await request.post('/applications/s51-advice').send(inValidS51AdviceBody);
		expect(resp.status).toEqual(400);
		expect(databaseConnector.s51Advice.create).toHaveBeenCalledTimes(0);
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('get by id throws 404 when there is no case found', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		const resp = await request.get('/applications/999/s51-advice/132').send({});
		expect(resp.status).toEqual(404);
		expect(databaseConnector.case.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(0);
	});

	test('get by id throws 404 when there is no s51 advice for the provided id', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(null);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 100000000 });
		const resp = await request.get('/applications/100000000/s51-advice/132').send({});
		expect(resp.status).toEqual(404);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(1);
	});

	test('get by id returns s51 advice by id', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(s51AdviceToBeReturned);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue(null);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 100000000 });
		const resp = await request.get('/applications/100000000/s51-advice/132').send({});
		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(1);
	});

	test('get by id returns s51 advice by id with attachments', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(s51AdviceToBeReturned);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue(s51AdviceDocuments);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 100000000 });
		const resp = await request.get('/applications/100000000/s51-advice/132').send({});
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({
			adviceDate: 1674295200,
			adviceDetails: 'adviceDetails',
			adviser: 'adviser',
			attachments: [
				{
					documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
					documentType: 'application/pdf',
					documentName: '2048px-Pittsburgh_Steelers_logo.svg',
					version: 1,
					dateAdded: 1692194242,
					status: 'awaiting_upload',
					documentSize: 207364
				}
			],
			totalAttachments: 1,
			dateCreated: 1674295200,
			dateUpdated: 1674295200,
			enquiryDate: 1674295200,
			enquiryDetails: 'enquiryDetails',
			enquiryMethod: 'email',
			firstName: 'William',
			lastName: 'Wordsworth',
			enquirer: 'enquirer orgname',
			redactedStatus: 'unredacted',
			publishedStatus: 'not_checked',
			referenceCode: 'undefined-Advice-00001',
			referenceNumber: '00001',
			title: 'Advice title 1',
			datePublished: null,
			id: 1
		});
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(1);
	});

	test('returns all S51 Advice on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findMany.mockResolvedValue(s51AdvicesOnCase1);
		databaseConnector.s51Advice.count.mockResolvedValue(s51AdvicesInApplication1Count);

		// WHEN
		const response = await request
			.get('/applications/100000000/s51-advice')
			.query({ page: 1, pageSize: 50 });

		// THEN
		expect(response.status).toEqual(200);

		expect(response.body).toEqual({
			page: 1,
			pageDefaultSize: 50,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					id: 1,
					referenceNumber: '00001',
					referenceCode: 'BC0110001-Advice-00001',
					title: 'Advice 1',
					enquirer: 'New Power Company',
					firstName: 'David',
					lastName: 'White',
					enquiryMethod: 'email',
					enquiryDate: 1672567200,
					enquiryDetails: 'detail',
					adviser: 'PINS Staff',
					adviceDate: 1672567200,
					adviceDetails: 'good advice',
					publishedStatus: 'not_checked',
					redactedStatus: 'not_redacted',
					dateCreated: 1674295200,
					dateUpdated: 1674295200,
					attachments: [],
					datePublished: null,
					totalAttachments: 0
				}
			]
		});
	});

	test('returns 404 error getting S51 Advices if case does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.get('/applications/999/s51-advice').query({
			page: 1,
			pageSize: 1
		});

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: { id: 'Must be an existing application' }
		});
	});

	test('getReadyToPublishAdvices returns 1st page of s51 advice in ready to publish queue', async () => {
		databaseConnector.s51Advice.findMany.mockResolvedValue(s51AdvicesReadyToPublish);
		databaseConnector.s51Advice.count.mockResolvedValue(1);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 100000000 });
		const resp = await request
			.post('/applications/100000000/s51-advice/ready-to-publish')
			.send({ pageNumber: 1, pageSize: 125 });

		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.findMany).toHaveBeenCalledTimes(1);
		expect(databaseConnector.s51Advice.count).toHaveBeenCalledTimes(1);
	});

	test('removePublishItemFromQueue remove an s51 advice item from the ready to publish queue', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(s51AdviceToBeReturned);
		databaseConnector.s51Advice.update.mockResolvedValue(s51AdviceToBeReturned);
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		const resp = await request
			.post('/applications/100000000/s51-advice/remove-queue-item')
			.send({ adviceId: 1 });

		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(2);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledTimes(1);

		// EXPECT event broadcast
		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			NSIP_S51_ADVICE,
			s51AdviceToBeReturnedPayload,
			EventType.Update
		);
	});

	// Tests for the title unique HEAD checks
	test('Is s51 title unique - HEAD returns 200 success if S51 title is unique to the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findMany.mockResolvedValue({});
		const resp = await request
			.head('/applications/100000000/s51-advice/title-unique/Advice 12')
			.send();
		expect(resp.status).toEqual(200);
	});

	test('Is s51 title unique - HEAD returns 404 error if S51 title is already used in the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findMany.mockResolvedValue(s51AdvicesOnCase1);
		const resp = await request
			.head('/applications/100000000/s51-advice/title-unique/Advice 1')
			.send();
		expect(resp.status).toEqual(400);
	});

	test('Is s51 title unique - whitespace is ignored in the test, also case-insensitive', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findMany.mockResolvedValue(s51AdvicesOnCase1);
		const resp = await request
			.head('/applications/100000000/s51-advice/title-unique/  ADVICE 1  ')
			.send();
		expect(resp.status).toEqual(400);
	});

	test('Is s51 title unique - HEAD returns 400 error if case id is invalid', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		const resp = await request.head('/applications/999/s51-advice/title-unique/Advice 1').send();
		expect(resp.status).toEqual(404);
	});

	test('DELETE S51 Advice successfully soft-deletes', async () => {
		const validBeforeDelete = { ...s51AdvicesOnCase1[0], isDeleted: false };
		const validDeletedResponse = { ...validBeforeDelete, isDeleted: true };

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validBeforeDelete);
		databaseConnector.s51Advice.update.mockResolvedValue(validDeletedResponse);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue(s51AdviceDocuments);
		databaseConnector.folder.findUnique.mockResolvedValue(folderContainingDocumentToDelete);
		databaseConnector.document.findUnique.mockResolvedValue(DocumentToDelete);
		databaseConnector.documentVersion.findUnique.mockResolvedValue(s51Document);
		databaseConnector.document.delete.mockResolvedValue(DocumentToDelete);
		databaseConnector.folder.findUnique.mockResolvedValue(folderContainingDocumentToDelete);
		databaseConnector.$executeRaw = jest.fn().mockResolvedValue({
			...folderContainingDocumentToDelete,
			documentCount: 0,
			path: '/10003'
		});

		const response = await request.delete('/applications/100000000/s51-advice/1').send();

		expect(response.status).toEqual(200);
		expect(response.body.isDeleted).toEqual(true);

		// EXPECT event broadcast for the attached doc
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_DOCUMENT,
			expectedDocumentDeleteMessagePayload,
			EventType.Delete,
			{}
		);

		// EXPECT event broadcast for the s51 advice
		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			NSIP_S51_ADVICE,
			s51AdviceToDeletePayload,
			EventType.Delete
		);
	});

	test('DELETE S51 Advice throws error 404 if case id is invalid', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);

		const response = await request.delete('/applications/999/s51-advice/1').send();
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: { id: 'Must be an existing application' }
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('DELETE S51 Advice throws error 400 if advice id is invalid', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findUnique.mockResolvedValue(null);

		const response = await request.delete('/applications/100000000/s51-advice/999').send();
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: { adviceId: 'Must be an existing S51 advice item' }
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('DELETE S51 Advice throws error 400 if advice is published', async () => {
		const validBeforeDelete = { ...s51AdvicesOnCase1[0], publishedStatus: 'published' };

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validBeforeDelete);

		const response = await request.delete('/applications/100000000/s51-advice/1').send();
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: { adviceId: 'You must first unpublish S51 advice before deleting it.' }
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});
});
