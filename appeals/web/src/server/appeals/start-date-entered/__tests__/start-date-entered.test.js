import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const pageUrl = '/start-date-entered';

describe('appeal-details', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /start-date-entered', () => {
		it('should render the start date entered page', async () => {
			const response = await request.get(`${baseUrl}/1${pageUrl}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
