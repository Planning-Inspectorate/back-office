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
			originalRepresentation: 'test',
			received: '2023-01-01T00:00:00.000Z'
		})
		.reply(200, { message: 'ok' });
};

describe('Representation comment page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/add-representation?repId=1';

	describe('GET /applications-service/case/1/relevant-representations/add-representation', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '&repType=represented');
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/add-representation', () => {
		beforeEach(async () => {
			nocks();
		});

		describe('Represented', () => {
			it('should redirect to the next page', async () => {
				const response = await request.post(baseUrl + '&repType=represented').send({
					originalRepresentation: 'test',
					'received-date-year': '2023',
					'received-date-month': '1',
					'received-date-day': '1'
				});

				expect(response?.headers?.location).toEqual('attachments?repId=1&repType=represented');
			});
		});

		describe('Representative', () => {
			it('should redirect to the next page', async () => {
				const response = await request.post(baseUrl + '&repType=representative').send({
					originalRepresentation: 'test',
					'received-date-year': '2023',
					'received-date-month': '1',
					'received-date-day': '1'
				});

				expect(response?.headers?.location).toEqual('attachments?repId=1&repType=representative');
			});
		});
	});
});
