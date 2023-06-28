import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../testing/index.js';
import { representationFixture } from '../../../__fixtures__/representations.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };
const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/').get('/applications/1/representations/1').reply(200, representationFixture);
	nock('http://test/')
		.get('/applications/1/folders')
		.reply(200, [
			{
				id: 10,
				displayNameEn: 'Relevant representations'
			}
		]);
};

describe('Representation attachment-upload page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl =
		'/applications-service/case/1/relevant-representations/attachment-upload?repId=1&repType=represented';

	describe('GET /applications-service/case/1/relevant-representations/attachment-upload', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page and have the lookup fields', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain(
				'data-next-page-url="check-answers?repId=1&amp;repType=represented"'
			);
			expect(element.innerHTML).toContain('data-folder-id="10"');
			expect(element.innerHTML).toContain('data-case-id="1"');
		});
	});
});
