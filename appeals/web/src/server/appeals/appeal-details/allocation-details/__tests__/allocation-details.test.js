import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { allocationDetailsData } from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details/1/allocation-details';

describe('Allocation Details', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	it(`should render "Select the allocation level" Page`, async () => {
		nock('http://test/')
			.get('/appeals/appeal-allocation-levels')
			.reply(200, allocationDetailsData.levels);

		const response = await request.get(`${baseUrl}/allocation-level`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should render "Select the allocation level" with error (no answer provided)', async () => {
		nock('http://test/')
			.get('/appeals/appeal-allocation-levels')
			.reply(200, allocationDetailsData.levels);

		const response = await request.post(`${baseUrl}/allocation-level`).send({
			'allocation-level': ''
		});

		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should redirect to "Allocation specialism" page if no errors are present and posted allocation-level is provided`, async () => {
		const response = await request.post(`${baseUrl}/allocation-level`).send({
			'allocation-level': 'A'
		});

		expect(response.statusCode).toBe(302);
	});

	it(`should render "Select allocation specialism" Page`, async () => {
		// post to preceding pages in the flow is necessary to set required data in the session
		nock('http://test/')
			.get('/appeals/appeal-allocation-levels')
			.reply(200, allocationDetailsData.levels);
		nock('http://test/')
			.get('/appeals/appeal-allocation-specialisms')
			.reply(200, allocationDetailsData.specialisms);

		await request.post(`${baseUrl}/allocation-level`).send({
			'allocation-level': 'A'
		});

		const response = await request.get(`${baseUrl}/allocation-specialism`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should render "Select allocation specialism" with error (no answer provided)', async () => {
		// post to preceding pages in the flow is necessary to set required data in the session
		nock('http://test/')
			.get('/appeals/appeal-allocation-levels')
			.reply(200, allocationDetailsData.levels);
		nock('http://test/')
			.get('/appeals/appeal-allocation-specialisms')
			.reply(200, allocationDetailsData.specialisms);

		await request.post(`${baseUrl}/allocation-level`).send({
			'allocation-level': 'A'
		});

		const response = await request.post(`${baseUrl}/allocation-specialism`).send({
			'allocation-specialisms': []
		});

		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should redirect to "Check answer" page if no errors are present and posted allocation-specialisms is provided`, async () => {
		// post to preceding pages in the flow is necessary to set required data in the session
		nock('http://test/')
			.get('/appeals/appeal-allocation-levels')
			.reply(200, allocationDetailsData.levels);
		nock('http://test/')
			.get('/appeals/appeal-allocation-specialisms')
			.reply(200, allocationDetailsData.specialisms);

		await request.post(`${baseUrl}/allocation-level`).send({
			'allocation-level': 'A'
		});

		const response = await request.post(`${baseUrl}/allocation-specialism`).send({
			'allocation-specialisms': [1, 2, 3]
		});

		expect(response.statusCode).toBe(302);
	});

	it(`should render "Check answers" Page`, async () => {
		// post to preceding pages in the flow is necessary to set required data in the session
		nock('http://test/')
			.get('/appeals/appeal-allocation-levels')
			.reply(200, allocationDetailsData.levels);
		nock('http://test/')
			.get('/appeals/appeal-allocation-specialisms')
			.reply(200, allocationDetailsData.specialisms);

		await request.post(`${baseUrl}/allocation-level`).send({
			'allocation-level': 'A'
		});

		await request.post(`${baseUrl}/allocation-specialism`).send({
			'allocation-specialisms': [1, 2, 3]
		});

		const response = await request.get(`${baseUrl}/check-answers`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should redirect to "Case details" page if no errors are present and posted allocation-specialisms is provided`, async () => {
		// post to preceding pages in the flow is necessary to set required data in the session
		nock('http://test/')
			.get('/appeals/appeal-allocation-levels')
			.reply(200, allocationDetailsData.levels);
		nock('http://test/')
			.get('/appeals/appeal-allocation-specialisms')
			.reply(200, allocationDetailsData.specialisms);
		nock('http://test/').patch('/appeals/1/appeal-allocation').reply(200);

		await request.post(`${baseUrl}/allocation-level`).send({
			'allocation-level': 'A'
		});

		await request.post(`${baseUrl}/allocation-specialism`).send({
			'allocation-specialisms': [1, 2, 3]
		});

		const response = await request.post(`${baseUrl}/check-answers`);

		expect(response.statusCode).toBe(302);
	});
});
