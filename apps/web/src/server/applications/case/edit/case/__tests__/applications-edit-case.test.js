import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../../testing/applications/fixtures/cases.js';
import {
	fixtureRegions,
	fixtureSectors,
	fixtureSubSectors,
	fixtureZoomLevels
} from '../../../../../../../testing/applications/fixtures/options-item.js';
import { createTestEnvironment } from '../../../../../../../testing/index.js';
import { installMockFeatureFlags } from '../../../../../../../testing/app/mocks/featureFlags';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications').reply(200, {});
	nock('http://test/').get('/applications/sector').reply(200, fixtureSectors);
	nock('http://test/')
		.get(/\/applications\/3(.*)/g)
		.reply(200, fixtureCases[3]);
	nock('http://test/')
		.get(/\/applications\/4(.*)/g)
		.reply(200, fixtureCases[4]);
	// welsh case
	nock('http://test/')
		.get(/\/applications\/7(.*)/g)
		.reply(200, fixtureCases[7]);
	nock('http://test/')
		.get('/applications/sector?sectorName=transport')
		.reply(200, fixtureSubSectors);
};

describe('applications edit', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	describe('Name', () => {
		const baseUrl = '/applications-service/case/3/edit/name';

		describe('GET /edit/name', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
				nocks();
			});

			it('should render form', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Save changes');
			});

			describe('When status is', () => {
				beforeEach(async () => {
					await request.get('/applications-service/');
					nocks();
				});

				describe('Non-draft:', () => {
					it('should render the page with resumed data', async () => {
						const response = await request.get(baseUrl);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain(fixtureCases[3].title.slice(0, 20));
					});
				});
				describe('Draft:', () => {
					it('should not render the page', async () => {
						const response = await request.get('/applications-service/case/1/edit/name');
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).not.toContain('Save changes');
					});
				});
			});
		});

		describe('GET edit/name-welsh', () => {
			const baseUrl = '/applications-service/case/7/edit/name-welsh';
			describe('When feature flag is NOT active', () => {
				beforeEach(async () => {
					// disable all feature flags
					installMockFeatureFlags(false);

					await request.get('/applications-service/');
					nocks();
				});

				it('should redirect to project info page', async () => {
					const response = await request.get(baseUrl);

					expect(response?.headers?.location).toEqual(
						'/applications-service/case/7/project-information'
					);
				});
			});

			describe('When feature flag is active', () => {
				beforeEach(async () => {
					// enable all feature flags
					installMockFeatureFlags(true);

					await request.get('/applications-service/');
					nocks();
				});

				it('should render page with english inset', async () => {
					const response = await request.get(baseUrl);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Name of the project in English');
					expect(element.innerHTML).toContain('Welsh');
				});
			});
		});

		describe('Description', () => {
			describe('GET edit/description', () => {
				const baseUrl = '/applications-service/case/3/edit/description';

				beforeEach(async () => {
					await request.get('/applications-service/');
					nocks();
				});

				it('should render page with resumed data', async () => {
					const response = await request.get(baseUrl);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain(fixtureCases[3].description.slice(0, 20));
				});
			});

			describe('GET edit/description-welsh', () => {
				const baseUrl = '/applications-service/case/7/edit/description-welsh';
				describe('When feature flag is NOT active', () => {
					beforeEach(async () => {
						// disable all feature flags
						installMockFeatureFlags(false);

						await request.get('/applications-service/');
						nocks();
					});

					it('should redirect to project info page', async () => {
						const response = await request.get(baseUrl);

						expect(response?.headers?.location).toEqual(
							'/applications-service/case/7/project-information'
						);
					});
				});

				describe('When feature flag is active', () => {
					beforeEach(async () => {
						// enable all feature flags
						installMockFeatureFlags(true);

						await request.get('/applications-service/');
						nocks();
					});

					it('should render page with english inset', async () => {
						const response = await request.get(baseUrl);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('Project description in English');
						expect(element.innerHTML).toContain('Welsh');
					});
				});
			});
		});

		describe('Project location', () => {
			const baseUrl = `/applications-service/case/3/edit/project-location`;

			beforeEach(async () => {
				await request.get('/applications-service/');
				nocks();
			});

			describe('GET /edit/:caseId/project-location', () => {
				it('should display resumed data if the API returns something', async () => {
					const response = await request.get(baseUrl);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('London');
				});
			});

			describe('GET edit/:caseId/project-location-welsh', () => {
				const baseUrl = '/applications-service/case/7/edit/project-location-welsh';
				describe('When feature flag is NOT active', () => {
					beforeEach(async () => {
						// disable all feature flags
						installMockFeatureFlags(false);

						await request.get('/applications-service/');
						nocks();
					});

					it('should redirect to project info page', async () => {
						const response = await request.get(baseUrl);

						expect(response?.headers?.location).toEqual(
							'/applications-service/case/7/project-information'
						);
					});
				});

				describe('When feature flag is active', () => {
					beforeEach(async () => {
						// enable all feature flags
						installMockFeatureFlags(true);

						await request.get('/applications-service/');
						nocks();
					});

					it('should render page with english inset', async () => {
						const response = await request.get(baseUrl);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('Project location in English');
						expect(element.innerHTML).toContain('Welsh');
					});
				});
			});
		});
	});

	describe('Grid references', () => {
		const baseUrl = `/applications-service/case/3/edit/grid-references`;

		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
		});

		describe('GET /edit/:caseId/project-location', () => {
			it('should display resumed data if the API returns something', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('123456');
			});
		});
	});

	describe('Regions', () => {
		// const baseUrl = ( /!** @type {string} *!/ id) => `/applications-service/create-new-case/${id}/regions`;
		const baseUrl = (/** @type {string} */ id) => `/applications-service/case/${id}/edit/regions`;

		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
			nock('http://test/').get('/applications/region').reply(200, fixtureRegions);
		});

		describe('GET /edit/regions', () => {
			it('should render the page with checked options if the api returns something', async () => {
				const response = await request.get(baseUrl('3'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('value="london"\n                    checked');
				expect(element.innerHTML).toContain('value="yorkshire"\n                    checked');
			});
		});
	});

	describe('Zoom Level', () => {
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/case/${id}/edit/zoom-level`;

		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
			nock('http://test/').get('/applications/zoom-level').reply(200, fixtureZoomLevels);
		});

		describe('GET edit/zoom-level', () => {
			it('should render the page with the checked option from the resumed data', async () => {
				const response = await request.get(baseUrl('3'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('value="city"\n                    checked');
			});
		});
	});

	describe('Team email', () => {
		const baseUrl = (/** @type {string} */ id) =>
			`/applications-service/case/${id}/edit/team-email`;

		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
			nock('http://test/').get('/applications/zoom-level').reply(200, fixtureZoomLevels);
		});

		describe('GET /edit/team-email', () => {
			it('should render the page with the resumed data if the api returns something', async () => {
				const response = await request.get(baseUrl('3'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('some@ema.il');
			});

			it('should render the page with no value inside the text input if api does not return resumed data', async () => {
				const response = await request.get(baseUrl('4'));
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain("value='");
			});
		});
	});
});
