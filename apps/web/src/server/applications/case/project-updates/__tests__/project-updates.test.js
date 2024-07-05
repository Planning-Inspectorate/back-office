import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { projectUpdateRoutes } from '../project-updates.router.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = {
	id: 1,
	title: 'mock title',
	status: 'in test',
	reference: 'mock reference'
};
const mockProjectUpdate = {
	id: 1,
	status: 'draft',
	htmlContent: 'Hello, world!',
	type: 'general'
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
		sentToSubscribers: false,
		htmlContent: 'My project update',
		htmlContentWelsh: null,
		title: null,
		id: 3,
		status: 'draft',
		type: 'general'
	};
}
const nocks = (caseProperties = {}) => {
	nock('http://test/')
		.get(`/applications/${mockCaseReference.id}`)
		.reply(200, { ...mockCaseReference, ...caseProperties })
		.persist();
	nock('http://test/')
		.get(`/applications/${mockCaseReference.id}/project-updates`)
		.query({ page: 1, pageSize: 25, sortBy: `-datePublished` })
		.reply(200, {
			page: 1,
			pageSize: 25,
			pageCount: 1,
			itemCount: 3,
			items: [testUpdate(), testUpdate(), testUpdate()]
		})
		.persist();
	nock('http://test/')
		.get(`/applications/${mockCaseReference.id}/project-updates/${mockProjectUpdate.id}`)
		.reply(200, mockProjectUpdate)
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
			await request.get('/applications-service/');
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

	describe('GET /applications-service/:caseId/project-updates/create', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '/create');
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);

			// check - project updates form present
			expect(element.innerHTML).toContain('Details about the update');
			expect(element.innerHTML).toContain('Content');
			expect(element.innerHTML).toContain('Email to subscribers?');
		});
	});

	describe('POST /applications-service/:caseId/project-updates/create', () => {
		describe('where Case is English:', () => {
			beforeEach(async () => {
				nocks();
				await request.get('/applications-service/');
			});

			const testsInEnglish = [
				{
					name: 'should check content exists',
					body: {},
					expectContains: ['Enter details about the update']
				},
				{
					name: 'should check content is more than 12 characters',
					body: {
						backOfficeProjectUpdateContent: '12345678901'
					},
					expectContains: ['Details about the update must be 12 characters or more']
				},
				{
					name: 'should render the next step',
					body: {
						backOfficeProjectUpdateContent: '123456789012',
						emailSubscribers: true
					},
					expectContains: []
				}
			];

			it.each(testsInEnglish)(`$name`, async ({ body, expectContains }) => {
				const response = await request.post(baseUrl + '/create').send(body);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				for (const str of expectContains) {
					expect(element.innerHTML).toContain(str);
				}
			});
		});
		describe('where Case is Welsh:', () => {
			beforeEach(async () => {
				nocks({ geographicalInformation: { regions: [{ name: 'wales' }] } });
				await request.get('/applications-service/');
			});

			const testsInWelsh = [
				{
					name: 'should check content exists',
					body: {
						backOfficeProjectUpdateContent: '1234567890123'
					},
					expectContains: ['Enter details about the update in Welsh']
				},
				{
					name: 'should check content is more than 12 characters',
					body: {
						backOfficeProjectUpdateContent: '1234567890123',
						backOfficeProjectUpdateContentWelsh: '12345678901'
					},
					expectContains: ['Details about the update in Welsh must be 12 characters or more']
				},
				{
					name: 'should render the next step',
					body: {
						backOfficeProjectUpdateContent: '1234567890123',
						backOfficeProjectUpdateContentWelsh: '123456789012',
						emailSubscribers: true
					},
					expectContains: []
				}
			];

			it.each(testsInWelsh)(`$name`, async ({ body, expectContains }) => {
				const response = await request.post(baseUrl + '/create').send(body);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				for (const str of expectContains) {
					expect(element.innerHTML).toContain(str);
				}
			});
		});
	});

	describe('GET /applications-service/:caseId/project-updates/:projectUpdateId/type', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '/1/' + projectUpdateRoutes.type);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);

			// check - project updates form present
			expect(element.innerHTML).toContain('What information does the update contain?');
			expect(element.innerHTML).toContain('General');
		});
	});

	describe('POST /applications-service/:caseId/project-updates/:projectUpdateId/type', () => {
		beforeEach(async () => {
			nocks();
			nock('http://test/')
				.patch(`/applications/${mockCaseReference.id}/project-updates/${mockProjectUpdate.id}`)
				.reply(200)
				.persist();
			await request.get('/applications-service/');
		});

		const tests = [
			{
				name: 'should render the next step',
				body: {
					type: 'general'
				},
				redirectTo: `${baseUrl}/1/${projectUpdateRoutes.status}`
			}
		];

		it.each(tests)(`$name`, async ({ body, redirectTo }) => {
			const response = await request.post(baseUrl + '/1/' + projectUpdateRoutes.type).send(body);
			expect(response.statusCode).toEqual(302);
			expect(response.get('location')).toEqual(redirectTo);
		});
	});

	describe('GET /applications-service/:caseId/project-updates/:projectUpdateId/status', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '/1/status');
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);

			// check - project updates form present
			expect(element.innerHTML).toContain('Set status');
			expect(element.innerHTML).toContain('Draft');
			expect(element.innerHTML).toContain('Publish');
		});
	});

	describe('POST /applications-service/:caseId/project-updates/:projectUpdateId/status', () => {
		beforeEach(async () => {
			nocks();
			nock('http://test/')
				.patch(`/applications/${mockCaseReference.id}/project-updates/${mockProjectUpdate.id}`)
				.reply(200)
				.persist();
			await request.get('/applications-service/');
		});

		const tests = [
			{
				name: 'should render the next step',
				body: {
					status: 'published'
				},
				redirectTo: `${baseUrl}/1/${projectUpdateRoutes.checkAnswers}`
			}
		];

		it.each(tests)(`$name`, async ({ body, redirectTo }) => {
			const response = await request.post(baseUrl + '/1/' + projectUpdateRoutes.status).send(body);
			expect(response.statusCode).toEqual(302);
			expect(response.get('location')).toEqual(redirectTo);
		});
	});

	describe('GET /applications-service/:caseId/project-updates/:projectUpdateId/check-answers', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '/1/' + projectUpdateRoutes.checkAnswers);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);

			// check - project updates form present
			expect(element.innerHTML).toContain('Check your project update');
			expect(element.innerHTML).toContain('Content');
			expect(element.innerHTML).toContain('Status');
		});
	});

	describe('POST /applications-service/:caseId/project-updates/:projectUpdateId/check-answers', () => {
		beforeEach(async () => {
			nocks();
			nock('http://test/')
				.patch(`/applications/${mockCaseReference.id}/project-updates/${mockProjectUpdate.id}`)
				.reply(200)
				.persist();
			await request.get('/applications-service/');
		});

		const tests = [
			{
				name: 'should render the next step',
				body: {
					status: 'published'
				},
				expectContains: ['project update', 'published']
			},
			{
				name: 'should render the next step (draft status)',
				body: {},
				expectContains: ['draft project update', 'created']
			}
		];

		it.each(tests)(`$name`, async ({ body, expectContains }) => {
			const response = await request
				.post(baseUrl + '/1/' + projectUpdateRoutes.checkAnswers)
				.send(body)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);

			// check - success banner + table header
			expect(element.innerHTML).toContain('Success');
			expect(element.innerHTML).toContain('Project updates');
			for (const str of expectContains) {
				expect(element.innerHTML).toContain(str);
			}
		});
	});

	describe('GET /applications-service/:caseId/project-updates/:projectUpdateId/review', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '/1/' + projectUpdateRoutes.review);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);

			// check - project updates details present
			expect(element.innerHTML).toContain('Project update preview');
			expect(element.innerHTML).toContain('Content');
			expect(element.innerHTML).toContain('Status');
		});
	});

	describe('GET /applications-service/:caseId/project-updates/:projectUpdateId/delete', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl + '/1/' + projectUpdateRoutes.delete);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);

			// check - project updates details present
			expect(element.innerHTML).toContain('Delete project update');
			expect(element.innerHTML).toContain('Content');
		});
	});

	describe('POST /applications-service/:caseId/project-updates/:projectUpdateId/delete', () => {
		beforeEach(async () => {
			nocks();
			nock('http://test/')
				.delete(`/applications/${mockCaseReference.id}/project-updates/${mockProjectUpdate.id}`)
				.reply(204)
				.persist();
			await request.get('/applications-service/');
		});

		it('should render the page', async () => {
			const response = await request
				.post(baseUrl + '/1/' + projectUpdateRoutes.delete)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			// check - case ref data is present
			expect(element.innerHTML).toContain(mockCaseReference.title);

			// check - success banner + table header
			expect(element.innerHTML).toContain('Success');
			expect(element.innerHTML).toContain('Project updates');
		});
	});
});
