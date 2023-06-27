import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';
import { representationFixture } from '../../__fixtures__/representations.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };
const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/').get('/applications/1/representations/1').reply(200, representationFixture);
	nock('http://test/')
		.post('/applications/1/representations/1/attachment', {
			documentId: 1
		})
		.reply(200, { attachmentId: 1 });
};

describe('Representation file upload', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/1/relevant-representations/1/api/upload';

	describe('POST /applications-service/case/1/relevant-representations/api/upload', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page and have the lookup fields', async () => {
			const response = await request.post(baseUrl).send({
				documentId: 1
			});

			expect(response.body).toEqual({ attachmentId: 1 });
		});
	});
});
