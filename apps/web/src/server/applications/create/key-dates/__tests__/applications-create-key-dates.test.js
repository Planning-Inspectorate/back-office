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
