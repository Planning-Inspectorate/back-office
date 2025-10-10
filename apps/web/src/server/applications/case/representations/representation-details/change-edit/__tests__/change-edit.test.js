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
		.patch(`/applications/1/representations/1/edit`)
		.reply(200, { message: 'edit successful' })
		.persist();
};

describe('Representation change edit page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/1/representation-details/change-edit';

	describe('GET /applications-service/case/1/relevant-representations/1/representation-details/change-edit', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should render the edit page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/1/representation-details/change-edit', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should submit the edit form and return success', async () => {
			const response = await request
				.post(
					'/applications-service/case/1/relevant-representations/1/representation-details/change-edit'
				)
				.send({ editedRepresentation: 'Updated text', editNotes: 'Some notes' });

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('edit successful');
		});
	});
});
