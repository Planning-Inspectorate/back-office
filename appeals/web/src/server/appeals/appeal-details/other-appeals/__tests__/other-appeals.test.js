import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import { appealData, linkableAppeal } from '#testing/appeals/appeals.js';

const { app, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';

const appealDataWithOtherAppeals = {
	...appealData,
	otherAppeals: [
		{
			appealId: 2,
			appealReference: 'TEST-2',
			externalSource: false,
			linkingDate: '2024-02-27T15:44:22.247Z',
			relationshipId: 100
		},
		{
			appealId: 3,
			appealReference: 'TEST-3',
			externalSource: false,
			linkingDate: '2024-02-27T15:44:22.247Z',
			relationshipId: 101
		}
	]
};

describe('other-appeals', () => {
	beforeEach(() => {
		nock('http://test/').get('/appeals/1').reply(200, appealDataWithOtherAppeals);
	});
	afterEach(teardown);

	describe('GET /other-appeals/add', () => {
		it('should render the "What is the appeal reference?" page', async () => {
			const response = await request.get(`${baseUrl}/1/other-appeals/add`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the "What is the appeal reference?" page with error "Enter an appeal reference"', async () => {
			const response = await request
				.post(`${baseUrl}/1/other-appeals/add`)
				.send({ addOtherAppealsReference: '' });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the "What is the appeal reference?" page with error "Appeal reference could not be found"', async () => {
			nock('http://test/').get('/appeals/linkable-appeal/1').reply(404);
			const response = await request
				.post(`${baseUrl}/1/other-appeals/add`)
				.send({ addOtherAppealsReference: '1' });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the "Related appeal details" page if related appeal reference is valid', async () => {
			nock('http://test/').get('/appeals/linkable-appeal/3').reply(200, linkableAppeal);
			const response = await request
				.post(`${baseUrl}/1/other-appeals/add`)
				.send({ addOtherAppealsReference: '3' });
			expect(response.statusCode).toBe(302);
		});

		it('should render the "Related appeal details" page', async () => {
			const addPageResponse = await request
				.post(`${baseUrl}/1/other-appeals/add`)
				.send({ addOtherAppealsReference: '3' });
			expect(addPageResponse.statusCode).toBe(302);

			nock('http://test/').get('/appeals/1').reply(200, appealDataWithOtherAppeals);
			nock('http://test/').get('/appeals/linkable-appeal/3').reply(200, linkableAppeal);

			const response = await request.get(`${baseUrl}/1/other-appeals/confirm`);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the "Related appeal details" page with the error if the answer was not provided', async () => {
			const addPageResponse = await request
				.post(`${baseUrl}/1/other-appeals/add`)
				.send({ addOtherAppealsReference: '3' });
			expect(addPageResponse.statusCode).toBe(302);

			nock('http://test/').get('/appeals/1').reply(200, appealDataWithOtherAppeals).persist();
			nock('http://test/').get('/appeals/linkable-appeal/3').reply(200, linkableAppeal).persist();

			const confirmationPageResponse = await request
				.post(`${baseUrl}/1/other-appeals/confirm`)
				.send({ relateAppealsAnswer: '' });

			const element = parseHtml(confirmationPageResponse.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect back to appeal details page if the answer was provided (answer no)', async () => {
			const addPageResponse = await request
				.post(`${baseUrl}/1/other-appeals/add`)
				.send({ addOtherAppealsReference: '3' });
			expect(addPageResponse.statusCode).toBe(302);

			nock('http://test/').get('/appeals/1').reply(200, appealDataWithOtherAppeals).persist();
			nock('http://test/').get('/appeals/linkable-appeal/3').reply(200, linkableAppeal);

			await request.get(`${baseUrl}/1/other-appeals/confirm`);

			const confirmationPageResponse = await request
				.post(`${baseUrl}/1/other-appeals/confirm`)
				.send({ relateAppealsAnswer: 'no' });
			expect(confirmationPageResponse.statusCode).toBe(302);
		});

		it('should redirect back to appeal details page if the answer was provided (answer yes)', async () => {
			const addPageResponse = await request
				.post(`${baseUrl}/1/other-appeals/add`)
				.send({ addOtherAppealsReference: '3' });
			expect(addPageResponse.statusCode).toBe(302);

			nock('http://test/').get('/appeals/1').reply(200, appealDataWithOtherAppeals).persist();
			nock('http://test/').get('/appeals/linkable-appeal/3').reply(200, linkableAppeal).persist();
			nock('http://test/').post('/appeals/1/associate-appeal').reply(200);

			await request.get(`${baseUrl}/1/other-appeals/confirm`);

			const confirmationPageResponse = await request
				.post(`${baseUrl}/1/other-appeals/confirm`)
				.send({ relateAppealsAnswer: 'yes' });
			expect(confirmationPageResponse.statusCode).toBe(302);
		});
	});
});
