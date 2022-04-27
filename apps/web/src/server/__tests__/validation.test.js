import { parseHtml } from '@pins/platform/testing';
import nock from 'nock';
import path from 'path';
import supertest from 'supertest';
import url from 'url';
import { localPlanningDepartments } from '../testing/fixtures/referencedata.js';
import {
	incompleteAppealDetails,
	incompleteAppealSummary,
	receivedAppealDetails,
	receivedAppealSummary
} from '../testing/fixtures/validation.js';
import { createTestApplication } from '../testing/index.js';

/** @typedef {import('@pins/appeals').Address} Address */
/** @typedef {import('../app/validation/validation.controller').AppealOutcomeBody} AppealOutcomeBody */
/** @typedef {import('../app/validation/validation.service').ValidAppealData} ValidAppealData */
/** @typedef {import('../app/validation/validation.pipes').UnparsedInvalidOutcomeBody} InvalidOutcomeBody */
/** @typedef {import('../app/validation/validation.pipes').UnparsedIncompleteOutcomeBody} IncompleteOutcomeBody */
/** @typedef {import('../app/validation/validation.controller').UpdateAppellantNameBody} UpdateAppellantNameBody */
/** @typedef {import('../app/validation/validation.controller').UpdatePlanningApplicationRefBody} UpdatePlanningApplicationRefBody */
/** @typedef {import('../app/validation/validation.controller').UpdateLocalPlanningDeptBody} UpdateLocalPlanningDeptBody */

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const { app, teardown } = createTestApplication();
const request = supertest(app);

describe('validation', () => {
	afterEach(teardown);

	describe('GET /validation', () => {
		it('should render a placeholder for empty appeals', async () => {
			nock('http://test/').get('/validation').reply(200, []);

			const response = await request.get('/validation');
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render new and incomplete appeals', async () => {
			nock('http://test/')
				.get('/validation')
				.reply(200, [incompleteAppealSummary, receivedAppealSummary]);

			const response = await request.get('/validation');
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should handle an asynchronous error during the request', async () => {
			nock('http://test/').get('/validation').reply(500);

			const response = await request.get('/validation');
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with the service'
			);
		});
	});

	describe('GET /validation/appeals/:appealId', () => {
		it('should render an appeal in a received state', async () => {
			nock('http://test/')
				.get(`/validation/${receivedAppealDetails.AppealId}`)
				.reply(200, receivedAppealDetails);

			const response = await request.get(
				`/validation/appeals/${receivedAppealDetails.AppealId}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render an appeal in an incomplete state', async () => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);

			const response = await request.get(
				`/validation/appeals/${incompleteAppealDetails.AppealId}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render an appeal in an incomplete state with the option to change the outcome', async () => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);

			const response = await request.get(
				`/validation/appeals/${incompleteAppealDetails.AppealId}?edit=true`
			);
			const element = parseHtml(response.text);

			expect(element.querySelector('form')?.innerHTML).toMatchSnapshot();
		});

		it('should handle an asynchronous error during the request', async () => {
			nock('http://test/').get(`/validation/${receivedAppealDetails.AppealId}`).reply(500);

			const response = await request.get('/validation');
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with the service'
			);
		});
	});

	describe('GET /validation/appeals/:appealId/documents/:documentType', () => {
		beforeEach(() => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);
		});

		it('should render a page for uploading appeal letters', async () => {
			const response = await request.get(
				`/validation/appeals/${incompleteAppealDetails.AppealId}/documents/appeal-letter`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a page for uploading a decision letter', async () => {
			const response = await request.get(
				`/validation/appeals/${incompleteAppealDetails.AppealId}/documents/decision-letter`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a page for uploading the planning application form', async () => {
			const response = await request.get(
				`/validation/appeals/${incompleteAppealDetails.AppealId}/documents/planning-application-form`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a page for uploading supporting documents', async () => {
			const response = await request.get(
				`/validation/appeals/${incompleteAppealDetails.AppealId}/documents/supporting-document`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal when trying to add documents to a new appeal', async () => {
			nock('http://test/')
				.get(`/validation/${receivedAppealDetails.AppealId}`)
				.reply(200, receivedAppealDetails);

			const response = await request
				.get(
					`/validation/appeals/${receivedAppealDetails.AppealId}/documents/planning-application-form`
				)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review appeal submission');
		});

		it('should handle an asynchronous error during the request', async () => {
			nock.cleanAll();
			nock('http://test/').get(`/validation/${incompleteAppealDetails.AppealId}`).reply(500);

			const response = await request.post(
				`/validation/appeals/${receivedAppealDetails.AppealId}`
			);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with the service'
			);
		});
	});

	describe('POST /validation/appeals/:appealId/documents/:documentType', () => {
		beforeEach(() => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);
		});

		it('should validate that a file is chosen', async () => {
			const response = await request.post(
				`/validation/appeals/${incompleteAppealDetails.AppealId}/documents/supporting-document`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate that a file is not in excess of 15mb', async () => {
			const response = await request
				.post(
					`/validation/appeals/${incompleteAppealDetails.AppealId}/documents/supporting-document`
				)
				.attach('files', path.join(__dirname, '../testing/assets/anthropods.pdf'));
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect back to the appeal after a mock upload', async () => {
			const response = await request
				.post(
					`/validation/appeals/${incompleteAppealDetails.AppealId}/documents/supporting-document`
				)
				.attach('files', path.join(__dirname, '../testing/assets/simple.pdf'))
				.redirects(1);

			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Update incomplete appeal');
		});
	});

	describe('GET /validation/appeals/:appealId/appeal-site', () => {
		it('should render a page for editing the appeal site', async () => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);

			const response = await request
				.get(`/validation/appeals/${incompleteAppealDetails.AppealId}/appeal-site`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal when trying to edit the appeal site for a new appeal', async () => {
			nock('http://test/')
				.get(`/validation/${receivedAppealDetails.AppealId}`)
				.reply(200, receivedAppealDetails);

			const response = await request
				.get(`/validation/appeals/${receivedAppealDetails.AppealId}/appeal-site`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review appeal submission');
		});
	});

	describe('POST /validation/appeals/:appealId/appeal-site', () => {
		beforeEach(() => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);
		});

		it('should validate that the required fields are present', async () => {
			const response = await request
				.post(`/validation/appeals/${incompleteAppealDetails.AppealId}/appeal-site`)
				.send(
					/** @type {Address} */ ({
						AddressLine1: ' ',
						Town: ' ',
						PostCode: ''
					})
				);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate that the postcode is in a valid format', async () => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);

			const response = await request
				.post(`/validation/appeals/${incompleteAppealDetails.AppealId}/appeal-site`)
				.send(
					/** @type {Address} */ ({
						AddressLine1: '*',
						Town: '*',
						PostCode: '123456'
					})
				);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should update the address site and return to the appeal page', async () => {
			const address = {
				AddressLine1: 'The Spitfire Building',
				AddressLine2: '71 Collier Street',
				Town: 'London',
				County: 'Greater London',
				PostCode: 'N1 9BE'
			};

			nock('http://test/')
				.patch(`/validation/${incompleteAppealDetails.AppealId}`, { Address: address })
				.reply(200, incompleteAppealDetails);

			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, { ...incompleteAppealDetails, AppealSite: address });

			const response = await request
				.post(`/validation/appeals/${incompleteAppealDetails.AppealId}/appeal-site`)
				.send(/** @type {Address} */ address)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('.appealSite')?.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /validation/appeals/:appealId/appellant-name', () => {
		it('should render a page for editing the appellant name', async () => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);

			const response = await request
				.get(`/validation/appeals/${incompleteAppealDetails.AppealId}/appellant-name`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal when trying to edit the appellant name for a new appeal', async () => {
			nock('http://test/')
				.get(`/validation/${receivedAppealDetails.AppealId}`)
				.reply(200, receivedAppealDetails);

			const response = await request
				.get(`/validation/appeals/${receivedAppealDetails.AppealId}/appellant-name`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review appeal submission');
		});
	});

	describe('POST /validation/appeals/:appealId/appellant-name', () => {
		beforeEach(() => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);
		});

		it('should validate that an appellant name is provided', async () => {
			const response = await request
				.post(`/validation/appeals/${incompleteAppealDetails.AppealId}/appellant-name`)
				.send(/** @type {UpdateAppellantNameBody} */ ({ AppellantName: ' ' }));
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should update the appellant name and return to the appeal page', async () => {
			const appellant = { AppellantName: 'Jimini Cricket' };

			nock('http://test/')
				.patch(`/validation/${incompleteAppealDetails.AppealId}`, appellant)
				.reply(200, incompleteAppealDetails);

			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, { ...incompleteAppealDetails, ...appellant });

			const response = await request
				.post(`/validation/appeals/${incompleteAppealDetails.AppealId}/appellant-name`)
				.send(/** @type {UpdateAppellantNameBody} */ (appellant))
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('.appellantName')?.innerHTML).toEqual('Jimini Cricket');
		});
	});

	describe('GET /validation/appeals/:appealId/planning-application-reference', () => {
		it('should render a page for editing the planning application reference', async () => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);

			const response = await request
				.get(
					`/validation/appeals/${incompleteAppealDetails.AppealId}/planning-application-reference`
				)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal when trying to edit the planning application reference for a new appeal', async () => {
			nock('http://test/')
				.get(`/validation/${receivedAppealDetails.AppealId}`)
				.reply(200, receivedAppealDetails);

			const response = await request
				.get(
					`/validation/appeals/${receivedAppealDetails.AppealId}/planning-application-reference`
				)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review appeal submission');
		});
	});

	describe('POST /validation/appeals/:appealId/planning-application-reference', () => {
		beforeEach(() => {
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);
		});

		it('should validate that a planning application reference is provided', async () => {
			const response = await request
				.post(
					`/validation/appeals/${incompleteAppealDetails.AppealId}/planning-application-reference`
				)
				.send(
					/** @type {UpdatePlanningApplicationRefBody} */ ({
						PlanningApplicationReference: ' '
					})
				);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should update the planning application reference and return to the appeal page', async () => {
			const details = { PlanningApplicationReference: '*' };

			nock('http://test/')
				.patch(`/validation/${incompleteAppealDetails.AppealId}`, details)
				.reply(200, incompleteAppealDetails);

			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, { ...incompleteAppealDetails, ...details });

			const response = await request
				.post(
					`/validation/appeals/${incompleteAppealDetails.AppealId}/planning-application-reference`
				)
				.send(/** @type {UpdatePlanningApplicationRefBody} */ (details))
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('.planningApplicationReference')?.innerHTML).toEqual('*');
		});
	});

	describe('GET /validation/appeals/:appealId/local-planning-department', () => {
		it('should render a page for editing the local planning department', async () => {
			nock('http://test/').get('/validation/lpa-list').reply(200, localPlanningDepartments);
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);

			const response = await request
				.get(
					`/validation/appeals/${incompleteAppealDetails.AppealId}/local-planning-department`
				)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal when trying to edit the local planning department for a new appeal', async () => {
			nock('http://test/')
				.get(`/validation/${receivedAppealDetails.AppealId}`)
				.reply(200, receivedAppealDetails);

			const response = await request
				.get(
					`/validation/appeals/${receivedAppealDetails.AppealId}/local-planning-department`
				)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review appeal submission');
		});
	});

	describe('POST /validation/appeals/:appealId/local-planning-department', () => {
		beforeEach(() => {
			nock('http://test/').get('/validation/lpa-list').reply(200, localPlanningDepartments);
			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, incompleteAppealDetails);
		});

		it('should validate that a local planning department is chosen', async () => {
			const response = await request
				.post(
					`/validation/appeals/${incompleteAppealDetails.AppealId}/local-planning-department`
				)
				.send(
					/** @type {UpdateLocalPlanningDeptBody} */ ({ LocalPlanningDepartment: ' ' })
				);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should update the local planning department and return to the appeal page', async () => {
			const details = { LocalPlanningDepartment: 'Bristol City Council' };

			nock('http://test/')
				.patch(`/validation/${incompleteAppealDetails.AppealId}`, details)
				.reply(200, incompleteAppealDetails);

			nock('http://test/')
				.get(`/validation/${incompleteAppealDetails.AppealId}`)
				.reply(200, { ...incompleteAppealDetails, ...details });

			const response = await request
				.post(
					`/validation/appeals/${incompleteAppealDetails.AppealId}/local-planning-department`
				)
				.send(/** @type {UpdateLocalPlanningDeptBody} */ (details))
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('.localPlanningDepartment')?.innerHTML).toEqual(
				'Bristol City Council'
			);
		});
	});

	describe('POST /validation/appeals/:appealId', () => {
		describe('received appeal', () => {
			beforeEach(() => {
				nock('http://test/')
					.get(`/validation/${receivedAppealDetails.AppealId}`)
					.reply(200, receivedAppealDetails);
			});

			it('should handle a valid review outcome', async () => {
				const response = await request
					.post(`/validation/appeals/${receivedAppealDetails.AppealId}`)
					.send(/** @type {AppealOutcomeBody} */ ({ status: 'valid' }))
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});

			it('should handle an invalid review outcome', async () => {
				const response = await request
					.post(`/validation/appeals/${receivedAppealDetails.AppealId}`)
					.send(/** @type {AppealOutcomeBody} */ ({ status: 'invalid' }))
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});

			it('should handle an incomplete review outcome', async () => {
				const response = await request
					.post(`/validation/appeals/${receivedAppealDetails.AppealId}`)
					.send(/** @type {AppealOutcomeBody} */ ({ status: 'incomplete' }))
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});

			it('should handle an incomplete review outcome', async () => {
				const response = await request.post(
					`/validation/appeals/${receivedAppealDetails.AppealId}`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});

			it('should handle an asynchronous error during the request', async () => {
				nock.cleanAll();
				nock('http://test/')
					.get(`/validation/${receivedAppealDetails.AppealId}`)
					.reply(500);

				const response = await request.post(
					`/validation/appeals/${receivedAppealDetails.AppealId}`
				);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual(
					'Sorry, there is a problem with the service'
				);
			});
		});
	});

	describe('GET /validation/appeals/:appealId/review-outcome', () => {
		describe('received appeal', () => {
			beforeEach(() => {
				nock('http://test/')
					.get(`/validation/${receivedAppealDetails.AppealId}`)
					.reply(200, receivedAppealDetails);
			});

			it('should redirect when there is no review outcome in the session', async () => {
				const response = await request
					.get(`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`)
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.outerHTML).toMatchSnapshot();
			});

			it('should render a valid review outcome page', async () => {
				await installReviewOutcomeStatus({ status: 'valid' });

				const response = await request.get(
					`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});

			it('should render an invalid review outcome page', async () => {
				await installReviewOutcomeStatus({ status: 'invalid' });

				const response = await request.get(
					`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});

			it('should render an incomplete review outcome page', async () => {
				await installReviewOutcomeStatus({ status: 'incomplete' });

				const response = await request.get(
					`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});

			it('should handle an asynchronous error during the request', async () => {
				nock.cleanAll();
				nock('http://test/')
					.get(`/validation/${receivedAppealDetails.AppealId}`)
					.reply(500);

				const response = await request.get(
					`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
				);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual(
					'Sorry, there is a problem with the service'
				);
			});
		});
	});

	describe('POST /validation/appeals/:appealId/review-outcome', () => {
		describe('received appeal', () => {
			beforeEach(() => {
				nock('http://test/')
					.get(`/validation/${receivedAppealDetails.AppealId}`)
					.reply(200, receivedAppealDetails);
			});

			it('should redirect the user if the appeal was completed elsewhere', async () => {
				nock('http://test/')
					.get(`/validation/${receivedAppealDetails.AppealId}`)
					.reply(409);

				const response = await request
					.post(`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`)
					.send(
						/** @type {ValidAppealData} */ ({
							status: 'valid',
							descriptionOfDevelopment: '*'
						})
					)
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual('Appeal already reviewed');
			});

			describe('valid outcome', () => {
				beforeEach(async () => {
					await installReviewOutcomeStatus({ status: 'valid' });
				});

				it('should validate that a description of development is provided', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {ValidAppealData} */ ({
								status: 'valid',
								descriptionOfDevelopment: ' '
							})
						);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});

				it('should display a confirmation page upon valid submission', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {ValidAppealData} */ ({
								status: 'valid',
								descriptionOfDevelopment: '*'
							})
						)
						.redirects(1);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});
			});

			describe('invalid outcome', () => {
				beforeEach(async () => {
					await installReviewOutcomeStatus({ status: 'invalid' });
				});

				it('should validate that at least one reason is chosen', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {InvalidOutcomeBody} */ ({
								status: 'invalid',
								otherReasons: ''
							})
						);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});

				it('should validate that the reason text is provided', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {InvalidOutcomeBody} */ ({
								status: 'invalid',
								reasons: ['otherReasons'],
								otherReasons: ' '
							})
						);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});

				it('should display a confirmation page upon valid submission', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {InvalidOutcomeBody} */ ({
								status: 'invalid',
								reasons: ['noRightOfAppeal', 'otherReasons']
							})
						)
						.redirects(1);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});
			});

			describe('incomplete outcome', () => {
				beforeEach(async () => {
					await installReviewOutcomeStatus({ status: 'incomplete' });
				});

				it('should validate that at least one reason is chosen', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {IncompleteOutcomeBody} */ ({
								status: 'incomplete',
								otherReasons: ''
							})
						);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});

				it('should validate that the reason text is provided', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {IncompleteOutcomeBody} */ ({
								status: 'incomplete',
								reasons: ['otherReasons'],
								otherReasons: ' '
							})
						);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});

				it('should validate that a missing document is provided', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {IncompleteOutcomeBody} */ ({
								status: 'incomplete',
								reasons: ['missingDocuments'],
								otherReasons: ''
							})
						);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});

				it('should display a confirmation page upon valid submission', async () => {
					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`
						)
						.send(
							/** @type {IncompleteOutcomeBody} */ ({
								status: 'incomplete',
								reasons: ['missingDocuments'],
								documentReasons: ['missingDecisionNotice']
							})
						)
						.redirects(1);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});
			});
		});
	});

	describe('POST /validation/appeals/:appealId/review-outcome/confirm', () => {
		describe('received appeal', () => {
			beforeEach(() => {
				nock('http://test/')
					.get(`/validation/${receivedAppealDetails.AppealId}`)
					.reply(200, receivedAppealDetails);
			});

			it('should redirect when there is no review outcome in the session', async () => {
				const response = await request
					.post(
						`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome/confirm`
					)
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual('Review appeal submission');
			});

			it('should redirect the user if the appeal was completed elsewhere', async () => {
				nock.cleanAll();
				nock('http://test/')
					.get(`/validation/${receivedAppealDetails.AppealId}`)
					.reply(409);

				const response = await request
					.post(
						`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome/confirm`
					)
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual('Appeal already reviewed');
			});

			describe('valid outcome', () => {
				beforeEach(async () => {
					await installReviewOutcome(
						/** @type {ValidAppealData} */ ({
							status: 'valid',
							descriptionOfDevelopment: '*'
						})
					);
				});

				it('should confirm the outcome with a success panel', async () => {
					nock('http://test/')
						.post(`/validation/${receivedAppealDetails.AppealId}`, {
							AppealStatus: 'valid',
							descriptionOfDevelopment: '*'
						})
						.reply(200);

					const response = await request.post(
						`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome/confirm`
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});
			});

			describe('invalid outcome', () => {
				beforeEach(async () => {
					await installReviewOutcome(
						/** @type {InvalidOutcomeBody} */ ({
							status: 'invalid',
							reasons: ['otherReasons', 'outOfTime'],
							otherReasons: '*'
						})
					);
				});

				it('should confirm the outcome with a success panel', async () => {
					nock('http://test/')
						.post(`/validation/${receivedAppealDetails.AppealId}`, {
							AppealStatus: 'invalid',
							Reason: {
								outOfTime: true,
								otherReasons: '*'
							}
						})
						.reply(200);

					const response = await request.post(
						`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome/confirm`
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});
			});

			describe('incomplete outcome', () => {
				beforeEach(async () => {
					await installReviewOutcome(
						/** @type {IncompleteOutcomeBody} */ ({
							status: 'incomplete',
							reasons: ['inflammatoryComments', 'missingDocuments', 'otherReasons'],
							documentReasons: ['missingGroundsForAppeal'],
							otherReasons: '*'
						})
					);
				});

				it('should validate that the confirmation checkbox was checked', async () => {
					const response = await request.post(
						`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome/confirm`
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});

				it('should confirm the outcome with a success panel', async () => {
					nock('http://test/')
						.post(`/validation/${receivedAppealDetails.AppealId}`, {
							AppealStatus: 'incomplete',
							Reason: {
								inflammatoryComments: true,
								missingGroundsForAppeal: true,
								otherReasons: '*'
							}
						})
						.reply(200);

					const response = await request
						.post(
							`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome/confirm`
						)
						.send({ confirmation: 'true' });
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});
			});
		});
	});
});

/**
 * @param {AppealOutcomeBody} body
 * @returns {Promise<import('supertest').Response>}
 */
function installReviewOutcomeStatus(body) {
	return request.post(`/validation/appeals/${receivedAppealDetails.AppealId}`).send(body);
}

/**
 * @param {ValidAppealData | InvalidOutcomeBody | IncompleteOutcomeBody} body
 * @returns {Promise<import('supertest').Response>}
 */
function installReviewOutcome(body) {
	return request
		.post(`/validation/appeals/${receivedAppealDetails.AppealId}/review-outcome`)
		.send(body);
}
