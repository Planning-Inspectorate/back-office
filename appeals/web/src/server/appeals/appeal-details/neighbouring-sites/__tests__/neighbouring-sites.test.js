import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { appealData } from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';

describe('neighbouring-sites', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /add', () => {
		it('should render getAllNeighbouringSite page', async () => {
			const appealId = appealData.appealId.toString();
			const response = await request.get(`${baseUrl}/${appealId}/neighbouring-sites/add`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /add', () => {
		it('should re-render getAllNeighbouringSite page if addressLine1 is null', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: null,
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the first line of the address');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render getAllNeighbouringSite page if addressLine1 is an empty string', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the first line of the address');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render getAllNeighbouringSite page if town is null', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: null,
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the town');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render getAllNeighbouringSite page if town is an empty string', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: '',
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the town');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render getAllNeighbouringSite page if the postcode is null', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: null
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter postcode');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render getAllNeighbouringSite page if the postcode is invalid', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: '111'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Invalid postcode');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render getAllNeighbouringSite page if the postcode is an empty string', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: ''
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter postcode');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-direct to the check and confirm page if the data is valid', async () => {
			const appealId = appealData.appealId.toString();

			const validData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(validData);

			expect(response.statusCode).toBe(302);

			expect(response.text).toBe(
				'Found. Redirecting to /appeals-service/appeal-details/1/neighbouring-sites/add/check-and-confirm'
			);
		});
	});

	describe('GET /add/check-and-confirm', () => {
		it('should render the check your answers page', async () => {
			const validData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: 'E1 8RU'
			};
			const appealId = appealData.appealId.toString();
			const addNeighbouringSiteResponse = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/add`)
				.send(validData)
				.expect(302);

			expect(addNeighbouringSiteResponse.headers.location).toBe(
				`${baseUrl}/${appealId}/neighbouring-sites/add/check-and-confirm`
			);

			const response = await request.get(
				`${baseUrl}/${appealId}/neighbouring-sites/add/check-and-confirm`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
