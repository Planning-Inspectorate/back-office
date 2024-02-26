import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import {
	appealData,
	documentFileInfo,
	inspectorDecisionData,
	linkedAppealBackOffice,
	linkableAppealSummaryBackOffice,
	linkableAppealSummaryHorizon
} from '#testing/appeals/appeals.js';

const { app, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const linkedAppealsPath = '/linked-appeals';
const managePath = '/manage';
const unlinkAppealPath = '/unlink-appeal';

const leadAppealDataWithLinkedAppeals = {
	...appealData,
	isParentAppeal: true,
	isChildAppeal: false,
	linkedAppeals: [
		{
			appealId: 2,
			appealReference: 'APP/Q9999/D/21/725284',
			isParentAppeal: false,
			linkingDate: new Date('2024-02-09T09:41:13.611Z'),
			appealType: 'Householder'
		},
		{
			appealId: null,
			appealReference: '76215416',
			isParentAppeal: false,
			linkingDate: new Date('2024-02-09T09:41:13.611Z'),
			appealType: 'Unknown'
		}
	]
};
const childAppealDataWithLinkedAppeals = {
	...appealData,
	isParentAppeal: false,
	isChildAppeal: true,
	linkedAppeals: [
		{
			appealId: 2,
			appealReference: 'APP/Q9999/D/21/725284',
			isParentAppeal: false,
			linkingDate: new Date('2024-02-09T09:41:13.611Z'),
			appealType: 'Householder'
		},
		{
			appealId: null,
			appealReference: '76215416',
			isParentAppeal: false,
			linkingDate: new Date('2024-02-09T09:41:13.611Z'),
			appealType: 'Unknown'
		}
	]
};

describe('linked-appeals', () => {
	beforeEach(() => {
		nock('http://test/').get('/appeals/1').reply(200, leadAppealDataWithLinkedAppeals);
	});
	afterEach(teardown);

	describe('GET /change-appeal-type/appeal-type', () => {
		it('should render the decision page lead', async () => {
			nock('http://test/').get('/appeals/1').reply(200, leadAppealDataWithLinkedAppeals);
			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/${managePath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		it('should render the decision page child', async () => {
			nock('http://test/').get('/appeals/2').reply(200, childAppealDataWithLinkedAppeals);
			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/${managePath}/100/2`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /linked-appeals/add', () => {
		it('should render the add linked appeal reference page with the expected content, and a back link to the case details page', async () => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add`);
			const element = parseHtml(response.text, { rootElement: 'body' });

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /linked-appeals/add', () => {
		it('should re-render the add linked appeal reference page with the expected error message if no reference was provided', async () => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const response = await request.post(`${baseUrl}/1${linkedAppealsPath}/add`).send({
				'appeal-reference': ''
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the add linked appeal reference page with the expected error message if the reference was provided but no matching appeal was found', async () => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/').get('/appeals/linkable-appeal/123').reply(404);

			const response = await request.post(`${baseUrl}/1${linkedAppealsPath}/add`).send({
				'appeal-reference': '123'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if the reference was provided and a matching appeal was found', async () => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const response = await request.post(`${baseUrl}/1${linkedAppealsPath}/add`).send({
				'appeal-reference': '123'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);
		});
	});

	describe('GET /linked-appeals/add/check-and-confirm', () => {
		it('should render the check and confirm page with a summary list displaying information about the linking candidate appeal, and a back link to the add linked appeal reference page', async () => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`);
			const element = parseHtml(response.text, { rootElement: 'body' });

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check and confirm page with appropriate warning text, no radio options, and a button linking back to the add linked appeal reference page with label text of "return to search", if the appeals are already linked', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					linkedAppeals: [
						{
							...linkedAppealBackOffice,
							appealId: linkableAppealSummaryBackOffice.appealId,
							appealReference: linkableAppealSummaryBackOffice.appealReference
						}
					]
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check and confirm page with appropriate warning text, no radio options, and a button linking back to the add linked appeal reference page with label text of "return to search", if the linking candidate is a child (already has a lead)', async () => {
			nock.cleanAll();
			nock('http://test/').get('/appeals/1').reply(200, appealData);
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: false,
					isChildAppeal: true,
					linkedAppeals: [linkedAppealBackOffice]
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check and confirm page with appropriate warning text, no radio options, and a button linking back to the add linked appeal reference page with label text of "return to search", if the linking target is a child (already has a lead)', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: true,
					linkedAppeals: [linkedAppealBackOffice]
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, appealData);
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check and confirm page with appropriate warning text, no radio options, and a button linking back to the add linked appeal reference page with label text of "return to search", if the linking target and candidate are both lead appeals', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: true,
					isChildAppeal: false,
					linkedAppeals: [linkedAppealBackOffice]
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: true,
					isChildAppeal: false,
					linkedAppeals: [linkedAppealBackOffice]
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check and confirm page with lead and cancel radio options, and a submit button with label text of "Continue", if the linking candidate is a lead and the target has no existing linked appeals', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: true,
					isChildAppeal: false,
					linkedAppeals: [linkedAppealBackOffice]
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check and confirm page with child and cancel radio options, and a submit button with label text of "Continue", if the linking target is a lead and the candidate has no existing linked appeals', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: true,
					isChildAppeal: false,
					linkedAppeals: [linkedAppealBackOffice]
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check and confirm page with lead, child and cancel radio options, and a submit button with label text of "Continue", if neither the linking target nor the candidate have existing linked appeals', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request.get(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /linked-appeals/add/check-and-confirm', () => {
		it('should re-render the check and confirm page with the expected error message if no radio option was selected', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`)
				.send({
					confirmation: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect back to the add linked appeal reference page if the "cancel" radio option was selected', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`)
				.send({
					confirmation: 'cancel'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add'
			);
		});

		it('should call the link-appeal endpoint to link the candidate as lead of the target, and redirect to the case details page for the target appeal, if the candidate is a back office appeal, and the "lead" radio option was selected', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);
			nock('http://test/').post('/appeals/1/link-appeal').reply(200, {});

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`)
				.send({
					confirmation: 'lead'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1');
		});

		it('should call the link-appeal endpoint to link the candidate as child of the target, and redirect to the case details page for the target appeal, if the candidate is a back office appeal, and the "child" radio option was selected', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryBackOffice.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryBackOffice.appealId,
					appealReference: linkableAppealSummaryBackOffice.appealReference,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryBackOffice);
			nock('http://test/').post('/appeals/1/link-appeal').reply(200, {});

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`)
				.send({
					confirmation: 'child'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1');
		});

		it('should call the link-legacy-appeal endpoint to link the candidate as lead of the target, and redirect to the case details page for the target appeal, if the candidate is a legacy (Horizon) appeal, and the "lead" radio option was selected', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryHorizon.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryHorizon.appealId,
					appealReference: linkableAppealSummaryHorizon.appealReference,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryHorizon);
			nock('http://test/').post('/appeals/1/link-legacy-appeal').reply(200, {});

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`)
				.send({
					confirmation: 'lead'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1');
		});

		it('should call the link-legacy-appeal endpoint to link the candidate as child of the target, and redirect to the case details page for the target appeal, if the candidate is a legacy (Horizon) appeal, and the "child" radio option was selected', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get('/appeals/1')
				.reply(200, {
					...appealData,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get(`/appeals/${linkableAppealSummaryHorizon.appealId}`)
				.reply(200, {
					...appealData,
					appealId: linkableAppealSummaryHorizon.appealId,
					appealReference: linkableAppealSummaryHorizon.appealReference,
					isParentAppeal: false,
					isChildAppeal: false,
					linkedAppeals: []
				});
			nock('http://test/')
				.get('/appeals/linkable-appeal/123')
				.reply(200, linkableAppealSummaryHorizon);
			nock('http://test/').post('/appeals/1/link-legacy-appeal').reply(200, {});

			const addLinkedAppealReferenceResponse = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add`)
				.send({
					'appeal-reference': '123'
				});

			expect(addLinkedAppealReferenceResponse.statusCode).toBe(302);
			expect(addLinkedAppealReferenceResponse.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/add/check-and-confirm'
			);

			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/add/check-and-confirm`)
				.send({
					confirmation: 'child'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1');
		});
	});

	describe('GET /change-appeal-type/unlink-appeal', () => {
		it('should render the unlink-appeal page', async () => {
			nock('http://test/').get('/appeals/1').reply(200, leadAppealDataWithLinkedAppeals);
			const response = await request.get(
				`${baseUrl}/1${linkedAppealsPath}/${unlinkAppealPath}/1/1/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /change-appeal-type/unlink-appeal', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, inspectorDecisionData);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});
		afterEach(teardown);

		it('should redirect to the unlink appeal page if the selected confirmation value is "no"', async () => {
			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/${unlinkAppealPath}/1/2`)
				.send({
					unlinkAppeal: 'no'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/linked-appeals/manage'
			);
		});

		it('should call the unlink API and redirect to the unlink-appeal page', async () => {
			nock('http://test/').delete('/appeals/1/unlink-appeal').reply(200, { success: true });
			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/${unlinkAppealPath}/2/1`)
				.send({
					unlinkAppeal: 'yes'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1');
		});

		it('should re-render the unlink appeal page with the expected error message if yes or no are not selected', async () => {
			const response = await request
				.post(`${baseUrl}/1${linkedAppealsPath}/${unlinkAppealPath}/2/1`)
				.send({
					unlinkAppeal: ''
				});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
