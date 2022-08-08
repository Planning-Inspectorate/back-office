import {parseHtml} from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import {fixtureApplications} from "../../../../../../testing/applications/fixtures/applications.js";
import {
	fixtureRegions,
	fixtureSectors,
	fixtureZoomLevels
} from '../../../../../../testing/applications/fixtures/options-item.js';
import {createTestApplication} from '../../../../../../testing/index.js';

const {app, installMockApi, teardown} = createTestApplication();
const request = supertest(app);
const successResponse = {id: 1, applicantIds: [1]};

const nocks = () => {
	nock('http://test/').get('/applications/case-officer').reply(200, fixtureApplications);
	nock('http://test/').get('/applications/sector').reply(200, fixtureSectors);
	nock('http://test/')
		.get('/applications/sector?sectorName=transport')
		.reply(200, fixtureSectors);
}

describe('applications create', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('Name and description', () => {
		describe('GET /create-new-case', () => {
			const baseUrl = '/applications-service/create-new-case';

			describe('When role is:', () => {
				describe('Inspector', () => {
					it('should NOT render the form', async () => {
						await request.get('/applications-service/inspector');

						const response = await request.get(baseUrl);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).not.toContain('Save and continue');
					});
				});
				describe('Case officer', () => {
					it('should render form', async () => {
						await request.get('/applications-service/case-officer');

						const response = await request.get(baseUrl);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('Save and continue');
					});
				});
				describe('Case admin officer', () => {
					it('should render form', async () => {
						await request.get('/applications-service/case-admin-officer');

						const response = await request.get(baseUrl);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('Save and continue');
					});
				});
			});
		});

		describe('GET /create-new-case/1', () => {
			const baseUrl = '/applications-service/create-new-case/1';

			beforeEach(async () => {
				await request.get('/applications-service/case-officer');
				nocks();
			});

			it('should render page with resumed data', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(fixtureApplications[0].description.slice(0, 20));
			})
		})

		describe('POST /create-new-case/:id', () => {
			const baseUrl = '/applications-service/create-new-case';

			beforeEach(async () => {
				await request.get('/applications-service/case-officer');
				nocks();
			});

			describe('Web-side validation:', () => {
				it('should show validation errors if something missing', async () => {
					const response = await request.post(baseUrl);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('title-error');
					expect(element.innerHTML).toContain('description-error');
				});
			})

			describe('Api-side validation:', () => {
				const failResponse = {errors: {title: 'Some error message from API', description: 'Same'}};

				describe('When creating new case', () => {
					it('should show validation errors if API returns error', async () => {

						nock('http://test/').post('/applications').reply(500, failResponse);

						const response = await request.post(baseUrl).send({
							title: 'A title',
							description: 'A description'
						});
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('title-error');
						expect(element.innerHTML).toContain('description-error');
					});

					it('should go to sector page if API does not returns error', async () => {

						nock('http://test/').post('/applications').reply(200, successResponse);

						const response = await request.post(baseUrl).send({
							title: 'A title',
							description: 'A description'
						});

						expect(response?.res?.headers?.location).toContain('1/sector');
					});
				})

				describe('When updating resumed case', () => {
					it('should show validation errors if API returns error', async () => {

						nock('http://test/').patch('/applications/1').reply(500, failResponse);

						const response = await request.post(`${baseUrl}/1`).send({
							title: 'A title',
							description: 'A description'
						});
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('title-error');
						expect(element.innerHTML).toContain('description-error');
					});

					it('should go to sector page if API does not returns error', async () => {

						nock('http://test/').patch('/applications/1').reply(200, successResponse);

						const response = await request.post(`${baseUrl}/1`).send({
							title: 'A title',
							description: 'A description'
						});

						expect(response?.res?.headers?.location).toContain('1/sector');
					});
				})
			})
		});
	});

	describe('Sector', () => {
		const baseUrl = (/** @type {string} */ id) => `/applications-service/create-new-case/${id}/sector`;

		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
			nocks();
		});

		describe('GET /create-new-case/:applicationId/sector', () => {
			describe('When applicationId is:', () => {
				describe('Provided', () => {
					it('should display an option as _checked_ if the API returns a resumed value', async () => {
						const response = await request.get(baseUrl('1'));
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('value="transport" checked');
					});

					it('should not display a _checked_ option if the API does NOT return a resumed value', async () => {
						const response = await request.get(baseUrl('4'));
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).not.toContain('checked');
					});
				});
				describe('Not provided', () => {
					it('should NOT render the page', async () => {
						nock('http://test/').get('/applications/sector').reply(200, fixtureSectors);

						const response = await request.get(baseUrl(''));
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).not.toContain('govuk-radios__item');
					});
				});
			});
		});

		describe('POST /create-new-case/:applicationId/sector', () => {

			describe('Web-side validation:', () => {
				it('should show validation error if nothing was selected', async () => {
					const response = await request.post(baseUrl('1')).send({sectorName: null});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('sectorName-error');
				});

				it('should go to subsector page if something was selected', async () => {
					const response = await request.post(baseUrl('1')).send({sectorName: 'transport'});

					expect(response?.res?.headers?.location).toContain('1/sub-sector');
				})
			});
		});
	});

	describe('Sub-sector', () => {
		const baseUrl = (/** @type {string} */ id) => `/applications-service/create-new-case/${id}/sub-sector`;

		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
			nocks();
		});

		describe('GET /create-new-case/:applicationId/sub-sector', () => {

			it('should redirect to sector page if the sectorName is null', async () => {
				const response = await request.get(baseUrl('4'));

				expect(response?.res?.headers?.location).toContain('4/sector');
			});

			it('should display an option as _checked_ if the API returns a resumed value', async () => {
				const response = await request.get(baseUrl('1'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('value="water" checked');
			});

			it('should not display a _checked_ option if the API does NOT return a resumed value', async () => {
				const response = await request.get(baseUrl('5'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('checked');
			});
		});

		describe('POST /create-new-case/:applicationId/sub-sector', () => {

			describe('Web-side validation:', () => {
				it('should show validation error if nothing was selected', async () => {
					const response = await request.post(baseUrl('1'));
					const element = parseHtml(response.text);


					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('subSectorName-error');
				});

			});

			describe('API-side validation:', () => {

				it('should show validation errors if API returns error', async () => {
					const failResponse = {errors: {subSectorName: 'Must be existing sub-sector'}}

					nock('http://test/').patch('/applications/1').reply(500, failResponse);

					const response = await request.post(baseUrl('1')).send({subSectorName: 'transport'});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('subSectorName-error');
				});

				it('should go to geographical info page nothing is missing', async () => {
					nock('http://test/').patch('/applications/1').reply(200, successResponse);

					const response = await request.post(baseUrl('1')).send({subSectorName: 'transport'});

					expect(response?.res?.headers?.location).toContain('1/geographical-information');
				})
			})
		});
	});

	describe('Geographical Information', () => {
		const baseUrl = (/** @type {string} */ id) => `/applications-service/create-new-case/${id}/geographical-information`;

		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
			nocks();
		});

		describe('GET /create-new-case/:applicationId/geographical-information', () => {
			it('should display resumed data if the API returns something', async () => {
				const response = await request.get(baseUrl(1));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('London');
			});
		});

		describe('POST /create-new-case/:applicationId/geographical-information', () => {
			describe('Web-side validation', () => {
				it('should not render validation error if nothgin missing', async () => {

					const response = await request.post(baseUrl(1)).send({
						'geographicalInformation.locationDescription': 'Location desc',
						'geographicalInformation.gridReference.easting': '123456',
						'geographicalInformation.gridReference.northing': '789123'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain('geographicalInformation.locationDescription-error');
					expect(element.innerHTML).not.toContain('geographicalInformation.gridReference.easting-error');
					expect(element.innerHTML).not.toContain('geographicalInformation.gridReference.northing-error');
				});

				it('should render validation error if something missing', async () => {

					const response = await request.post(baseUrl(1));
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('geographicalInformation.locationDescription-error');
					expect(element.innerHTML).toContain('geographicalInformation.gridReference.easting-error');
					expect(element.innerHTML).toContain('geographicalInformation.gridReference.northing-error');
				});

				it('should render validation error if easting and northing are not valid', async () => {

					const response = await request.post(baseUrl(1)).send({
						'geographicalInformation.gridReference.easting': 1234,
						'geographicalInformation.gridReference.northing': '123dfe'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('geographicalInformation.gridReference.easting-error');
					expect(element.innerHTML).toContain('geographicalInformation.gridReference.northing-error');
				});
			});

			describe('API-side validation:', () => {

				it('should show validation errors if API returns error', async () => {
					const failResponse = {errors: {
						'geographicalInformation.locationDescription': 'Error msg',
						'geographicalInformation.gridReference.easting': 'Error msg',
						'geographicalInformation.gridReference.northing': 'Error msg'
					}}

					nock('http://test/').patch('/applications/1').reply(500, failResponse);

					const response = await request.post(baseUrl(1)).send({
						'geographicalInformation.locationDescription': 'Location desc',
						'geographicalInformation.gridReference.easting': '123456',
						'geographicalInformation.gridReference.northing': '789123'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('geographicalInformation.locationDescription-error');
					expect(element.innerHTML).toContain('geographicalInformation.gridReference.easting-error');
					expect(element.innerHTML).toContain('geographicalInformation.gridReference.northing-error');
				});

				it('should go to regions page if nothing is missing', async () => {
					nock('http://test/').patch('/applications/1').reply(200, successResponse);

					const response = await request.post(baseUrl(1)).send({
						'geographicalInformation.locationDescription': 'Location desc',
						'geographicalInformation.gridReference.easting': '123456',
						'geographicalInformation.gridReference.northing': '789123'
					});

					expect(response?.res?.headers?.location).toContain('1/regions');
				})
			})
		});
	});

	/*



	describe('GET /create-new-case/:applicationId/regions', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
		});

		it('should render the page', async () => {
			nock('http://test/').get('/applications/region').reply(200, fixtureRegions);

			const baseUrl = `/applications-service/create-new-case/123/regions`;
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});
	});

	describe('GET /create-new-case/:applicationId/zoom-level', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
		});

		it('should render the page', async () => {
			nock('http://test/').get('/applications/zoom-level').reply(200, fixtureZoomLevels);

			const baseUrl = `/applications-service/create-new-case/123/zoom-level`;
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});
	});

	describe('GET /create-new-case/:applicationId/team-email', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-officer');
		});

		it('should render the page', async () => {
			const baseUrl = `/applications-service/create-new-case/123/team-email`;
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Save and continue');
		});
	});
	*/
})
;
