import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../testing/index.js';

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
});
