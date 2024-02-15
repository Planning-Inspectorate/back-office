import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import { appealData, documentFileInfo, inspectorDecisionData } from '#testing/appeals/appeals.js';

const { app, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const manageLinkedAppealsPath = '/manage-linked-appeals';
const linkedAppealsPath = '/linked-appeals';
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

describe('change-appeal-type', () => {
	beforeEach(() => {
		nock('http://test/').get('/appeals/1').reply(200, leadAppealDataWithLinkedAppeals);
	});
	afterEach(teardown);

	describe('GET /change-appeal-type/appeal-type', () => {
		it('should render the decision page lead', async () => {
			nock('http://test/').get('/appeals/1').reply(200, leadAppealDataWithLinkedAppeals);
			const response = await request.get(
				`${baseUrl}/1${manageLinkedAppealsPath}/${linkedAppealsPath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
		it('should render the decision page child', async () => {
			nock('http://test/').get('/appeals/2').reply(200, childAppealDataWithLinkedAppeals);
			const response = await request.get(
				`${baseUrl}/1${manageLinkedAppealsPath}/${linkedAppealsPath}/100/2`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /change-appeal-type/unlink-appeal', () => {
		it('should render the unlink-appeal page', async () => {
			nock('http://test/').get('/appeals/1').reply(200, leadAppealDataWithLinkedAppeals);
			const response = await request.get(
				`${baseUrl}/1${manageLinkedAppealsPath}/${unlinkAppealPath}/1/1/1`
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
				.post(`${baseUrl}/1${manageLinkedAppealsPath}/${unlinkAppealPath}/1/2`)
				.send({
					unlinkAppeal: 'no'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/manage-linked-appeals/linked-appeals'
			);
		});

		it('should call the unlink API and redirect to the unlink-appeal page', async () => {
			nock('http://test/').delete('/appeals/1/unlink-appeal').reply(200, { success: true });
			const response = await request
				.post(`${baseUrl}/1${manageLinkedAppealsPath}/${unlinkAppealPath}/2/1`)
				.send({
					unlinkAppeal: 'yes'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1');
		});

		it('should re-render the unlink appeal page with the expected error message if yes or no are not selected', async () => {
			const response = await request
				.post(`${baseUrl}/1${manageLinkedAppealsPath}/${unlinkAppealPath}/2/1`)
				.send({
					unlinkAppeal: ''
				});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
