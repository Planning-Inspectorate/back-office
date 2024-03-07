import { jest } from '@jest/globals';
import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import {
	appealData,
	linkedAppeals,
	linkableAppealSummaryBackOffice,
	linkableAppealSummaryHorizon
} from '#testing/app/fixtures/referencedata.js';
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

		it('should render a "Neighbouring site added" notification banner when the a neighbouring site was added', async () => {
			const appealReference = '1';

			nock.cleanAll();
			nock('http://test/')
				.post(`/appeals/${appealReference}/neighbouring-sites`)
				.reply(200, {
					siteId: 1,
					address: {
						addressLine1: '1 Grove Cottage',
						addressLine2: 'Shotesham Road',
						country: 'United Kingdom',
						county: 'Devon',
						postcode: 'NR35 2ND',
						town: 'Woodton'
					}
				});
			nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData);

			const addNeighbouringSiteResponse = await request
				.post(`${baseUrl}/1/neighbouring-sites/add`)
				.send({
					addressLine1: '1 Grove Cottage',
					addressLine2: null,
					county: 'Devon',
					postCode: 'NR35 2ND',
					town: 'Woodton'
				});

			expect(addNeighbouringSiteResponse.statusCode).toBe(302);

			const addLinkedAppealCheckAndConfirmPostResponse = await request.post(
				`${baseUrl}/1/neighbouring-sites/add/check-and-confirm`
			);

			expect(addLinkedAppealCheckAndConfirmPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
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
			// Do not fakes here stop nock from timing out, by stopping jest from freezing time
			jest
				.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] })
				.setSystemTime(new Date('2024-02-15'));
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
			jest.useRealTimers();
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

		it('should render an action link to the add linked appeal page in the linked appeals row, if there are no linked appeals', async () => {
			nock.cleanAll();
			nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData);

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render action links to the manage linked appeals page and the add linked appeal page in the linked appeals row, if there are linked appeals', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/${appealData.appealId}`)
				.reply(200, {
					...appealData,
					linkedAppeals
				});

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the case reference for each linked appeal in the linked appeals row, each linking to the respective case details page, if there are linked appeals', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/${appealData.appealId}`)
				.reply(200, {
					...appealData,
					linkedAppeals
				});

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the lead or child status after the case reference link of each linked appeal in the linked appeals row, if there are linked appeals', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/${appealData.appealId}`)
				.reply(200, {
					...appealData,
					linkedAppeals
				});

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a lead tag next to the appeal status tag if the appeal is a parent', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/${appealData.appealId}`)
				.reply(200, {
					...appealData,
					isParentAppeal: true,
					isChildAppeal: false,
					linkedAppeals: linkedAppeals.filter(
						(linkedAppeal) => linkedAppeal.isParentAppeal === false
					)
				});

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a child tag next to the appeal status tag if the appeal is a child', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/${appealData.appealId}`)
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: true,
					linkedAppeals: linkedAppeals.filter(
						(linkedAppeal) => linkedAppeal.isParentAppeal === true
					)
				})
				.persist();

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a success notification banner with appropriate content if the appeal was just linked as the lead of a back-office appeal', async () => {
			const appealReference = '12345';

			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/linkable-appeal/${appealReference}`)
				.reply(200, linkableAppealSummaryBackOffice);
			nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData);
			nock('http://test/').post(`/appeals/${appealData.appealId}/link-appeal`).reply(200, {
				childId: linkableAppealSummaryBackOffice.appealId,
				childRef: linkableAppealSummaryBackOffice.appealReference,
				externaAppealType: null,
				externalSource: false,
				id: 1,
				linkingDate: '2024-02-22T16:45:24.037Z',
				parentId: appealData.appealId,
				parentRef: appealData.appealReference,
				type: 'linked'
			});

			const addLinkedAppealReferencePostResponse = await request
				.post(`${baseUrl}/1/linked-appeals/add`)
				.send({
					'appeal-reference': appealReference
				});

			expect(addLinkedAppealReferencePostResponse.statusCode).toBe(302);

			const addLinkedAppealCheckAndConfirmPostResponse = await request
				.post(`${baseUrl}/1/linked-appeals/add/check-and-confirm`)
				.send({
					confirmation: 'child'
				});

			expect(addLinkedAppealCheckAndConfirmPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a success notification banner with appropriate content if the appeal was just linked as the child of a back-office appeal', async () => {
			const appealReference = '12345';

			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/linkable-appeal/${appealReference}`)
				.reply(200, linkableAppealSummaryBackOffice);
			nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData);
			nock('http://test/').post(`/appeals/${appealData.appealId}/link-appeal`).reply(200, {
				childId: appealData.appealId,
				childRef: appealData.appealReference,
				externaAppealType: null,
				externalSource: false,
				id: 1,
				linkingDate: '2024-02-22T16:45:24.037Z',
				parentId: linkableAppealSummaryBackOffice.appealId,
				parentRef: linkableAppealSummaryBackOffice.appealReference,
				type: 'linked'
			});

			const addLinkedAppealReferencePostResponse = await request
				.post(`${baseUrl}/1/linked-appeals/add`)
				.send({
					'appeal-reference': appealReference
				});

			expect(addLinkedAppealReferencePostResponse.statusCode).toBe(302);

			const addLinkedAppealCheckAndConfirmPostResponse = await request
				.post(`${baseUrl}/1/linked-appeals/add/check-and-confirm`)
				.send({
					confirmation: 'lead'
				});

			expect(addLinkedAppealCheckAndConfirmPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a success notification banner with appropriate content if the appeal was just linked as the lead of a legacy (Horizon) appeal', async () => {
			const appealReference = '12345';

			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/linkable-appeal/${appealReference}`)
				.reply(200, linkableAppealSummaryHorizon);
			nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData);
			nock('http://test/').post(`/appeals/${appealData.appealId}/link-legacy-appeal`).reply(200, {
				childId: null,
				childRef: '3171066',
				externaAppealType: null,
				externalSource: true,
				id: 1,
				linkingDate: '2024-02-22T16:58:09.276Z',
				parentId: 5465,
				parentRef: 'TEST-569815',
				type: 'linked'
			});

			const addLinkedAppealReferencePostResponse = await request
				.post(`${baseUrl}/1/linked-appeals/add`)
				.send({
					'appeal-reference': appealReference
				});

			expect(addLinkedAppealReferencePostResponse.statusCode).toBe(302);

			const addLinkedAppealCheckAndConfirmPostResponse = await request
				.post(`${baseUrl}/1/linked-appeals/add/check-and-confirm`)
				.send({
					confirmation: 'child'
				});

			expect(addLinkedAppealCheckAndConfirmPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a success notification banner with appropriate content if the appeal was just linked as the child of a legacy (Horizon) appeal', async () => {
			const appealReference = '12345';

			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/linkable-appeal/${appealReference}`)
				.reply(200, linkableAppealSummaryHorizon);
			nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData);
			nock('http://test/').post(`/appeals/${appealData.appealId}/link-legacy-appeal`).reply(200, {
				childId: 5466,
				childRef: 'TEST-489773',
				externaAppealType: null,
				externalSource: true,
				id: 1,
				linkingDate: '2024-02-22T17:16:57.654Z',
				parentId: null,
				parentRef: '3171066',
				type: 'linked'
			});

			const addLinkedAppealReferencePostResponse = await request
				.post(`${baseUrl}/1/linked-appeals/add`)
				.send({
					'appeal-reference': appealReference
				});

			expect(addLinkedAppealReferencePostResponse.statusCode).toBe(302);

			const addLinkedAppealCheckAndConfirmPostResponse = await request
				.post(`${baseUrl}/1/linked-appeals/add/check-and-confirm`)
				.send({
					confirmation: 'lead'
				});

			expect(addLinkedAppealCheckAndConfirmPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/${appealData.appealId}`);
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
