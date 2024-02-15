import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { appealData } from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';

describe('appeal-details', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /:appealId', () => {
		it('should render the received appeal details for a valid appealId with multiple linked/other appeals', async () => {
			const appealId = appealData.appealId.toString();

			nock('http://test/').get(`/appeals/${appealId}`).reply(200, undefined);

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the header with navigation containing links to the personal list, national list, and sign out route, without any active modifier classes', async () => {
			const appealId = appealData.appealId.toString();

			nock('http://test/').get(`/appeals/${appealId}`).reply(200, undefined);

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text, { rootElement: 'header' });

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the received appeal details for a valid appealId with single linked/other appeals', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, {
					...appealData,
					appealId,
					linkedAppeals: [
						{
							appealId: 1,
							appealReference: 'APP/Q9999/D/21/725284'
						}
					],
					otherAppeals: [
						{
							appealId: 3,
							appealReference: 'APP/Q9999/D/21/765413'
						}
					]
				});

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the received appeal details for a valid appealId with no linked/other appeals', async () => {
			const appealId = '3';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, {
					...appealData,
					appealId,
					linkedAppeals: [],
					otherAppeals: []
				});

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the received appeal details for a valid appealId without start date', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, { ...appealData, startedAt: null });

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a page not found when the appealId is not valid/does not exist', async () => {
			const appealIdThatDoesNotExist = 0;

			nock('http://test/').get(`/appeals/${appealIdThatDoesNotExist}`).reply(500);

			const response = await request.get(`${baseUrl}/${appealIdThatDoesNotExist}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a Issue a decision action button when the appealStatus is ready for final review', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, { ...appealData, appealStatus: 'issue_determination' });

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a Decision inset panel when the appealStatus is complete', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, { ...appealData, appealStatus: 'complete' });

			const response = await request.get(`${baseUrl}/${appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a notification banner with a link to add the Horizon reference of the transferred appeal, when the appeal is awaiting transfer', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, { ...appealData, appealStatus: 'awaiting_transfer' });

			const response = await request.get(`${baseUrl}/${appealId}`);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a notification banner with a link to assign case officer when status is "Assign case officer"', async () => {
			const appealId = 2;
			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, { ...appealData, appealId, appealStatus: 'assign_case_officer' });

			const response = await request.get(`${baseUrl}/${appealId}`);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a "horizon reference added" notification banner, a "transferred" status tag, and an inset text component with the appeal type and horizon link for the transferred appeal, when the appeal was successfully transferred to horizon', async () => {
			nock('http://test/').get('/appeals/transferred-appeal/123').reply(200, {
				caseFound: true
			});
			nock('http://test/')
				.post('/appeals/1/appeal-transfer-confirmation')
				.reply(200, { success: true });

			const addHorizonReferencePostResponse = await request
				.post(`${baseUrl}/1/change-appeal-type/add-horizon-reference`)
				.send({
					'horizon-reference': '123'
				});

			expect(addHorizonReferencePostResponse.statusCode).toBe(302);

			const postCheckTransferResponse = await request
				.post(`${baseUrl}/1/change-appeal-type/check-transfer`)
				.send({
					confirm: 'yes'
				});

			expect(postCheckTransferResponse.statusCode).toBe(302);

			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, {
					...appealData,
					appealStatus: 'transferred',
					transferStatus: {
						transferredAppealType: '(C) Enforcement notice appeal',
						transferredAppealReference: '12345'
					}
				});

			const response = await request.get(`${baseUrl}/${appealId}`);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the appellant case status as "Incomplete" if the appellant case validation status is incomplete, and the due date is in the future', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, {
					...appealData,
					appealStatus: 'ready_to_start',
					documentationSummary: {
						appellantCase: {
							status: 'incomplete',
							dueDate: '2099-02-01T10:27:06.626Z'
						}
					}
				});

			const response = await request.get(`${baseUrl}/${appealId}`);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the appellant case status as "Incomplete" if the appellant case validation status is incomplete, and the due date is today', async () => {
			const appealId = '2';
			const today = new Date();

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, {
					...appealData,
					appealStatus: 'ready_to_start',
					documentationSummary: {
						appellantCase: {
							status: 'incomplete',
							dueDate: today.toISOString()
						}
					}
				});

			const response = await request.get(`${baseUrl}/${appealId}`);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the appellant case status as "Overdue" if the appellant case validation status is incomplete, and the due date is in the past', async () => {
			const appealId = '2';

			nock('http://test/')
				.get(`/appeals/${appealId}`)
				.reply(200, {
					...appealData,
					appealStatus: 'ready_to_start',
					documentationSummary: {
						appellantCase: {
							status: 'incomplete',
							dueDate: '2024-02-01T10:27:06.626Z'
						}
					}
				});

			const response = await request.get(`${baseUrl}/${appealId}`);

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	it('should not render a back button', async () => {
		const appealId = '2';

		nock('http://test/')
			.get(`/appeals/${appealId}`)
			.reply(200, {
				...appealData,
				appealId
			});

		const response = await request.get(`${baseUrl}/${appealId}`);
		const element = parseHtml(response.text, { rootElement: 'body' });

		const backButton = element?.querySelector('.govuk-back-link');

		expect(backButton).toBeNull();

		expect(element.innerHTML).toMatchSnapshot();
	});
});
