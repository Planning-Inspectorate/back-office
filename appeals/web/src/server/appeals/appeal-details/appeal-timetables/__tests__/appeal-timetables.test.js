import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { appealData as baseAppealData } from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';

const { app, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details/1/appeal-timetables';

const finalCommentReviewData = {
	...baseAppealData,
	appealTimetable: {
		appealTimetableId: 1,
		finalCommentReviewDate: '2023-08-09'
	}
};

describe('Appeal Timetables', () => {
	afterEach(teardown);

	it(`should render "Schedule Final Comment Review Date" page`, async () => {
		const appealData = {
			...baseAppealData,
			appealTimetable: {
				appealTimetableId: 1
			}
		};

		nock('http://test/').get('/appeals/1').reply(200, appealData);

		const response = await request.get(`${baseUrl}/final-comment-review`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should render "Change Final Comment Review Date" page`, async () => {
		nock('http://test/').get('/appeals/1').reply(200, finalCommentReviewData);

		const response = await request.get(`${baseUrl}/final-comment-review`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should render "Change Final Comment Review Date" with error (no answer provided)', async () => {
		nock('http://test/').get('/appeals/1').reply(200, finalCommentReviewData);

		const response = await request.post(`${baseUrl}/final-comment-review`).send({
			'due-date-day': '',
			'due-date-month': '',
			'due-date-year': ''
		});
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should render "Change Final Comment Review Date" with error (api error)', async () => {
		nock('http://test/').get('/appeals/1').reply(200, finalCommentReviewData);
		nock('http://test/')
			.patch('/appeals/1/appeal-timetables/1')
			.reply(400, {
				errors: {
					lpaQuestionnaireDueDate: 'must be a business day'
				}
			});

		const response = await request.post(`${baseUrl}/final-comment-review`).send({
			'due-date-day': '1',
			'due-date-month': '1',
			'due-date-year': '2050'
		});
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it('should render "Change Final Comment Review Date" confirmation page', async () => {
		nock('http://test/').get('/appeals/1').reply(200, finalCommentReviewData);
		nock('http://test/').patch('/appeals/1/appeal-timetables/1').reply(200, {
			finalCommentReviewDate: '2050-01-02T01:00:00.000Z'
		});

		const response = await request.post(`${baseUrl}/final-comment-review`).send({
			'due-date-day': '2',
			'due-date-month': '1',
			'due-date-year': '2050'
		});

		expect(response.statusCode).toBe(302);
	});

	it(`should render "Schedule issue determination" page`, async () => {
		const appealData = {
			...baseAppealData,
			appealTimetable: {
				appealTimetableId: 1
			}
		};

		nock('http://test/').get('/appeals/1').reply(200, appealData);

		const response = await request.get(`${baseUrl}/issue-determination`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should render "Change issue determination" page`, async () => {
		const appealData = {
			...baseAppealData,
			appealTimetable: {
				appealTimetableId: 1,
				issueDeterminationDate: '2023-08-09'
			}
		};

		nock('http://test/').get('/appeals/1').reply(200, appealData);

		const response = await request.get(`${baseUrl}/issue-determination`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should render "Schedule LPA questionnaire Date" page`, async () => {
		const appealData = {
			...baseAppealData,
			appealTimetable: {
				appealTimetableId: 1
			}
		};

		nock('http://test/').get('/appeals/1').reply(200, appealData);

		const response = await request.get(`${baseUrl}/lpa-questionnaire`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should render "Change LPA questionnaire Date" page`, async () => {
		const appealData = {
			...baseAppealData,
			appealTimetable: {
				appealTimetableId: 1,
				lpaQuestionnaireDueDate: '2023-08-09'
			}
		};

		nock('http://test/').get('/appeals/1').reply(200, appealData);

		const response = await request.get(`${baseUrl}/lpa-questionnaire`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should render "Schedule statement review Date" page`, async () => {
		const appealData = {
			...baseAppealData,
			appealTimetable: {
				appealTimetableId: 1
			}
		};

		nock('http://test/').get('/appeals/1').reply(200, appealData);

		const response = await request.get(`${baseUrl}/statement-review`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});

	it(`should render "Change statement review Date" page`, async () => {
		const appealData = {
			...baseAppealData,
			appealTimetable: {
				appealTimetableId: 1,
				statementReviewDate: '2023-08-09'
			}
		};

		nock('http://test/').get('/appeals/1').reply(200, appealData);

		const response = await request.get(`${baseUrl}/statement-review`);
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
	});
});
