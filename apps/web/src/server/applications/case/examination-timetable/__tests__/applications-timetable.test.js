import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';
import {
	fixtureTimetableTypes,
	fixtureTimetableItems,
	fixtureTimetable,
	fixtureTimetableWelshCase
} from '../../../../../../testing/applications/fixtures/timetable-types.js';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications').times(2).reply(200, {});
	nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);
	nock('http://test/')
		.get('/applications/1234')
		.reply(200, {
			...fixtureCases[3],
			geographicalInformation: {
				locationDescription: 'Wales',
				regions: [{ name: 'wales' }]
			}
		});
	nock('http://test/')
		.get('/applications/examination-timetable-type')
		.times(2)
		.reply(200, fixtureTimetableTypes);
	nock('http://test/')
		.get('/applications/examination-timetable-items/case/123')
		.times(3)
		.reply(200, fixtureTimetable);
	nock('http://test/')
		.get('/applications/examination-timetable-items/case/1234')
		.reply(200, fixtureTimetableWelshCase);
	nock('http://test/').post('/applications/examination-timetable-items').reply(200, []);
	nock('http://test/')
		.get('/applications/examination-timetable-items/1')
		.times(2)
		.reply(200, fixtureTimetableItems[0]);
	nock('http://test/')
		.patch('/applications/examination-timetable-items/publish/123')
		.reply(200, {});
	nock('http://test/')
		.patch('/applications/examination-timetable-items/unpublish/123')
		.reply(200, {});
};

describe('Examination timetable page', () => {
	describe('GET /case/123/examination-timetable', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
		});

		it('should show the page', async () => {
			const response = await request.get(`/applications-service/case/123/examination-timetable`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Examination timetable');
		});
	});
	describe('GET /case/1234/examination-timetable', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
		});

		it('should render welsh fields for welsh cases', async () => {
			const response = await request.get(`/applications-service/case/1234/examination-timetable`);
			const element = parseHtml(response.text, { rootElement: '.timetable-table' });

			expect(element.innerHTML).toContain('Item name in Welsh');
			expect(element.innerHTML).toContain('Item description in Welsh');
		});
	});
});

describe('Select examination timetable type page', () => {
	describe('GET /case/123/examination-timetable/item/new', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
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
			await request.get('/applications-service/');
			nocks();
		});

		it('should show the page', async () => {
			const response = await request
				.post(`/applications-service/case/123/examination-timetable/item/new`)
				.send({ 'timetable-type': 'accompanied-site-inspection' });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('accompanied-site-inspection');
			expect(element.innerHTML).toContain('Date');
			expect(element.innerHTML).toContain('Item name');
			expect(element.innerHTML).toContain('Start time (optional)');
			expect(element.innerHTML).toContain('End time (optional)');
			expect(element.innerHTML).toContain('Timetable item description (optional)');
		});
	});

	describe('POST /case/123/examination-timetable/item/validate', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
		});

		const fields = [
			'item name',
			'item date',
			'item start time',
			'item end time',
			'item start date',
			'item end date',
			'timetable item description'
		];

		const templateTypes = [
			{
				templateType: 'accompanied-site-inspection',
				mandatory: ['item name', 'item date']
			},
			{
				templateType: 'compulsory-acquisition-hearing',
				mandatory: ['item name', 'item date']
			},
			{
				templateType: 'deadline',
				mandatory: ['item name', 'item end time', 'item end date', 'timetable item description']
			},
			{
				templateType: 'deadline-for-close-of-examination',
				mandatory: ['item name', 'item end time', 'item end date']
			},
			{ templateType: 'issued-by', mandatory: ['item name', 'item date'] },
			{
				templateType: 'issue-specific-hearing',
				mandatory: ['item name', 'item date']
			},
			{
				templateType: 'open-floor-hearing',
				mandatory: ['item name', 'item date']
			},
			{
				templateType: 'other-meeting',
				mandatory: ['item name', 'item date']
			},
			{
				templateType: 'preliminary-meeting',
				mandatory: ['item name', 'item date', 'item start time']
			},
			{
				templateType: 'procedural-deadline',
				mandatory: ['item name', 'item end time', 'item end date', 'timetable item description']
			},
			{
				templateType: 'procedural-decision',
				mandatory: ['item name', 'item date']
			},
			{ templateType: 'publication-of', mandatory: ['item name', 'item date'] }
		];

		templateTypes.forEach(({ templateType, mandatory }) => {
			describe(`templateType: ${templateType}`, () => {
				it('should display errors if mandatory fields are missing', async () => {
					const response = await request
						.post(`/applications-service/case/123/examination-timetable/item/validate`)
						.send({
							templateType: templateType,
							itemTypeName: templateType
						});
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain(templateType);
					fields
						.filter((field) => mandatory.includes(field))
						.forEach((field) => {
							expect(element.innerHTML).toContain(`You must enter the ${field}`);
						});
					fields
						.filter((field) => !mandatory.includes(field))
						.forEach((field) => {
							expect(element.innerHTML).not.toContain(`You must enter the ${field}`);
						});
				});
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
				'endTime.minutes': '02',
				description: 'Some text with \n * one point \n* another point '
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
				'endTime.minutes': '02',
				description: 'Some text with \n * one point \n* another point '
			});
		const element = parseHtml(response.text);

		expect(element.innerHTML).toMatchSnapshot();
		expect(element.innerHTML).toContain('The item end time must be after the item start time');
	});

	it('should go to check-your-answers page if nothing is missing', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/validate`)
			.send({
				templateType: 'preliminary-meeting',
				itemTypeName: 'preliminary-meeting',
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
			await request.get('/applications-service/');
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
	describe('Edit welsh fields', () => {
		describe('GET /case/123/examination-timetable/item/edit/1/name-welsh', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
				nocks();
			});

			it('should render the page', async () => {
				const response = await request.get(
					`/applications-service/case/123/examination-timetable/item/edit/1/name-welsh`
				);

				const element = parseHtml(response.text, { rootElement: 'h1' });

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Item name in Welsh');
			});
		});

		describe('POST /case/123/examination-timetable/item/edit/1/name-welsh', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
				nocks();
			});
			describe('when the form is submitted with a welsh name', () => {
				describe('and there are validation errors', () => {
					it('should show an error when submitted welsh name is empty', async () => {
						const response = await request
							.post(`/applications-service/case/123/examination-timetable/item/edit/1/name-welsh`)
							.send({
								id: 1,
								nameWelsh: ''
							});

						const element = parseHtml(response.text, { rootElement: '.govuk-error-summary' });

						expect(element.innerHTML).toContain('Enter item name in Welsh');
					});
					it('should show an error when submitted welsh name is too long', async () => {
						const response = await request
							.post(`/applications-service/case/123/examination-timetable/item/edit/1/name-welsh`)
							.send({
								id: 1,
								nameWelsh: 'mock welsh name'.repeat(100)
							});

						const element = parseHtml(response.text, { rootElement: '.govuk-error-summary' });

						expect(element.innerHTML).toContain(
							'Item name in Welsh must be 200 characters or less'
						);
					});
				});

				describe('and there are no validation errors', () => {
					it('redirect to /examination-timetable', async () => {
						const response = await request
							.post(`/applications-service/case/123/examination-timetable/item/edit/1/name-welsh`)
							.send({
								id: 1,
								nameWelsh: 'mock welsh name'
							});

						expect(response?.headers?.location).toBe(
							'/applications-service/case/123/examination-timetable'
						);
					});
				});
			});
		});

		describe('GET /case/123/examination-timetable/item/edit/1/description-welsh', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
				nocks();
			});

			it('should render the page', async () => {
				const response = await request.get(
					`/applications-service/case/123/examination-timetable/item/edit/1/description-welsh`
				);

				const element = parseHtml(response.text, { rootElement: 'h1' });

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Item description in Welsh');
			});
		});

		describe('POST /case/123/examination-timetable/item/edit/1/description-welsh', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
				nocks();
			});
			describe('when the form is submitted with a welsh description', () => {
				describe('and there are validation errors', () => {
					it('should show an error when submitted welsh description is empty', async () => {
						const response = await request
							.post(
								`/applications-service/case/123/examination-timetable/item/edit/1/description-welsh`
							)
							.send({
								id: 1,
								descriptionWelsh: ''
							});

						const element = parseHtml(response.text, { rootElement: '.govuk-error-summary' });

						expect(element.innerHTML).toContain('Enter item description in Welsh');
					});
					it('should show an error when submitted welsh description bulletpoint number doesnt match english counterpart', async () => {
						const response = await request
							.post(
								`/applications-service/case/123/examination-timetable/item/edit/1/description-welsh`
							)
							.send({
								id: 1,
								descriptionWelsh: 'mock welsh description without bulletpoints'
							});

						const element = parseHtml(response.text, { rootElement: '.govuk-error-summary' });

						expect(element.innerHTML).toContain(
							'Item description in Welsh must contain the same number of bullets as the item description in English'
						);
					});
				});

				describe('and there are no validation errors', () => {
					it('redirects to /examination-timetable', async () => {
						const response = await request
							.post(
								`/applications-service/case/123/examination-timetable/item/edit/1/description-welsh`
							)
							.send({
								id: 1,
								descriptionWelsh: 'mock welsh description \n *bulletpoint \n*bulletpoint'
							});

						expect(response?.headers?.location).toBe(
							'/applications-service/case/123/examination-timetable'
						);
					});
				});
			});
		});
	});
});

describe('POST /case/123/examination-timetable/item/check-your-answers', () => {
	beforeEach(async () => {
		await request.get('/applications-service/');
		nocks();
	});

	it('should show page with the right fields correctly formatted', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/check-your-answers`)
			.send({
				templateType: 'preliminary-meeting',
				itemTypeName: 'preliminary-meeting',
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
				templateType: 'preliminary-meeting',
				itemTypeName: 'preliminary-meeting',
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
		await request.get('/applications-service/');
		nocks();
	});

	it('should go to success page', async () => {
		const response = await request
			.post(`/applications-service/case/123/examination-timetable/item/save`)
			.send({
				templateType: 'preliminary-meeting',
				itemTypeName: 'preliminary-meeting',
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
			await request.get('/applications-service/');
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

describe('Unpublish examination timetable preview page', () => {
	describe('GET /case/123/examination-timetable/unpublish-preview', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
		});

		it('should show the page', async () => {
			const response = await request.get(
				`/applications-service/case/123/examination-timetable/unpublish-preview`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Unpublish examination timetable');
		});
	});
});

describe('Delete examination timetable', () => {
	beforeEach(async () => {
		await request.get('/applications-service/');
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
			await request.get('/applications-service/');
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

describe('Unpublish examination timetable success page', () => {
	describe('POST /case/123/examination-timetable/unpublish-preview', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
		});

		it('should redirect to success page', async () => {
			const response = await request.post(
				`/applications-service/case/123/examination-timetable/unpublish-preview`
			);
			expect(response?.headers?.location).toEqual('./unpublished/success');
		});

		it('should show the page', async () => {
			const response = await request.get(
				`/applications-service/case/123/examination-timetable/unpublished/success`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Timetable item successfully unpublished');
		});
	});
});

const {
	app: appUnauth,
	installMockApi: installMockApiUnauth,
	teardown: teardownUnauth
} = createTestEnvironment({ authenticated: true, groups: ['not_valid_group'] });

const requestUnauth = supertest(appUnauth);

describe('Examination timetable pages when user belongs to wrong group', () => {
	beforeEach(installMockApiUnauth);
	afterEach(teardownUnauth);

	describe('GET /case/123/examination-timetable', () => {
		it('should not render the page due to an authentication error', async () => {
			const response = await requestUnauth.get('/case/123/examination-timetable');

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('You are not permitted to access this URL');
		});
	});
});
