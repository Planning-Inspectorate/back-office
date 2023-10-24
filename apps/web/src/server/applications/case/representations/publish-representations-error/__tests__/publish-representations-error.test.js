import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';

const { app } = createTestEnvironment();
const request = supertest(app);

const baseUrl = '/applications-service/case/1/relevant-representations/publishing-error';

describe('publish-updated-representations.controller', () => {
	describe('GET /applications-service/:caseId/relevant-representations/publishing-error', () => {
		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Sorry, there is a problem');
			expect(element.innerHTML).toContain('The publishing service is unavailable.');
		});
	});
});
