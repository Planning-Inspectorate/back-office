import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureFeesForecastingIndex } from '../../../../../../testing/applications/fixtures/fees-forecasting.js';
import staticFlags from '@pins/feature-flags/src/static-feature-flags.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockInvoice = {
	id: 1,
	caseId: 123,
	invoiceNumber: '180000000',
	invoiceStage: 'pre_acceptance',
	amountDue: '20500.00',
	paymentDueDate: '2025-11-05T00:00:00.000Z',
	paymentDate: '2025-11-05T00:00:00.000Z',
	refundIssueDate: '2025-11-15T00:00:00.000Z'
};

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

	describe('GET /case/123/fees-forecasting/section/:sectionName', () => {
		it('should render the page when feature flag is ON', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'maturity-evaluation-matrix';

			const response = await request.get(`${baseUrl}/section/${sectionName}`);
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

	describe('POST /case/123/fees-forecasting/section/:sectionName', () => {
		it('should show a validation error when date is NOT entered in correct format', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'maturity-evaluation-matrix';
			const fieldName = 'memLastUpdated';

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
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

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
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

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				[fieldName + '.day']: '01',
				[fieldName + '.month']: '02',
				[fieldName + '.year']: '2000'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should create a new fee and redirect when add-new-fee is posted successfully', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-new-fee';

			nock('http://test/').post('/applications/123/invoices').reply(200, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				invoiceNumber: '180002932',
				invoiceStage: 'acceptance'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show a validation error when add-new-fee is missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-new-fee';

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
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

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				invoiceNumber: '180002932',
				invoiceStage: 'acceptance'
			});

			const element = parseHtml(response.text);
			expect(element.innerHTML).toContain('There is a problem');
		});
	});

	describe('GET /case/123/fees-forecasting/section/manage-fee/id/:feeId', () => {
		it('should render the manage fee page when feature flag is ON', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/invoices/1').reply(200, mockInvoice);

			const response = await request.get(`${baseUrl}/section/manage-fee/id/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot('manage-fee-edit');
			expect(element.innerHTML).toContain('180000000');
		});

		it('should return 404 if invoice does not exist', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/invoices/999').reply(404, {});

			const response = await request.get(`${baseUrl}/section/manage-fee/id/999`);

			expect(response.status).toBe(404);
		});
	});

	describe('POST /case/123/fees-forecasting/section/manage-fee/id/:feeId', () => {
		it('should update the fee and redirect when successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').patch('/applications/123/invoices/1').reply(200, {});

			const response = await request.post(`${baseUrl}/section/manage-fee/id/1`).send({
				invoiceNumber: '180000001',
				invoiceStage: 'acceptance'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show a validation error when updating fee with missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const response = await request.post(`${baseUrl}/section/manage-fee/id/1`).send({
				invoiceNumber: '',
				invoiceStage: 'acceptance'
			});

			const element = parseHtml(response.text);
			expect(element.innerHTML).toContain('You must enter the invoice number');
		});

		it('should show an API error if updating fee was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/')
				.patch('/applications/123/invoices/1')
				.reply(500, { errors: 'API error message' });

			const response = await request.post(`${baseUrl}/section/manage-fee/id/1`).send({
				invoiceNumber: '180000001',
				invoiceStage: 'acceptance'
			});

			const element = parseHtml(response.text);
			expect(element.innerHTML).toContain('There is a problem');
		});
	});

	describe('GET /case/123/fees-forecasting/section/manage-fee/id/:feeId/delete', () => {
		it('should render the delete confirmation page', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/invoices/1').reply(200, mockInvoice);

			const response = await request.get(`${baseUrl}/section/manage-fee/id/1/delete`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot('delete-fee-confirmation');
		});
	});

	describe('POST /case/123/fees-forecasting/section/manage-fee/id/:feeId/delete', () => {
		it('should delete the fee and redirect when successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').delete('/applications/123/invoices/1').reply(200, {});

			const response = await request.post(`${baseUrl}/section/manage-fee/id/1/delete`);

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should redirect to the index page if creating a project meeting was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-project-meeting';

			nock('http://test/').post('/applications/123/meetings').reply(200, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				meetingType: 'project',
				agenda: 'Project Update Meeting (PUM)'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show a validation error when project meeting is missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-project-meeting';

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
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

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				meetingType: 'project',
				agenda: 'Project Update Meeting (PUM)'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('API error message');
		});
	});
});
