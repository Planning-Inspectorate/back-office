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
});
