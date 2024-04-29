import { createTestEnvironment } from '../../../../testing/index.js';
import supertest from 'supertest';
import { parseHtml } from '@pins/platform';

const { app } = createTestEnvironment();
const request = supertest(app);

describe('app', () => {
	describe('GET /', () => {
		it('page not found with correct support link', async () => {
			const response = await request.get('/unknown-path');
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			expect(element.innerHTML).toContain('Page not found');

			expect(element.innerHTML).toContain('Contact the Planning Inspectorate Customer Support');

			expect(element.innerHTML).toContain(
				'https://intranet.planninginspectorate.gov.uk/task/report-it-problem/'
			);
		});
	});
});
