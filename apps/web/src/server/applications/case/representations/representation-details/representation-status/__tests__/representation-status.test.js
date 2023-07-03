import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../testing/index.js';
import { representationDetailsFixture } from '../../__fixtures__/representation-details.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };
const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/')
		.get(`/applications/1/representations/1`)
		.reply(200, representationDetailsFixture);

	nock('http://test/')
		.patch(`/applications/1/representations/1`, {
			status: 'VALID'
		})
		.reply(200, {
			id: 1,
			status: 'VALID'
		});

	nock('http://test/')
		.patch(`/applications/1/representations/1`, {
			status: 'REFERRED'
		})
		.reply(200, {
			id: 1,
			status: 'REFERRED',
			referredTo: ''
		});
};

describe('Change representation status page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/1/representation-details/change-status';

	describe('GET /applications-service/case/1/relevant-representations/1/representations-details/change-status', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should contain specified radio options', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Awaiting review');
			expect(element.innerHTML).toContain('Referred');
			expect(element.innerHTML).toContain('Invalid');
			expect(element.innerHTML).toContain('Valid');
			expect(element.innerHTML).toContain('Awaiting review');
			expect(element.innerHTML).toContain('Withdrawn');
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/1/representations-details/change-status', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should show validation error if no option was selected', async () => {
			const response = await request.post(baseUrl).send({});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Select one option');
		});

		it('should redirect to /status-result page on page submission', async () => {
			const response = await request.post(baseUrl).send({
				changeStatus: 'REFERRED'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/1/relevant-representations/1/representation-details/status-result?changeStatus=REFERRED'
			);
		});

		it('should and redirect back to details page if VALID status was selected', async () => {
			const response = await request.post(baseUrl).send({
				changeStatus: 'VALID'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/1/relevant-representations/1/representation-details'
			);
		});
	});
});
