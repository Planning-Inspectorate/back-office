import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = {
	id: 1,
	title: 'mock title',
	status: 'in test',
	reference: 'mock reference'
};
/**
 * @returns {import('@pins/applications').ProjectUpdate}
 */
function testUpdate() {
	return {
		authorId: 1,
		caseId: 2,
		dateCreated: '',
		emailSubscribers: false,
		htmlContent: 'My project update',
		id: 3,
		status: 'draft'
	};
}
const nocks = () => {
	nock('http://test/')
		.get(`/applications/${mockCaseReference.id}`)
		.reply(200, mockCaseReference)
		.persist();
	nock('http://test/')
		.get(`/applications/${mockCaseReference.id}/project-updates`)
		.query({ page: 1, pageSize: 25 })
		.reply(200, {
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 3,
			items: [testUpdate(), testUpdate(), testUpdate()]
		})
		.persist();
};

describe('project-updates', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = `/applications-service/case/${mockCaseReference.id}/project-updates`;

	describe('GET /applications-service/:caseId/project-updates', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the project updates table', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);
			expect(element.innerHTML).toContain(mockCaseReference.status);
			expect(element.innerHTML).toContain(mockCaseReference.reference);

			// check - project updates table present
			expect(element.innerHTML).toContain('Project updates');
			expect(element.innerHTML).toContain(testUpdate().htmlContent);
		});
	});
});
