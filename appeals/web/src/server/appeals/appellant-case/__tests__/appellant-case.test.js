import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../testing/index.js';
import { appellantCaseData } from '../../../../../testing/app/fixtures/referencedata.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const pageUrl = '/appellant-case';

describe('appeal-details', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /appellant-case', () => {
		it('should render the appellant case page', async () => {
			const response = await request.get(`${baseUrl}/1${pageUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case', () => {
		it('should re-render the appellant case page with an error if no review outcome was selected', async () => {
			nock('http://test/').get('/appeals/1/appellant-cases/0').reply(200, appellantCaseData);

			const response = await request.post(`${baseUrl}/1${pageUrl}`).send({
				reviewOutcome: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the confirmation page if selected review outcome value is "valid"', async () => {
			nock('http://test/').get('/appeals/1/appellant-cases/0').reply(200, appellantCaseData);
			nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'valid' });

			const response = await request.post(`${baseUrl}/1${pageUrl}`).send({
				reviewOutcome: 'valid'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
