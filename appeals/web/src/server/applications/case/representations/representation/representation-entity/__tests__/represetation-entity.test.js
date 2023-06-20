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
			represented: { type: 'PERSON' }
		})
		.reply(200, { message: 'ok' });

	nock('http://test/')
		.patch(`/applications/1/representations/1`, {
			representative: { type: 'AGENT' }
		})
		.reply(200, { message: 'ok' });

	nock('http://test/')
		.delete(`/applications/1/representations/1/contacts/1`)
		.reply(200, { message: 'ok' });
};

describe('Representation representation type', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/representation-entity?repId=1';

	describe('GET /applications-service/case/1/relevant-representations/representation-entity', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '&repType=represented');
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/representation-entity', () => {
		beforeEach(async () => {
			nocks();
		});
		describe('Field validation:', () => {
			it('should show validation error if no option selected', async () => {
				const response = await request.post(baseUrl + '&repType=represented').send({});

				const element = parseHtml(response.text);
				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select one option');
			});
		});

		describe('Represented:', () => {
			it("should redirect to the next page'", async () => {
				const response = await request.post(baseUrl + '&repType=represented').send({
					representationEntity: 'PERSON'
				});

				expect(response?.headers?.location).toEqual(
					'add-representation?repId=1&repType=represented'
				);
			});
		});

		describe('Representative:', () => {
			it('should redirect to the next page', async () => {
				const response = await request.post(baseUrl).send({
					representationEntity: 'AGENT'
				});
				expect(response?.headers?.location).toEqual(
					'contact-details?repId=1&repType=representative'
				);
			});
		});
	});
});
