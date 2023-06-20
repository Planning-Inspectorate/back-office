import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { lpaQuestionnaireData } from '../../../../../../testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details/1/lpa-questionnaire-review/2';

describe('LPA Questionnaire review', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		it('should render LPA Questionnaire review', async () => {
			nock('http://test/').get('/appeals/1/lpa-questionnaires/2').reply(200, lpaQuestionnaireData);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /', () => {
		it('should render LPA Questionnaire review with error (no answer provided)', async () => {
			nock('http://test/').get('/appeals/1/lpa-questionnaires/2').reply(200, lpaQuestionnaireData);

			const response = await request.post(baseUrl).send({
				'review-outcome': ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the complete page if no errors are present', async () => {
			nock('http://test/').get('/appeals/1/lpa-questionnaires/2').reply(200, lpaQuestionnaireData);

			await request.post(baseUrl).send({
				'review-outcome': 'complete'
			});

			// TODO: finish this test when BOAT-238 is done
			expect(true).toBe(true);
		});
	});
});
