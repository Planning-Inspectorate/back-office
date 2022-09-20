import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestApplication } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);

const successPatchPostResponse = { id: 123, applicantIds: [1] };
const successGetResponse = { id: 123, applicants: [{ id: 1 }] };

const nocks = () => {
	nock('http://test/').post('/applications').reply(200, successPatchPostResponse);
	nock('http://test/').patch('/applications/123').reply(200, successPatchPostResponse);
	nock('http://test/')
		.get(/\/applications\/123(.*)/g)
		.times(2)
		.reply(200, successGetResponse);
};

describe('Applications create key dates', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		await request.get('/applications-service/case-officer');
		nocks();
	});

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/create-new-case/123/key-dates';

	describe('GET /key-dates', () => {
		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});
	});

	describe('POST /key-dates', () => {
		describe('Web-side validation:', () => {
			it('should show validation errors if dates are not valid', async () => {
				const response = await request.post(baseUrl).send({
					submissionInternalDay: 32
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(
					'Enter a valid day for the anticipated submission date internal'
				);
			});

			it('should show validation errors if submission date is not in the future', async () => {
				const response = await request.post(baseUrl).send({
					submissionInternalDay: '14',
					submissionInternalMonth: '7',
					submissionInternalYear: '1789'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(
					'The anticipated submission date internal must be in the future'
				);
			});
		});
	});
});
