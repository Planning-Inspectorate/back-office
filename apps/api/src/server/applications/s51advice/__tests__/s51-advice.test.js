import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');

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
	enquiryMethod: 'email',
	enquiryDate: new Date('2023-02-27T10:00'),
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: new Date('2023-02-27T10:00'),
	adviceDetails: 'adviceDetails'
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

describe('Test S51 advice API', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('post creates S51 advice when passed valid data', async () => {
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
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(s51AdviceToBeSaved);
		const resp = await request.get('/applications/21/s51-advice/132').send({});
		expect(resp.status).toEqual(200);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(1);
	});
});
