import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestApplication } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);
const successGetResponse = { id: 1, applicants: [{ id: 1 }] };
const successPostResponse = { id: 1, reference: 'AB0110203', status: 'Pre-Application' };
const errorPostResponse = {
	errors: {
		projectLocation: 'Missing projectLocation',
		subSector: 'Missing subSector',
		sector: 'Missing sector',
		regions: 'Missing regions',
		gridReferenceEasting: 'Missing gridReferenceEasting',
		gridReferenceNorthing: 'Missing gridReferenceNorthing'
	}
};

const nocks = () => {
	nock('http://test/').get('/applications/case-officer').reply(200, successGetResponse);
	nock('http://test/').get('/applications/123').times(2).reply(200, successGetResponse);
};

describe('applications create applicant', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		await request.get('/applications-service/case-officer');
	});

	const baseUrl = '/applications-service/create-new-case/123/check-your-answers';

	describe('GET /check-your-answers', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('I accept - Confirm creation of a new case');
		});
	});

	describe('POST /check-your-answers', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should confirm status if no fields are missing', async () => {
			nock('http://test/').post('/applications/123/start').reply(200, successPostResponse);

			const response = await request.post(baseUrl);

			expect(response?.headers?.location).toContain(
				'/applications-service/create-new-case/123/case-created'
			);
		});

		it('should display errors if fields are missing', async () => {
			nock('http://test/').post('/applications/123/start').reply(200, errorPostResponse);

			const response = await request.post(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the case location');
			expect(element.innerHTML).toContain('Choose the subsector of the project');
			expect(element.innerHTML).toContain('Choose the sector of the project');
			expect(element.innerHTML).toContain('Choose one or multiple regions');
			expect(element.innerHTML).toContain('Enter the Grid reference Easting');
			expect(element.innerHTML).toContain('Enter the Grid reference Northing');
		});
	});
});
