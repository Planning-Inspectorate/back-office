import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { representationsFixture } from '../__fixtures__/representations.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };
const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/')
		.get(`/applications/1/representations`)
		.reply(200, representationsFixture)
		.persist();
};

describe('applications representations', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/1/relevant-representations';

	describe('GET /applications-service/:caseId/relevant-representations', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// Assert - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);
			expect(element.innerHTML).toContain(mockCaseReference.status);
			expect(element.innerHTML).toContain(mockCaseReference.reference);

			// Assert - css classes applied to the status
			expect(element.innerHTML).toContain(
				`<td class="govuk-table__cell"><span class="govuk-tag govuk-tag--grey" id="list-convictions-status-1">AWAITING REVIEW</span>`
			);
			expect(element.innerHTML).toContain(
				`<td class="govuk-table__cell"><span class="govuk-tag govuk-tag" id="list-convictions-status-2">VALID</span>`
			);
		});
	});
});
