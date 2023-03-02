import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';
import {
	fixtureRegions,
	fixtureSectors,
	fixtureSubSectors,
	fixtureZoomLevels
} from '../../../../../../testing/applications/fixtures/options-item.js';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const successResponse = { id: 1, applicantIds: [1] };

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, {});
	nock('http://test/').get('/applications/sector').reply(200, fixtureSectors);
	nock('http://test/')
		.get(/\/applications\/1(.*)/g)
		.times(2)
		.reply(200, fixtureCases[0]);

	nock('http://test/')
		.get(/\/applications\/2(.*)/g)
		.reply(200, fixtureCases[1]);

	nock('http://test/')
		.get(/\/applications\/3(.*)/g)
		.reply(200, fixtureCases[2]);

	nock('http://test/')
		.get(/\/applications\/4(.*)/g)
		.reply(200, fixtureCases[3]);

	nock('http://test/')
		.get('/applications/sector?sectorName=transport')
		.reply(200, fixtureSubSectors);
};

describe('applications create', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

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
				describe('Case team', () => {
					it('should render form', async () => {
						await request.get('/applications-service/case-team');

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
				await request.get('/applications-service/case-team');
				nocks();
			});

			it('should render page with resumed data', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(fixtureCases[0].description.slice(0, 20));
			});

			it('should not render the page when case is not Draft', async () => {
				const response = await request.get('/applications-service/create-new-case/4');
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('Save and continue');
			});
		});

		describe('POST /create-new-case/:id', () => {
			const baseUrl = '/applications-service/create-new-case';

			beforeEach(async () => {
				await request.get('/applications-service/case-team');
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
			});

			describe('Api-side validation:', () => {
				const failResponse = {
					errors: { title: 'Some error message from API', description: 'Same' }
				};

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

						expect(response?.headers?.location).toContain('1/sector');
					});
				});

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

						expect(response?.headers?.location).toContain('1/sector');
					});
				});
			});
		});
	});

	describe('Sector', () => {
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/create-new-case/${id}/sector`;

		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		describe('GET /create-new-case/:caseId/sector', () => {
			describe('When caseId is:', () => {
				describe('Provided', () => {
					it('should display an option as _checked_ if the API returns a resumed value', async () => {
						const response = await request.get(baseUrl('1'));
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('value="transport" checked');
					});

					it('should not display a _checked_ option if the API does NOT return a resumed value', async () => {
						const response = await request.get(baseUrl('3'));
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).not.toContain('checked');
					});
				});
			});
		});

		describe('POST /create-new-case/:caseId/sector', () => {
			describe('Web-side validation:', () => {
				it('should show validation error if nothing was selected', async () => {
					const response = await request.post(baseUrl('1')).send({ sectorName: null });
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('sectorName-error');
				});

				it('should go to subsector page if something was selected', async () => {
					const response = await request.post(baseUrl('1')).send({ sectorName: 'transport' });

					expect(response?.headers?.location).toContain('1/sub-sector');
				});
			});
		});
	});

	describe('Sub-sector', () => {
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/create-new-case/${id}/sub-sector`;

		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		describe('GET /create-new-case/:caseId/sub-sector', () => {
			it('should redirect to sector page if the sectorName is null', async () => {
				const response = await request.get(baseUrl('3'));

				expect(response?.headers?.location).toContain('3/sector');
			});

			it('should render subsectors matching with the sectorName in the session', async () => {
				await request
					.post('/applications-service/create-new-case/1/sector')
					.send({ sectorName: 'transport' });

				const response = await request.get(baseUrl('1'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('highways');
			});

			it('should display an option as _checked_ if the API returns a resumed value', async () => {
				const response = await request.get(baseUrl('1'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('value="highways" checked');
			});

			it('should not display a _checked_ option if the API does NOT return a resumed value', async () => {
				const response = await request.get(baseUrl('2'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('checked');
			});
		});

		describe('POST /create-new-case/:caseId/sub-sector', () => {
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
					const failResponse = { errors: { subSectorName: 'Must be existing sub-sector' } };

					nock('http://test/').patch('/applications/1').reply(500, failResponse);

					const response = await request.post(baseUrl('1')).send({ subSectorName: 'transport' });
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('subSectorName-error');
				});

				it('should go to geographical info page nothing is missing', async () => {
					nock('http://test/').patch('/applications/1').reply(200, successResponse);

					const response = await request.post(baseUrl('1')).send({ subSectorName: 'transport' });

					expect(response?.headers?.location).toContain('1/geographical-information');
				});
			});
		});
	});

	describe('Geographical Information', () => {
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/create-new-case/${id}/geographical-information`;

		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		describe('GET /create-new-case/:caseId/geographical-information', () => {
			it('should display resumed data if the API returns something', async () => {
				const response = await request.get(baseUrl('1'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('London');
			});
		});

		describe('POST /create-new-case/:caseId/geographical-information', () => {
			describe('Web-side validation', () => {
				it('should not render validation error if nothing missing', async () => {
					const response = await request.post(baseUrl('1')).send({
						'geographicalInformation.locationDescription': 'Location desc',
						'geographicalInformation.gridReference.easting': '123456',
						'geographicalInformation.gridReference.northing': '789123'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain(
						'geographicalInformation.locationDescription-error'
					);
					expect(element.innerHTML).not.toContain(
						'geographicalInformation.gridReference.easting-error'
					);
					expect(element.innerHTML).not.toContain(
						'geographicalInformation.gridReference.northing-error'
					);
				});

				it('should render validation error if something missing', async () => {
					const response = await request.post(baseUrl('1'));
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('geographicalInformation.locationDescription-error');
					expect(element.innerHTML).toContain(
						'geographicalInformation.gridReference.easting-error'
					);
					expect(element.innerHTML).toContain(
						'geographicalInformation.gridReference.northing-error'
					);
				});

				it('should render validation error if easting and northing are not valid', async () => {
					const response = await request.post(baseUrl('1')).send({
						'geographicalInformation.gridReference.easting': 1234,
						'geographicalInformation.gridReference.northing': '123dfe'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain(
						'geographicalInformation.gridReference.easting-error'
					);
					expect(element.innerHTML).toContain(
						'geographicalInformation.gridReference.northing-error'
					);
				});
			});

			describe('API-side validation:', () => {
				it('should show validation errors if API returns error', async () => {
					const failResponse = {
						errors: {
							'geographicalInformation.locationDescription': 'Error msg',
							'geographicalInformation.gridReference.easting': 'Error msg',
							'geographicalInformation.gridReference.northing': 'Error msg'
						}
					};

					nock('http://test/').patch('/applications/1').reply(500, failResponse);

					const response = await request.post(baseUrl('1')).send({
						'geographicalInformation.locationDescription': 'Location desc',
						'geographicalInformation.gridReference.easting': '123456',
						'geographicalInformation.gridReference.northing': '789123'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('geographicalInformation.locationDescription-error');
					expect(element.innerHTML).toContain(
						'geographicalInformation.gridReference.easting-error'
					);
					expect(element.innerHTML).toContain(
						'geographicalInformation.gridReference.northing-error'
					);
				});

				it('should go to regions page if nothing is missing', async () => {
					nock('http://test/').patch('/applications/1').reply(200, successResponse);

					const response = await request.post(baseUrl('1')).send({
						'geographicalInformation.locationDescription': 'Location desc',
						'geographicalInformation.gridReference.easting': '123456',
						'geographicalInformation.gridReference.northing': '789123'
					});

					expect(response?.headers?.location).toContain('1/regions');
				});
			});
		});
	});

	describe('Regions', () => {
		// const baseUrl = ( /** @type {string} */ id) => `/applications-service/create-new-case/${id}/regions`;
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/create-new-case/${id}/regions`;

		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
			nock('http://test/').get('/applications/region').reply(200, fixtureRegions);
		});

		describe('GET /create-new-case/:caseId/regions', () => {
			it('should render the page with checked options if the api returns something', async () => {
				const response = await request.get(baseUrl('1'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('value="london"\n                    checked');
				expect(element.innerHTML).toContain('value="yorkshire"\n                    checked');
			});

			it('should render the page without checked options', async () => {
				const response = await request.get(baseUrl('2'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('checked');
			});
		});

		describe('POST /create-new-case/:caseId/regions', () => {
			describe('Web-validation', () => {
				it('should not render validation error if nothing missing', async () => {
					const responseWithOneRegion = await request.post(baseUrl('1')).send({
						'geographicalInformation.regionNames': ['london']
					});

					let element = parseHtml(responseWithOneRegion.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain('geographicalInformation.regionNames-error');

					const responseWithTwoRegions = await request.post(baseUrl('1')).send({
						'geographicalInformation.regionNames': ['london', 'yorkshire']
					});

					element = parseHtml(responseWithTwoRegions.text);

					expect(element.innerHTML).not.toContain('geographicalInformation.regionNames-error');
				});

				it('should render validation error if something missing', async () => {
					const response = await request.post(baseUrl('1'));
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('geographicalInformation.regionNames-error');
				});
			});

			describe('Api validation', () => {
				it('should show validation errors if API returns error', async () => {
					const failResponse = { errors: { 'geographicalInformation.regionNames': 'Error msg' } };

					nock('http://test/').patch('/applications/1').reply(500, failResponse);

					const response = await request.post(baseUrl('1')).send({
						'geographicalInformation.regionNames': ['london']
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('geographicalInformation.regionNames-error');
				});

				it('should go to zoom level page if api returns 200', async () => {
					nock('http://test/').patch('/applications/1').reply(200, successResponse);

					const response = await request.post(baseUrl('1')).send({
						'geographicalInformation.regionNames': ['london']
					});

					expect(response?.headers?.location).toContain('1/zoom-level');
				});
			});
		});
	});

	describe('Zoom Level', () => {
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/create-new-case/${id}/zoom-level`;

		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
			nock('http://test/').get('/applications/zoom-level').reply(200, fixtureZoomLevels);
		});

		describe('GET /create-new-case/:caseId/zoom-level', () => {
			it('should render the page with None checked if the api does not return resumed data', async () => {
				const response = await request.get(baseUrl('2'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('value="none"\n                    checked');
			});

			it('should render the page with the checked option from the resumed data', async () => {
				const response = await request.get(baseUrl('1'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('value="city"\n                    checked');
			});
		});

		describe('POST /create-new-case/:caseId/zoom-level', () => {
			describe('Api validation', () => {
				it('should show validation errors if API returns error', async () => {
					const failResponse = {
						errors: { 'geographicalInformation.mapZoomLevelName': 'Error msg' }
					};

					nock('http://test/').patch('/applications/1').reply(500, failResponse);

					const response = await request.post(baseUrl('1')).send({
						'geographicalInformation.mapZoomLevelName': 'something wrong'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('geographicalInformation.mapZoomLevelName-error');
				});

				it('should go to zoom level page if api returns 200', async () => {
					nock('http://test/').patch('/applications/1').reply(200, successResponse);

					const response = await request.post(baseUrl('1')).send({
						'geographicalInformation.regionNames': ['london']
					});

					expect(response?.headers?.location).toContain('1/team-email');
				});
			});
		});
	});

	describe('Team email', () => {
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/create-new-case/${id}/team-email`;

		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
			nock('http://test/').get('/applications/zoom-level').reply(200, fixtureZoomLevels);
		});

		describe('GET /create-new-case/:caseId/team-email', () => {
			it('should render the page with the resumed data if the api returns something', async () => {
				const response = await request.get(baseUrl('1'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('some@ema.il');
			});

			it('should render the page with no value inside the text input if api does not return resumed data', async () => {
				const response = await request.get(baseUrl('2'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain("value='");
			});
		});

		describe('POST /create-new-case/:caseId/team-email', () => {
			describe('Web-validation', () => {
				it('should not render validation error if nothing missing', async () => {
					const response = await request.post(baseUrl('1')).send({
						caseEmail: 'valid@ema.il'
					});

					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain('caseEmail-error');
				});

				it('should render validation error if email is not valid', async () => {
					const response = await request.post(baseUrl('1')).send({ caseEmail: 'notvalidemail' });
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('caseEmail-error');
				});
			});

			describe('Api validation', () => {
				it('should show validation errors if API returns error', async () => {
					const failResponse = { errors: { caseEmail: 'Error msg' } };

					nock('http://test/').patch('/applications/1').reply(500, failResponse);

					const response = await request.post(baseUrl('1')).send({
						caseEmail: 'valid@ema.il'
					});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('caseEmail-error');
				});

				it('should go to applicant organisation name page if api returns 200', async () => {
					nock('http://test/').patch('/applications/1').reply(200, successResponse);

					const response = await request.post(baseUrl('1')).send({
						caseEmail: 'valid@ema.il'
					});

					expect(response?.headers?.location).toContain(
						'/applications-service/create-new-case/1/applicant-organisation-name'
					);
				});
			});
		});
	});
});
