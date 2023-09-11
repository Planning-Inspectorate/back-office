import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { appealData } from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';

describe('appeal-details', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /:appealId', () => {
		it('should render the received appeal details for a valid appealId with multiple linked/other appeals', async () => {
			const appealId = appealData.appealId.toString();

			nock('http://test/').get(`/appeals/${appealId}`).reply(200, undefined);

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the received appeal details for a valid appealId with single linked/other appeals', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, {
					...appealData,
					appealId,
					linkedAppeals: [
						{
							appealId: 1,
							appealReference: 'APP/Q9999/D/21/725284'
						}
					],
					otherAppeals: [
						{
							appealId: 3,
							appealReference: 'APP/Q9999/D/21/765413'
						}
					]
				});

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the received appeal details for a valid appealId with no linked/other appeals', async () => {
			const appealId = '3';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, {
					...appealData,
					appealId,
					linkedAppeals: [],
					otherAppeals: []
				});

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the received appeal details for a valid appealId without start date', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, { ...appealData, startedAt: null });

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a page not found when the appealId is not valid/does not exist', async () => {
			const appealIdThatDoesNotExist = 0;

			nock('http://test/').get(`/appeals/${appealIdThatDoesNotExist}`).reply(500);

			const response = await request.get(`${baseUrl}/${appealIdThatDoesNotExist}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
