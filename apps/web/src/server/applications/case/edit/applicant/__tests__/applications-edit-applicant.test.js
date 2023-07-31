import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../../testing/applications/fixtures/cases.js';
import { createTestEnvironment } from '../../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, {});
	nock('http://test/')
		.get(/\/applications\/123(.*)/g)
		.times(2)
		.reply(200, fixtureCases[3]);
	nock('http://test/')
		.get(/\/applications\/456(.*)/g)
		.times(2)
		.reply(200, fixtureCases[4]);
};

describe('applications create applicant', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		await request.get('/applications-service/case-team');
	});

	describe('GET edit/applicant-organisation-name', () => {
		const baseUrl = '/applications-service/case/123/edit/applicant-organisation-name';

		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save changes');
		});
	});

	describe('GET edit/applicant-full-name', () => {
		const baseUrl = '/applications-service/case/123/edit/applicant-full-name';

		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save changes');
		});
	});

	describe('GET edit/applicant-email', () => {
		const baseUrl = '/applications-service/case/123/edit/applicant-email';

		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save changes');
		});
	});

	describe('GET edit/applicant-website', () => {
		const baseUrl = '/applications-service/case/123/edit/applicant-website';

		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save changes');
		});
	});

	describe('GET edit/applicant-telephone-number', () => {
		const baseUrl = '/applications-service/case/123/edit/applicant-telephone-number';

		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save changes');
		});
	});

	describe('GET edit/applicant-address', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the read only page with the address', async () => {
			const baseUrl = '/applications-service/case/123/edit/applicant-address';

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save changes');
			expect(element.innerHTML).toContain('London');
		});

		it('should render the read only page without the address', async () => {
			const baseUrl = '/applications-service/case/456/edit/applicant-address';

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Find address');
			expect(element.innerHTML).toContain('Save changes');
		});

		it('should render the form page', async () => {
			const baseUrl = '/applications-service/case/123/edit/applicant-address/new';

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Find address');
		});
	});
});
