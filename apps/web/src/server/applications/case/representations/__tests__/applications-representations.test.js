import { jest } from '@jest/globals';
import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { representationsFixture } from '../__fixtures__/representations.fixture.js';
import dateUtils from '../../../../lib/add-business-days-to-date.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockReviewDate = '2023-01-20';

jest
	.spyOn(dateUtils, 'addBusinessDaysToDate')
	.mockImplementation(() => Promise.resolve(new Date(mockReviewDate)));

const mockCaseReference = {
	title: 'mock title',
	status: 'in test',
	reference: 'mock reference',
	keyDates: {
		preExamination: {
			dateOfRelevantRepresentationClose: '1672531200'
		}
	},
	sector: {
		name: 'mock_sector',
		displayNameEn: 'Mock Sector Display Name'
	},
	subSector: {
		name: 'mock_sub_sector',
		displayNameEn: 'Mock Sub-Sector Display Name'
	}
};
const nocks = () => {
	nock('http://test/').get('/applications/1').times(2).reply(200, mockCaseReference);
	nock('http://test/')
		.get(`/applications/1/representations`)
		.query({
			searchTerm: 'mock-search-term',
			sortBy: '',
			page: 1,
			pageSize: 25,
			status: '',
			under18: false,
			withAttachment: false
		})
		.reply(200, {
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 3,
			items: [representationsFixture.items[0]],
			filters: [
				{ name: 'PUBLISHED', count: 1 },
				{ name: 'AWAITING_REVIEW', count: 1 },
				{ name: 'VALID', count: 1 }
			]
		})
		.persist();
	nock('http://test/')
		.get(`/applications/1/representations`)
		.query({
			searchTerm: '',
			sortBy: '',
			status: '',
			page: 1,
			pageSize: 25,
			under18: false,
			withAttachment: false
		})
		.reply(200, {
			...representationsFixture,
			filters: [
				{ name: 'PUBLISHED', count: 1 },
				{ name: 'AWAITING_REVIEW', count: 1 },
				{ name: 'VALID', count: 1 }
			]
		})
		.persist();
	nock('http://test/')
		.get('/applications/1/representations/publishable')
		.reply(200, { previouslyPublished: true, itemCount: 1 });
	nock('http://test/')
		.get('/applications/1/representations')
		.query({
			status: 'PUBLISHED'
		})
		.reply(200, { itemCount: 1, items: [representationsFixture.items[2]] });
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
			await request.get('/applications-service/');
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
				`<strong class="govuk-tag govuk-tag--grey" id="list-convictions-status-1">Awaiting review</strong>`
			);
			expect(element.innerHTML).toContain(
				`<strong class="govuk-tag govuk-tag--green" id="list-convictions-status-2">Valid</strong>`
			);
			expect(element.innerHTML).toContain(
				`<strong class="govuk-tag govuk-tag--green" id="list-convictions-status-3">Published</strong>`
			);
		});
	});

	describe('GET /applications-service/:id/relevant-representations with a search term', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
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
				`<strong class="govuk-tag govuk-tag--grey" id="list-convictions-status-1">Awaiting review</strong>`
			);
		});
	});
});
