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

const mockProjectMeeting = {
	id: 1,
	caseId: 123,
	meetingType: 'project',
	pinsRole: null,
	agenda: 'Project Update Meeting (PUM)',
	meetingDate: '2026-03-04T00:00:00.000Z'
};

const mockEvidencePlanMeeting = {
	id: 2,
	caseId: 123,
	meetingType: 'evidence_plan',
	pinsRole: 'observer',
	agenda: 'Test Meeting',
	meetingDate: '2026-03-12T00:00:00.000Z'
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
		it('should show a validation error for date input when date is NOT entered in correct format', async () => {
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

		it('should show an API error for date input if updating date was NOT successful', async () => {
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
			expect(element.innerHTML).toContain('There is a problem');
		});

		it('should redirect to the index page if updating date was successful', async () => {
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

		it('should show a validation error for text input when hyperlink is NOT entered in correct format', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'issues-tracker-link';
			const fieldName = 'issuesTracker';

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				[fieldName]: 'test@hyperlink'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Enter a valid hyperlink');
		});

		it('should show an API error for text input if updating hyperlink was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'issues-tracker-link';
			const fieldName = 'issuesTracker';

			nock('http://test/')
				.patch(`/applications/123/fees-forecasting/${sectionName}`)
				.reply(500, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				[fieldName]: 'test.hyperlink.com/'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There is a problem');
		});

		it('should redirect to the index page if updating hyperlink was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'issues-tracker-link';
			const fieldName = 'issuesTracker';

			nock('http://test/')
				.patch(`/applications/123/fees-forecasting/${sectionName}`)
				.reply(200, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				[fieldName]: 'test.hyperlink.com/'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show a validation error for text input when inspector number is NOT entered in correct format', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'examining-inspectors';
			const fieldName = 'numberBand2Inspectors';
			const additionalFieldName = 'numberBand3Inspectors';

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				[fieldName]: 'abc',
				[additionalFieldName]: '5'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Enter a number of band 2 inspectors between 0 and 99');
		});

		it('should show an API error for text input if updating inspector number was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'examining-inspectors';
			const fieldName = 'numberBand2Inspectors';
			const additionalFieldName = 'numberBand3Inspectors';

			nock('http://test/')
				.patch(`/applications/123/fees-forecasting/${sectionName}`)
				.reply(500, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				[fieldName]: '2',
				[additionalFieldName]: '3'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There is a problem');
		});

		it('should redirect to the index page if updating inspector number was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'examining-inspectors';
			const fieldName = 'numberBand2Inspectors';
			const additionalFieldName = 'numberBand3Inspectors';

			nock('http://test/')
				.patch(`/applications/123/fees-forecasting/${sectionName}`)
				.reply(200, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				[fieldName]: '2',
				[additionalFieldName]: '3'
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
			expect(element.innerHTML).toContain('There is a problem');
		});

		it('should redirect to the index page if creating an evidence plan meeting was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-evidence-plan-meeting';

			nock('http://test/').post('/applications/123/meetings').reply(200, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				meetingType: 'evidence_plan',
				agenda: 'Test Meeting',
				pinsRole: 'facilitator'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show a validation error when evidence plan meeting is missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'add-evidence-plan-meeting';

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
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

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				meetingType: 'evidence_plan',
				agenda: 'Test Meeting',
				pinsRole: 'facilitator'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
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

		it('should show an API error if deleting fee was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/')
				.delete('/applications/123/invoices/1')
				.reply(500, { errors: 'API error message' });
			nock('http://test/').get('/applications/123/invoices/1').reply(200, mockInvoice);

			const response = await request.post(`${baseUrl}/section/manage-fee/id/1/delete`);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There is a problem');
		});
	});

	describe('GET /case/123/fees-forecasting/section/manage-project-meeting/id/:meetingId', () => {
		it('should render the manage project meeting page when the feature flag is ON', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/meetings/1').reply(200, mockProjectMeeting);

			const response = await request.get(`${baseUrl}/section/manage-project-meeting/id/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Manage project meeting');
		});

		it('should return 404 if the project meeting does not exist', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/meetings/3').reply(404, {});

			const response = await request.get(`${baseUrl}/section/manage-project-meeting/id/3`);

			expect(response.status).toBe(404);
		});
	});

	describe('POST /case/123/fees-forecasting/section/manage-project-meeting/id/:meetingId', () => {
		it('should redirect to the index page if updating the project meeting was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').patch('/applications/123/meetings/1').reply(200, {});

			const response = await request.post(`${baseUrl}/section/manage-project-meeting/id/1`).send({
				meetingType: 'project',
				agenda: 'Multi-Party Meeting (MPM)'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show a validation error when the project meeting update is missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const response = await request.post(`${baseUrl}/section/manage-project-meeting/id/1}`).send({
				meetingType: 'project',
				agenda: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Select Meeting agenda');
		});

		it('should show an API error if updating the project meeting was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/')
				.patch('/applications/123/meetings/1')
				.reply(500, { errors: 'API error message' });

			const response = await request.post(`${baseUrl}/section/manage-project-meeting/id/1`).send({
				meetingType: 'project',
				agenda: 'Multi-Party Meeting (MPM)'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There is a problem');
		});
	});

	describe('GET /case/123/fees-forecasting/section/manage-project-meeting/id/:meetingId/delete', () => {
		it('should render the delete confirmation page', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/meetings/1').reply(200, mockProjectMeeting);

			const response = await request.get(`${baseUrl}/section/manage-project-meeting/id/1/delete`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Delete project meeting');
		});
	});

	describe('POST /case/123/fees-forecasting/section/manage-project-meeting/id/:meetingId/delete', () => {
		it('should redirect to the index page if deleting the project meeting was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/meetings/1').reply(200, mockProjectMeeting);
			nock('http://test/').delete('/applications/123/meetings/1').reply(204, {});

			const response = await request.post(`${baseUrl}/section/manage-project-meeting/id/1/delete`);

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show an API error if deleting the project meeting was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/')
				.delete('/applications/123/meetings/1')
				.reply(500, { errors: 'API error message' });
			nock('http://test/').get('/applications/123/meetings/1').reply(200, mockProjectMeeting);

			const response = await request.post(`${baseUrl}/section/manage-project-meeting/id/1/delete`);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There is a problem');
		});
	});

	describe('GET /case/123/fees-forecasting/section/manage-evidence-plan-meeting/id/:meetingId', () => {
		it('should render the manage evidence plan meeting page when the feature flag is ON', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/meetings/2').reply(200, mockEvidencePlanMeeting);

			const response = await request.get(`${baseUrl}/section/manage-evidence-plan-meeting/id/2`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Manage evidence plan meeting');
		});

		it('should return 404 if the evidence plan meeting does not exist', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/meetings/3').reply(404, {});

			const response = await request.get(`${baseUrl}/section/manage-evidence-plan-meeting/id/3`);

			expect(response.status).toBe(404);
		});
	});

	describe('POST /case/123/fees-forecasting/section/manage-evidence-plan-meeting/id/:meetingId', () => {
		it('should redirect to the index page if updating the evidence plan meeting was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').patch('/applications/123/meetings/2').reply(200, {});

			const response = await request
				.post(`${baseUrl}/section/manage-evidence-plan-meeting/id/2`)
				.send({
					meetingType: 'evidence_plan',
					pinsRole: 'facilitator',
					agenda: 'New Test Meeting'
				});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show a validation error when the evidence plan meeting update is missing required fields', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const response = await request
				.post(`${baseUrl}/section/manage-evidence-plan-meeting/id/2}`)
				.send({
					meetingType: 'evidence_plan',
					pinsRole: '',
					agenda: 'Another Test Meeting'
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Select Planning Inspectorate role');
		});

		it('should show an API error if updating the evidence plan meeting was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/')
				.patch('/applications/123/meetings/2')
				.reply(500, { errors: 'API error message' });

			const response = await request
				.post(`${baseUrl}/section/manage-evidence-plan-meeting/id/2`)
				.send({
					meetingType: 'evidence_plan',
					pinsRole: 'facilitator',
					agenda: 'New Test Meeting'
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There is a problem');
		});
	});

	describe('GET /case/123/fees-forecasting/section/manage-evidence-plan-meeting/id/:meetingId/delete', () => {
		it('should render the delete confirmation page', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/meetings/2').reply(200, mockEvidencePlanMeeting);

			const response = await request.get(
				`${baseUrl}/section/manage-evidence-plan-meeting/id/2/delete`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Delete evidence plan meeting');
		});
	});

	describe('POST /case/123/fees-forecasting/section/manage-evidence-plan-meeting/id/:meetingId/delete', () => {
		it('should redirect to the index page if deleting the evidence plan meeting was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/').get('/applications/123/meetings/2').reply(200, mockEvidencePlanMeeting);
			nock('http://test/').delete('/applications/123/meetings/2').reply(204, {});

			const response = await request.post(
				`${baseUrl}/section/manage-evidence-plan-meeting/id/2/delete`
			);

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show an API error if deleting the evidence plan meeting was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			nock('http://test/')
				.delete('/applications/123/meetings/2')
				.reply(500, { errors: 'API error message' });
			nock('http://test/').get('/applications/123/meetings/2').reply(200, mockEvidencePlanMeeting);

			const response = await request.post(
				`${baseUrl}/section/manage-evidence-plan-meeting/id/2/delete`
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There is a problem');
		});
	});

	describe('GET /case/123/fees-forecasting/section/project-maturity (radio-input)', () => {
		it('should render the radio-input page when feature flag is ON', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'project-maturity';

			const response = await request.get(`${baseUrl}/section/${sectionName}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('What is the new maturity of the project?');
		});
	});

	describe('POST /case/123/fees-forecasting/section/project-maturity (radio-input)', () => {
		it('should show a validation error when no option is selected', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'project-maturity';

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				newMaturity: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('You must select an option for Project maturity');
		});

		it('should redirect to the index page if updating was successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'project-maturity';

			nock('http://test/')
				.patch(`/applications/123/fees-forecasting/${sectionName}`)
				.reply(200, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				newMaturity: 'c'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/123/fees-forecasting/'
			);
		});

		it('should show an API error if updating was NOT successful', async () => {
			const flags = staticFlags;
			flags['applics-1845-fees-forecasting'] = true;

			const sectionName = 'project-maturity';

			nock('http://test/')
				.patch(`/applications/123/fees-forecasting/${sectionName}`)
				.reply(500, {});

			const response = await request.post(`${baseUrl}/section/${sectionName}`).send({
				newMaturity: 'c'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There is a problem');
		});
	});
});
