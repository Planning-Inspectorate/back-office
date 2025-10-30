import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../testing/index.js';
import { representationDetailsFixture } from '../../__fixtures__/representation-details.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };

const setupNocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);

	nock('http://test/')
		.get('/applications/1/representations/1')
		.reply(200, representationDetailsFixture)
		.persist();

	nock('http://test/')
		.patch('/applications/1/representations/1/edit')
		.reply(200, { message: 'patched' })
		.persist();
};

describe('Edit Representation Page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);
	afterAll(() => nock.cleanAll());

	const baseUrl =
		'/applications-service/case/1/relevant-representations/1/representation-details/edit-representation';

	describe('GET', () => {
		beforeEach(async () => {
			setupNocks();
			await request.get('/applications-service/');
		});

		it('renders the edit representation page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST', () => {
		beforeEach(async () => {
			setupNocks();
			await request.get('/applications-service/');
		});

		it('shows error when editedRepresentation is missing', async () => {
			const response = await request.post(baseUrl).send({});
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('patches and redirects on valid submission', async () => {
			const response = await request.post(baseUrl).send({
				editedRepresentation: 'Test representation',
				editNotes: 'Some notes'
			});
			expect(response.headers.location).toBe(
				'/applications-service/case/1/relevant-representations/1/representation-details'
			);
		});
	});
});
