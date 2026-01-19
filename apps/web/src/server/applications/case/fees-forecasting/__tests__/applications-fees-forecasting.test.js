import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureFeesForecastingIndex } from '../../../../../../testing/applications/fixtures/fees-forecasting.js';
import staticFlags from '@pins/feature-flags/src/static-feature-flags.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications').reply(200, []);
	nock('http://test/').get('/applications/123').reply(200, fixtureFeesForecastingIndex.caseData);
	nock('http://test/')
		.get('/applications/123/invoices')
		.reply(200, fixtureFeesForecastingIndex.invoices);
	nock('http://test/')
		.get('/applications/123/meetings')
		.reply(200, fixtureFeesForecastingIndex.meetings);
	nock('http://test/').get('/applications-service/').reply(200, {});
};

describe('Fees and Forecasting', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		nocks();
	});

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/fees-forecasting';

	describe('GET /case/123/fees-forecasting/', () => {
		it('should render the page when feature flag is ON', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot('fees-forecasting-on');
			expect(element.innerHTML).toContain('Fees and forecasting (internal use only)');
		});

		it('should NOT render the page when feature flag is OFF', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = false;

			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot('fees-forecasting-off');
			expect(response.status).toBe(404);
		});
	});

	describe('GET /case/123/fees-forecasting/:sectionName', () => {
		it('should render the page when feature flag is ON', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'maturity-evaluation-matrix';

			const response = await request.get(`${baseUrl}/${sectionName}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Maturity Evaluation Matrix (MEM) last updated');
		});

		it('should NOT render the page when feature flag is OFF', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = false;

			const sectionName = 'maturity-evaluation-matrix';

			const response = await request.get(`${baseUrl}/${sectionName}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(response.status).toBe(404);
		});
	});

	describe('POST /case/123/fees-forecasting/:sectionName', () => {
		it('should show a validation error when date is NOT entered in correct format', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'maturity-evaluation-matrix';
			const fieldName = 'memLastUpdated';

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				[fieldName + '.year']: '1'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Enter a valid year');
		});

		it('should show an API error if updating was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'maturity-evaluation-matrix';
			const fieldName = 'memLastUpdated';

			nock('http://test/')
				.patch(`/applications/123/fees-forecasting/${sectionName}`)
				.reply(500, {});

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				[fieldName + '.day']: '01',
				[fieldName + '.month']: '02',
				[fieldName + '.year']: '2000'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('An error occurred, please try again later');
		});

		it('should redirect to the index page if updating was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'maturity-evaluation-matrix';
			const fieldName = 'memLastUpdated';

			nock('http://test/')
				.patch(`/applications/123/fees-forecasting/${sectionName}`)
				.reply(200, {});

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				[fieldName + '.day']: '01',
				[fieldName + '.month']: '02',
				[fieldName + '.year']: '2000'
			});

			expect(response?.headers?.location).toEqual('../fees-forecasting');
		});
	});
});
