import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
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
	nock('http://test/').get('/applications/case-team').reply(200, {});
	nock('http://test/')
		.get(/\/applications\/1(.*)/g)
		.reply(200, fixtureCases[0]);

	nock('http://test/')
		.get(/\/applications\/2(.*)/g)
		.reply(200, fixtureCases[3]);
};

describe('applications create: check your answers', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		await request.get('/applications-service/case-team');
	});

	describe('Check your answers', () => {
		describe('GET /check-your-answers', () => {
			beforeEach(async () => {
				nocks();
			});

			const baseUrl = '/applications-service/create-new-case/1/check-your-answers';

			it('should render the page', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('I accept - confirm creation of a new case');
			});
		});

		describe('POST /check-your-answers', () => {
			beforeEach(async () => {
				nocks();
			});

			const baseUrl = '/applications-service/create-new-case/1/check-your-answers';

			it('should confirm status if no fields are missing', async () => {
				nock('http://test/').post('/applications/1/start').reply(200, fixtureCases[0]);

				const response = await request.post(baseUrl);

				/* const element = parseHtml(response.text);
				expect(element.innerHTML).toMatchSnapshot(); */

				expect(response?.headers?.location).toContain(
					'/applications-service/create-new-case/1/case-created'
				);
			});

			it('should display errors if fields are missing', async () => {
				nock('http://test/').post('/applications/1/start').reply(200, errorPostResponse);

				const response = await request.post(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter the project location');
				expect(element.innerHTML).toContain('Choose the subsector of the project');
				expect(element.innerHTML).toContain('Choose the sector of the project');
				expect(element.innerHTML).toContain('Choose at least one region');
				expect(element.innerHTML).toContain('Enter the Grid reference Easting');
				expect(element.innerHTML).toContain('Enter the Grid reference Northing');
			});
		});
	});

	describe('Case created', () => {
		beforeEach(async () => {
			nocks();
		});

		const baseUrl = '/applications-service/create-new-case/2/case-created';

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('New case has been created');
		});
	});
});
