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
		.reply(200, representationDetailsFixture)
		.persist();

	nock('http://test/')
		.patch(`/applications/1/representations/1`)
		.reply(200, { message: 'it okay' })
		.persist();
};

describe('Representation change redacted page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/1/representation-details/change-redaction';

	describe('GET /applications-service/case/1/relevant-representations/1/representation-details/change-representation', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe("POST /applications-service/case/1/relevant-representations/1/representation-details/change-representation'", () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		describe('Error - select an option', () => {
			it('should patch the representation and redirect to the next page', async () => {
				const response = await request.post(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});
		});
		describe('Success - redirect', () => {
			it('should patch the representation and redirect to the next page', async () => {
				const response = await request.post(baseUrl).send({
					changeRedaction: 'true'
				});
				expect(response?.headers?.location).toEqual(
					'/applications-service/case/1/relevant-representations/1/representation-details'
				);
			});
		});
	});
});
