import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';
import {
	fixtureTimetableTypes,
	fixtureTimetableItems
} from '../../../../../../testing/applications/fixtures/timetable-types.js';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').times(2).reply(200, {});
	nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);
	nock('http://test/')
		.get('/applications/examination-timetable-type')
		.times(2)
		.reply(200, fixtureTimetableTypes);
	nock('http://test/')
		.get('/applications/examination-timetable-items/case/123')
		.times(3)
		.reply(200, fixtureTimetableItems);
	nock('http://test/').post('/applications/examination-timetable-items').reply(200, []);
	nock('http://test/')
		.get('/applications/examination-timetable-items/1')
		.reply(200, fixtureTimetableItems[0]);
	nock('http://test/')
		.patch('/applications/examination-timetable-items/publish/123')
		.reply(200, {});
};

describe('Examination timetable page', () => {
	describe('GET /case/123/examination-timetable', () => {
		describe('When domainType is inspector', () => {
			beforeEach(async () => {
				nock('http://test/').get('/applications/inspector').reply(200, {});

				await request.get('/applications-service/inspector');
			});

			it('should not show the page', async () => {
				const response = await request.get(`/applications-service/case/123/examination-timetable`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('there is a problem with your login');
			});
		});

		describe('When domainType is not inspector', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
				nocks();
			});

			it('should show the page', async () => {
				const response = await request.get(`/applications-service/case/123/examination-timetable`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Examination timetable');
			});
		});
	});
});

describe('Select examination timetable type page', () => {
	describe('GET /case/123/examination-timetable/item/new', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		it('should show the page', async () => {
			const response = await request.get(
				`/applications-service/case/123/examination-timetable/item/new`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Timetable item type');
		});
	});
});

describe('Create examination timetable page', () => {
	describe('POST /case/123/examination-timetable/item/new', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		it('should show the page', async () => {
			const response = await request
				.post(`/applications-service/case/123/examination-timetable/item/new`)
				.send({ 'timetable-type': 'starttime-mandatory' });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('starttime-mandatory');
			expect(element.innerHTML).toContain('Date');
			expect(element.innerHTML).toContain('Item name');
			expect(element.innerHTML).toContain('Start time');
			expect(element.innerHTML).toContain('End time (optional)');
			expect(element.innerHTML).toContain('Timetable item description (optional)');
		});
	});

	describe('POST /case/123/examination-timetable/item/validate', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		describe('templateType: starttime-mandatory', () => {
			it('should display errors if mandatory fields are missing', async () => {
				const response = await request
					.post(`/applications-service/case/123/examination-timetable/item/validate`)
					.send({
						templateType: 'starttime-mandatory',
						itemTypeName: 'starttime-mandatory'
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('starttime-mandatory');
				expect(element.innerHTML).toContain('You must enter the item name');
				expect(element.innerHTML).toContain('You must enter the item date');
				expect(element.innerHTML).toContain('You must enter the item start time');
			});
		});

		describe('templateType: deadline', () => {
			it('should display errors if mandatory fields are missing', async () => {
				const response = await request
					.post(`/applications-service/case/123/examination-timetable/item/validate`)
					.send({
						templateType: 'deadline',
						itemTypeName: 'deadline'
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('deadline');
				expect(element.innerHTML).toContain('You must enter the item name');
				expect(element.innerHTML).toContain('You must enter the item end date');
				expect(element.innerHTML).toContain('You must enter the item end time');
			});
		});

		describe('templateType: deadline-startdate-mandatory', () => {
			it('should display errors if mandatory fields are missing', async () => {
				const response = await request
					.post(`/applications-service/case/123/examination-timetable/item/validate`)
					.send({
						templateType: 'deadline-startdate-mandatory',
						itemTypeName: 'deadline-startdate-mandatory'
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('deadline-startdate-mandatory');
				expect(element.innerHTML).toContain('You must enter the item name');
				expect(element.innerHTML).toContain('You must enter the item start date');
				expect(element.innerHTML).toContain('You must enter the item end date');
				expect(element.innerHTML).toContain('You must enter the item start time');
				expect(element.innerHTML).toContain('You must enter the item end time');
			});
		});

		describe('templateType: starttime-optional', () => {
			it('should display errors if mandatory fields are missing', async () => {
				const response = await request
					.post(`/applications-service/case/123/examination-timetable/item/validate`)
					.send({
						templateType: 'starttime-optional',
						itemTypeName: 'starttime-optional'
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('starttime-optional');
				expect(element.innerHTML).toContain('You must enter the item name');
				expect(element.innerHTML).toContain('You must enter the item date');
			});
		});

		describe('templateType: no-times', () => {
			it('should display errors if mandatory fields are missing', async () => {
				const response = await request
					.post(`/applications-service/case/123/examination-timetable/item/validate`)
					.send({
						templateType: 'no-times',
						itemTypeName: 'no-times'
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('no-times');
				expect(element.innerHTML).toContain('You must enter the item name');
				expect(element.innerHTML).toContain('You must enter the item date');
			});
		});
	});

	it('should display errors if start date are after end date', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/validate`)
			.send({
				templateType: 'deadline',
				itemTypeName: 'deadline',
				'startDate.day': '01',
				'startDate.month': '02',
				'startDate.year': '2001',
				'startTime.hours': '01',
				'startTime.minutes': '02',
				'endDate.day': '01',
				'endDate.month': '02',
				'endDate.year': '2000',
				'endTime.hours': '01',
				'endTime.minutes': '02'
			});
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
		expect(element.innerHTML).toContain('The item end date must be after the item start date');
	});

	it('should display errors if start time are after end time', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/validate`)
			.send({
				templateType: 'deadline',
				itemTypeName: 'deadline',
				'startDate.day': '01',
				'startDate.month': '02',
				'startDate.year': '2001',
				'startTime.hours': '02',
				'startTime.minutes': '02',
				'endDate.day': '01',
				'endDate.month': '02',
				'endDate.year': '2001',
				'endTime.hours': '01',
				'endTime.minutes': '02'
			});
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
		expect(element.innerHTML).toContain('The item end time must be after the item start time');
	});

	it('should go to check-your-answers page if nothing is missing', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/validate`)
			.send({
				templateType: 'starttime-mandatory',
				itemTypeName: 'starttime-mandatory',
				name: 'Lorem',
				'date.day': '01',
				'date.month': '02',
				'date.year': '2000',
				'startTime.hours': '01',
				'startTime.minutes': '02'
			});

		expect(response?.headers?.location).toContain('check-your-answers');
	});
});

describe('Edit examination timetable', () => {
	describe('GET /case/123/examination-timetable/item/1/edit', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		it('should show the page', async () => {
			const response = await request.get(
				`/applications-service/case/123/examination-timetable/item/edit/1`
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Edit timetable item');
		});
	});
});

describe('POST /case/123/examination-timetable/item/check-your-answers', () => {
	beforeEach(async () => {
		await request.get('/applications-service/case-team');
		nocks();
	});

	it('should show page with the right fields correctly formatted', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/check-your-answers`)
			.send({
				templateType: 'starttime-mandatory',
				itemTypeName: 'starttime-mandatory',
				name: 'Lorem',
				'date.day': '01',
				'date.month': '02',
				'date.year': '2000',
				'startTime.hours': '01',
				'startTime.minutes': '02',
				description: 'Some text with \n * one point \n* another point '
			});

		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
		expect(element.innerHTML).toContain('Check your answers before creating a new item');
		expect(element.innerHTML).toContain('/item/new');
	});

	it('should show different texts and links when is Editing page', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/check-your-answers/1`)
			.send({
				templateType: 'starttime-mandatory',
				itemTypeName: 'starttime-mandatory',
				timetableId: 1,
				name: 'Lorem',
				'date.day': '01',
				'date.month': '02',
				'date.year': '2000',
				'startTime.hours': '01',
				'startTime.minutes': '02',
				description: 'Some text with \n * one point \n* another point '
			});

		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
		expect(element.innerHTML).toContain('Check your answers before editing an item');
		expect(element.innerHTML).toContain('/item/edit/1');
	});
});

describe('POST /case/123/examination-timetable/item/save', () => {
	beforeEach(async () => {
		await request.get('/applications-service/case-team');
		nocks();
	});

	it('should go to success page', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/save`)
			.send({
				templateType: 'starttime-mandatory',
				itemTypeName: 'starttime-mandatory',
				examinationTypeId: 1,
				name: 'Lorem',
				date: new Date('2000-01-01'),
				description: 'Some text with \n * one point \n* another point '
			});

		expect(response?.headers?.location).toEqual('../../created/success');
	});
});

describe('Publish examination timetable preview page', () => {
	describe('GET /case/123/examination-timetable/preview', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		it('should show the page', async () => {
			const response = await request.get(
				`/applications-service/case/123/examination-timetable/preview`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Publish examination timetable');
		});
	});
});

describe('Delete examination timetable', () => {
	beforeEach(async () => {
		await request.get('/applications-service/case-team');
		nocks();
	});
	describe('GET /case/123/examination-timetable/item/delete/1', () => {
		it('should show the page', async () => {
			const response = await request.get(
				`/applications-service/case/123/examination-timetable/item/delete/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Delete timetable item');
		});
	});

	describe('POST /case/123/examination-timetable/item/delete/1', () => {
		it('should show errors if api fails', async () => {
			nock('http://test/').delete('/applications/examination-timetable-items/1').reply(500, {});

			const response = await request.post(
				`/applications-service/case/123/examination-timetable/item/delete/1`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('An error occurred');
		});

		it('should go to success page if deleting is successful', async () => {
			nock('http://test/').delete('/applications/examination-timetable-items/1').reply(200, {});

			const response = await request.post(
				`/applications-service/case/123/examination-timetable/item/delete/1`
			);

			expect(response?.headers?.location).toEqual('../../deleted/success');
		});

		it('should show the delete success page', async () => {
			const response = await request.get(
				`/applications-service/case/123/examination-timetable/deleted/success`
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Timetable item successfully deleted');
		});
	});
});

describe('Publish examination timetable success page', () => {
	describe('POST /case/123/examination-timetable/preview', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		it('should redirect to success page', async () => {
			const response = await request.post(
				`/applications-service/case/123/examination-timetable/preview`
			);
			expect(response?.headers?.location).toEqual('./published/success');
		});

		it('should show the page', async () => {
			const response = await request.get(
				`/applications-service/case/123/examination-timetable/published/success`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Timetable item successfully published');
		});
	});
});
