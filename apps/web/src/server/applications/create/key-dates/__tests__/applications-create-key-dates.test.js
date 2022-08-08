import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { createTestApplication } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);

describe('Applications create key dates', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		await request.get('/applications-service/case-officer');
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
					firstNotifiedDay: 'not_a_number',
					submissionDay: 32
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a valid day for the first notified date');
				expect(element.innerHTML).toContain('Enter a valid day for the submission date');
			});

			it('should show validation errors if submission date is not in the future', async () => {
				const response = await request.post(baseUrl).send({
					submissionDay: '14',
					submissionMonth: '7',
					submissionYear: '1789'
				});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('The submission date should be in the future');
			});
		});
	});
});
