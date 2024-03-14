import { parseHtml } from '@pins/platform';
import supertest from 'supertest';
import { appealData } from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';
import nock from 'nock';

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

	describe('GET /manage', () => {
		it('should render the manage neighbouring sites page', async () => {
			const appealId = appealData.appealId.toString();
			const response = await request.get(`${baseUrl}/${appealId}/neighbouring-sites/manage`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /remove/:siteId', () => {
		it('should render the remove neighbouring site page', async () => {
			const appealId = appealData.appealId.toString();
			const response = await request.get(`${baseUrl}/${appealId}/neighbouring-sites/remove/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /remove/:siteId', () => {
		it('should re-render remove neighbouring if user has not selected a radio option', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/remove/1`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Answer must be provided');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should redirect to the manage page if you select no', async () => {
			const appealId = appealData.appealId.toString();

			const validData = {
				'remove-neighbouring-site': 'no'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/remove/1`)
				.send(validData);

			expect(response.statusCode).toBe(302);

			expect(response.headers.location).toBe(`${baseUrl}/${appealId}/neighbouring-sites/manage`);
		});

		it('should redirect to the details page if you select yes', async () => {
			const appealId = appealData.appealId.toString();

			nock('http://test/').delete(`/appeals/${appealId}/neighbouring-sites`).reply(200, {
				siteId: 1
			});

			const validData = {
				'remove-neighbouring-site': 'yes'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/remove/1`)
				.send(validData);

			expect(response.statusCode).toBe(302);

			expect(response.headers.location).toBe(`${baseUrl}/${appealId}`);
		});
	});

	describe('GET /change/:siteId', () => {
		it('should render the change neighbouring site page', async () => {
			const appealId = appealData.appealId.toString();
			const response = await request.get(`${baseUrl}/${appealId}/neighbouring-sites/change/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /change/:siteId', () => {
		it('should re-render changeNeighbouringSite page if addressLine1 is null', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: null,
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the first line of the address');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render changeNeighbouringSite page if addressLine1 is an empty string', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the first line of the address');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render changeNeighbouringSite page if town is null', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: null,
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the town');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render changeNeighbouringSite page if town is an empty string', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: '',
				county: null,
				postCode: 'E1 8RU'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter the town');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render changeNeighbouringSite page if the postcode is null', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: null
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter postcode');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render changeNeighbouringSite page if the postcode is invalid', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: '111'
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
				.send(invalidData);

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Invalid postcode');
			expect(element.innerHTML).toContain('govuk-error-summary');
		});

		it('should re-render changeNeighbouringSite page if the postcode is an empty string', async () => {
			const appealId = appealData.appealId.toString();

			const invalidData = {
				addressLine1: '123 Long Road',
				addressLine2: null,
				town: 'London',
				county: null,
				postCode: ''
			};
			const response = await request
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
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
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
				.send(validData);

			expect(response.statusCode).toBe(302);

			expect(response.text).toBe(
				'Found. Redirecting to /appeals-service/appeal-details/1/neighbouring-sites/change/1/check-and-confirm'
			);
		});
	});

	describe('GET /change/:siteId/check-and-confirm', () => {
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
				.post(`${baseUrl}/${appealId}/neighbouring-sites/change/1`)
				.send(validData)
				.expect(302);

			expect(addNeighbouringSiteResponse.headers.location).toBe(
				`${baseUrl}/${appealId}/neighbouring-sites/change/1/check-and-confirm`
			);

			const response = await request.get(
				`${baseUrl}/${appealId}/neighbouring-sites/change/1/check-and-confirm`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
