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
			useOfAI: 'YES'
		})
		.reply(200, {
			id: 1,
			useOfAI: 'YES'
		});
};

describe('AI declaration page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/1/representation-details/ai-declaration';

	describe('GET /applications-service/case/1/relevant-representations/1/representation-details/ai-declaration', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should contain specified radio options', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('AI used');
			expect(element.innerHTML).toContain('AI not used');
			expect(element.innerHTML).toContain('Unknown');
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/1/representation-details/ai-declaration', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should show validation error if no option was selected', async () => {
			const response = await request.post(baseUrl).send({});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Select the AI declaration status');
		});

		it('should redirect to representation details page on submission', async () => {
			const response = await request.post(baseUrl).send({
				useOfAI: 'YES'
			});

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/1/relevant-representations/1/representation-details'
			);
		});
	});
});
