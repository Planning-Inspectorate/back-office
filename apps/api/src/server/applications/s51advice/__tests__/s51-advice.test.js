import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';

const { databaseConnector } = await import('#utils/database-connector.js');

const validS51AdviceBody = {
	caseId: 1,
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
	caseId: 1,
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
	caseId: 1,
	title: 'A title',
	enquirer: 'enquirer',
	referenceNumber: 1,
	enquiryMethod: 'email',
	enquiryDate: new Date('2023-02-27T10:00'),
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: new Date('2023-02-27T10:00'),
	adviceDetails: 'adviceDetails',
	createdAt: '2023-01-01T00:00:00.000Z',
	updatedAt: '2023-01-01T00:00:00.000Z'
};

const inValidS51AdviceBody = {
	caseId: 1,
	title: null,
	enquirer: 'enquirer',
	enquiryMethod: 'email',
	enquiryDate: '2023-02-27T10:00:00Z',
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: '2023-02-27T10:00:00Z',
	adviceDetails: 'adviceDetails'
};

const application1 = applicationFactoryForTests({
	id: 1,
	reference: 'BC0110001',
	title: 'BC010001 - NI Case 1 Name',
	description: 'BC010001 - NI Case 1 Name Description',
	caseStatus: 'pre-application'
});
const s51AdvicesInApplication1Count = 1;

const s51AdvicesOnCase1 = [
	{
		caseId: 1,
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
		publishedStatus: 'not_checked',
		redactedStatus: 'not_redacted',
		createdAt: '2023-01-01T00:00:00.000Z',
		updatedAt: '2023-01-01T00:00:00.000Z'
	}
];

const s51AdvicesReadyToPublish= [
	{
		caseId: 1,
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

const s51AdviceDocuments = [
	{
		id: 1,
		adviceId: 5,
		documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
		Document: {
			guid: '458a2020-cafd-4885-a78c-1c13735e1aac',
			reference: 'EN0110002-000003',
			folderId: 1734,
			createdAt: '2023-08-16T13:57:21.992Z',
			isDeleted: false,
			latestVersionId: 1,
			caseId: 29,
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

describe('Test S51 advice API', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('post creates S51 advice when passed valid data', async () => {
		databaseConnector.s51Advice.count.mockResolvedValue(0);

		const resp = await request.post('/applications/s51-advice').send(validS51AdviceBody);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.create).toHaveBeenCalledWith({
			data: s51AdviceToBeSaved
		});
	});

	test('post throws 400 error when passed invalid data and does not call create', async () => {
		const resp = await request.post('/applications/s51-advice').send(inValidS51AdviceBody);
		expect(resp.status).toEqual(400);
		expect(databaseConnector.s51Advice.create).toHaveBeenCalledTimes(0);
	});

	test('get by id throws 404 when there is no case found', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		const resp = await request.get('/applications/21/s51-advice/132').send({});
		expect(resp.status).toEqual(404);
		expect(databaseConnector.case.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(0);
	});

	test('get by id throws 404 when there is no s51 advice for the provided id', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(null);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		const resp = await request.get('/applications/21/s51-advice/132').send({});
		expect(resp.status).toEqual(404);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(1);
	});

	test('get by id returns s51 advice by id', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(s51AdviceToBeReturned);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue(null);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		const resp = await request.get('/applications/21/s51-advice/132').send({});
		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(1);
	});

	test('get by id returns s51 advice by id with attachments', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(s51AdviceToBeReturned);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue(s51AdviceDocuments);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		const resp = await request.get('/applications/21/s51-advice/132').send({});
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({
			adviceDate: 1677492000,
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
			dateCreated: 1672531200,
			dateUpdated: 1672531200,
			enquirer: 'enquirer',
			enquiryDate: 1677492000,
			enquiryDetails: 'enquiryDetails',
			enquiryMethod: 'email',
			firstName: '',
			lastName: '',
			publishedStatus: '',
			redactedStatus: '',
			referenceCode: 'undefined-Advice-00001',
			referenceNumber: '00001',
			title: 'A title'
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
			.get('/applications/1/s51-advice')
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
					enquiryDate: 1672531200,
					enquiryDetails: 'detail',
					adviser: 'PINS Staff',
					adviceDate: 1672531200,
					adviceDetails: 'good advice',
					publishedStatus: 'not_checked',
					redactedStatus: 'not_redacted',
					dateCreated: 1672531200,
					dateUpdated: 1672531200
				}
			]
		});
	});

	test('returns 404 error getting S51 Advices if case does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.get('/applications/1000/s51-advice').query({
			page: 1,
			pageSize: 1
		});

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: { id: 'Must be an existing application' }
		});
	});

	test('getReadyToPublishAdvices returns s51 advice by that in ready to publish status', async () => {
		databaseConnector.s51Advice.findMany.mockResolvedValue(s51AdvicesReadyToPublish);
		databaseConnector.s51Advice.count.mockResolvedValue(1)
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		const resp = await request.post('/applications/21/s51-advice/ready-to-publish').send({pageNumber: 1, pageSize: 125});
		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.findMany).toHaveBeenCalledTimes(1);
		expect(databaseConnector.s51Advice.count).toHaveBeenCalledTimes(1);
	});

	test('removePublishItemFromQueue returns s51 advice by that in ready to publish status', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(s51AdvicesOnCase1);
		databaseConnector.s51Advice.update.mockResolvedValue(s51AdvicesOnCase1);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		const resp = await request.post('/applications/21/s51-advice/remove-queue-item').send({adviceId : 1});
		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledTimes(1);
	});

	// Tests for the title unique HEAD checks
	test('Is s51 title unique - HEAD returns 200 success if S51 title is unique to the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findMany.mockResolvedValue({});
		const resp = await request.head('/applications/1/s51-advice/title-unique/Advice 12').send();
		expect(resp.status).toEqual(200);
	});

	test('Is s51 title unique - HEAD returns 404 error if S51 title is already used in the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findMany.mockResolvedValue(s51AdvicesOnCase1);
		const resp = await request.head('/applications/1/s51-advice/title-unique/Advice 1').send();
		expect(resp.status).toEqual(400);
	});

	test('Is s51 title unique - whitespace is ignored in the test, also case-insensitive', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findMany.mockResolvedValue(s51AdvicesOnCase1);
		const resp = await request.head('/applications/1/s51-advice/title-unique/  ADVICE 1  ').send();
		expect(resp.status).toEqual(400);
	});

	test('Is s51 title unique - HEAD returns 400 error if case id is invalid', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		const resp = await request.head('/applications/999/s51-advice/title-unique/Advice 1').send();
		expect(resp.status).toEqual(404);
	});
});
