import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { representationsFixture } from '../__fixtures__/representations.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = {
	title: 'mock title',
	status: 'in test',
	reference: 'mock reference',
	keyDates: {
		preExamination: {
			dateOfRelevantRepresentationClose: '2021-01-01'
		}
	}
};
const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/')
		.get(`/applications/1/representations`)
		.query({ searchTerm: 'mock-search-term', sortBy: '', page: 1, pageSize: 25, under18: false })
		.reply(200, {
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 3,
			items: [representationsFixture.items[0]]
		})
		.persist();
	nock('http://test/')
		.get(`/applications/1/representations`)
		.query({ searchTerm: '', sortBy: '', page: 1, pageSize: 25, under18: false })
		.reply(200, representationsFixture)
		.persist();
	nock('http://test/')
		.get('/applications/1/representations/publishable')
		.reply(200, { previouslyPublished: true, itemCount: 1 });
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

			// Assert - Add a representation button is present
			expect(element.innerHTML).toContain('Add a representation');

			// Assert - css classes applied to the status
			expect(element.innerHTML).toContain(
				`<td class="govuk-table__cell"><span class="govuk-tag govuk-tag--grey" id="list-convictions-status-1">AWAITING REVIEW</span>`
			);
			expect(element.innerHTML).toContain(
				`<td class="govuk-table__cell"><span class="govuk-tag govuk-tag" id="list-convictions-status-2">VALID</span>`
			);
		});
	});

	describe('GET /applications-service/:id/relevant-representations with a search term', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/case-team');
		});

		it('should render the page with search term', async () => {
			const response = await request.get(`${baseUrl}?searchTerm=mock-search-term`);
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
		});
	});
});
