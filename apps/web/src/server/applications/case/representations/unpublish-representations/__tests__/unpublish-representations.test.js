import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const baseUrl = '/applications-service/case/1/relevant-representations/unpublish-representations';

const mockCaseData = { title: 'Unpublish relevant representations' };
const mockRepresentations = {
	items: [
		{ id: '1', status: 'PUBLISHED' },
		{ id: '2', status: 'DRAFT' }
	]
};

describe('unpublish-representations', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => nock.cleanAll());

	describe('GET /applications-service/:caseId/unpublish-representations/unpublish-representations', () => {
		describe('It renders the unpublish page', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/').get('/applications/1/representations').reply(200, mockRepresentations);
			};
			nocks();

			it('should render the page with the publish button', async () => {
				const response = await request.get(baseUrl);

				const headingElement = parseHtml(response.text, { rootElement: '.govuk-heading-l' });
				const buttonElement = parseHtml(response.text, {
					rootElement: 'form button[data-module="govuk-button"]'
				});
				expect(headingElement.innerHTML).toContain('Unpublish relevant representations');
				expect(buttonElement.innerHTML).toContain('Unpublish all representations');
			});
		});
	});

	describe('POST /applications-service/case/:caseId/relevant-representations/unpublish-representations', () => {
		// const publishedReps = [
		// 	{
		// 		id: 1,
		// 		status: 'PUBLISHED',
		// 		reference: 'mock-reference-1',
		// 		redacted: true,
		// 		received: '2023-10-10T10:47:21.846Z',
		// 		firstName: 'mock name',
		// 		lastName: 'mock last name',
		// 		organisationName: 'mock org'
		// 	},
		// 	{
		// 		id: 2,
		// 		status: 'PUBLISHED',
		// 		reference: 'mock-reference-2',
		// 		redacted: true,
		// 		received: '2023-10-10T10:47:21.846Z',
		// 		firstName: 'mock name',
		// 		lastName: 'mock last name',
		// 		organisationName: 'mock org'
		// 	}
		// ];
		// const allReps = [...publishedReps, {
		// 	id: 3,
		// 	status: 'VALID',
		// 	reference: 'mock-reference-3',
		// 	redacted: true,
		// 	received: '2023-10-10T10:47:21.846Z',
		// 	firstName: 'mock name',
		// 	lastName: 'mock last name',
		// 	organisationName: 'mock org'
		// }];
		const validReps = [
			{
				id: 1,
				status: 'VALID',
				reference: 'mock-reference-1',
				redacted: true,
				received: '2023-10-10T10:47:21.846Z',
				firstName: 'mock name',
				lastName: 'mock last name',
				organisationName: 'mock org'
			},
			{
				id: 2,
				status: 'VALID',
				reference: 'mock-reference-2',
				redacted: true,
				received: '2023-10-10T10:47:21.846Z',
				firstName: 'mock name',
				lastName: 'mock last name',
				organisationName: 'mock org'
			}
		];

		// describe('when there are published representations', () => {
		// 	beforeEach(() => {
		// 		nock('http://test/').get('/applications/1').reply(200, mockCaseData);
		// 		nock('http://test/').get('/applications/1/representations').reply(200, { items: allReps });
		// 		nock('http://test/').get('/applications/1').reply(200, mockCaseData);
		// 		nock('http://test/').get('/applications/1').reply(200, mockCaseData);
		// 		nock('http://test/').get('/applications/1/representations').reply(200, { items: allReps });
		// 		nock('http://test/')
		// 			.get('/applications/1/representations/publishable')
		// 			.reply(200, { publishedRepIds: [1, 2] });
		// 	});
		//
		// 	it('should redirect with unpublished param if published representations exist', async () => {
		// 		let response;
		// 		try {
		// 			response = await request
		// 				.post('/applications-service/case/1/relevant-representations/unpublish-representations')
		// 				.send();
		// 		} catch (err) {
		// 			console.error('Test error:', err);
		// 			throw err;
		// 		}
		// 		console.log('<><><><><><>  Response <><><><><><> ', { response });
		// 		expect(response.status).toBe(302);
		// 		expect(response.headers.location).toBe('/applications-service/case/1/relevant-representations?unpublished=2');
		// 	});
		// });

		describe('when there are no published representations', () => {
			beforeEach(() => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations')
					.reply(200, { items: validReps });
				nock('http://test/')
					.patch('/applications/1/representations/publishable')
					.reply(200, { publishedRepIds: [] });
			});

			it('should redirect without unpublished param if no published representations', async () => {
				const response = await request
					.post('/applications-service/case/1/relevant-representations/unpublish-representations')
					.send();
				expect(response.status).toBe(302);
				expect(response.headers.location).toBe(
					'/applications-service/case/1/relevant-representations'
				);
			});
		});
	});
});
