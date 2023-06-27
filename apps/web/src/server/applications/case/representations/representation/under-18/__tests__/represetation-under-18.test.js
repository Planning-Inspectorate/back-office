import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../testing/index.js';
import { representationFixture } from '../../../__fixtures__/representations.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };

const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/').get('/applications/1/representations/1').reply(200, representationFixture);
	nock('http://test/')
		.patch(`/applications/1/representations/1`, {
			represented: { under18: false }
		})
		.reply(200, { message: 'ok' });
};

describe('Representation representation under 18', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/under-18?repId=1&repType=represented';

	describe('GET /applications-service/case/1/relevant-representations/under-18', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/representation-type', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should redirect to the next page', async () => {
			const response = await request.post(baseUrl).send({ under18: 'false' });

			expect(response?.headers?.location).toEqual(
				'/applications-service/case/1/relevant-representations/representation-entity?repId=1&repType=represented'
			);
		});
	});
});
