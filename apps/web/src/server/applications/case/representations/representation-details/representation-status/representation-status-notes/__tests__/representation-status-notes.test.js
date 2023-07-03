import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../../testing/index.js';
import { representationDetailsFixture } from '../../../__fixtures__/representation-details.fixture.js';

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
			status: 'INVALID',
			invalidReason: 'DUPLICATE'
		})
		.reply(200, {
			id: 1,
			status: 'INVALID'
		});

	nock('http://test/')
		.patch(`/applications/1/representations/1`, {
			status: 'REFERRED',
			referredTo: 'INSPECTOR'
		})
		.reply(200, {
			id: 1,
			status: 'REFERRED'
		});
};

describe('Change representation status page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/1/representation-details/status-result';

	describe('GET /applications-service/case/1/relevant-representations/1/representations-details/status-result', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page', async () => {
			const response = await request.get(`${baseUrl}?changeStatus=AWAITING_REVIEW`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should contain specified radio options is status is REFERRED', async () => {
			const response = await request.get(`${baseUrl}?changeStatus=REFERRED`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Case team');
			expect(element.innerHTML).toContain('Inspector');
			expect(element.innerHTML).toContain('Central admin team');
			expect(element.innerHTML).toContain('Interested party');
		});

		it('should contain specified radio options if status is INVALID', async () => {
			const response = await request.get(`${baseUrl}?changeStatus=INVALID`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Duplicate');
			expect(element.innerHTML).toContain('Merged');
			expect(element.innerHTML).toContain('Not relevant');
			expect(element.innerHTML).toContain('Resubmitted');
			expect(element.innerHTML).toContain('TEST');
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/1/representations-details/status-result', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should show validation error if no option was selected', async () => {
			const response = await request.post(`${baseUrl}?changeStatus=AWAITING_REVIEW`).send({});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Select one option');
		});

		it('should patch the representation and redirect to details page', async () => {
			const response = await request.post(`${baseUrl}?changeStatus=INVALID`).send({
				changeStatus: 'INVALID',
				invalidReason: 'DUPLICATE'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/1/relevant-representations/1/representation-details'
			);
		});
	});
});
