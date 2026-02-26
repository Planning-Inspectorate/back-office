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

		it('should create a new fee and redirect when add-new-fee is posted successfully', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-new-fee';

			nock('http://test/').post('/applications/123/invoices').reply(200, {});

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				invoiceNumber: '180002932',
				invoiceStage: 'acceptance'
			});

			expect(response?.headers?.location).toEqual('../fees-forecasting');
		});

		it('should show a validation error when add-new-fee is missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-new-fee';

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				invoiceNumber: '180002932',
				invoiceStage: ''
			});

			const element = parseHtml(response.text);
			expect(element.innerHTML).toContain('You must select a case stage');
		});

		it('should show an API error if creating a new fee was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-new-fee';

			nock('http://test/')
				.post('/applications/123/invoices')
				.reply(500, { errors: 'API error message' });

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				invoiceNumber: '180002932',
				invoiceStage: 'acceptance'
			});

			const element = parseHtml(response.text);
			expect(element.innerHTML).toContain('API error message');
		});

		it('should redirect to the index page if creating a project meeting was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-project-meeting';

			nock('http://test/').post('/applications/123/meetings').reply(200, {});

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				meetingType: 'project',
				agenda: 'Project Update Meeting (PUM)'
			});

			expect(response?.headers?.location).toEqual('../fees-forecasting');
		});

		it('should show a validation error when project meeting is missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-project-meeting';

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				meetingType: 'project',
				agenda: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Select Meeting agenda');
		});

		it('should show an API error if creating a project meeting was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-project-meeting';

			nock('http://test/')
				.post('/applications/123/meetings')
				.reply(500, { errors: 'API error message' });

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				meetingType: 'project',
				agenda: 'Project Update Meeting (PUM)'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('API error message');
		});

		it('should redirect to the index page if creating an evidence plan meeting was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-evidence-plan-meeting';

			nock('http://test/').post('/applications/123/meetings').reply(200, {});

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				meetingType: 'evidence_plan',
				agenda: 'Test Meeting',
				pinsRole: 'facilitator'
			});

			expect(response?.headers?.location).toEqual('../fees-forecasting');
		});

		it('should show a validation error when evidence plan meeting is missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-evidence-plan-meeting';

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				meetingType: 'evidence_plan',
				agenda: 'Test meeting',
				pinsRole: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Select Planning Inspectorate role');
		});

		it('should show an API error if creating an evidence plan meeting was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-evidence-plan-meeting';

			nock('http://test/')
				.post('/applications/123/meetings')
				.reply(500, { errors: 'API error message' });

			const response = await request.post(`${baseUrl}/${sectionName}`).send({
				meetingType: 'evidence_plan',
				agenda: 'Test Meeting',
				pinsRole: 'facilitator'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('API error message');
		});
	});
});
