import nock from 'nock';
import supertest from 'supertest';
import { jest } from '@jest/globals';
import { parseHtml } from '@pins/platform';
import { createTestEnvironment } from '#testing/index.js';
import config from '#environment/config.js';
import usersService from '#appeals/appeal-users/users-service.js';
import { activeDirectoryUsersData } from '#testing/app/fixtures/referencedata.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';

describe('assign-user', () => {
	beforeEach(() => {
		installMockApi();

		// @ts-ignore
		usersService.getUsersByRole = jest.fn().mockResolvedValue(activeDirectoryUsersData);
		// @ts-ignore
		usersService.getUserByRoleAndId = jest.fn().mockResolvedValue(activeDirectoryUsersData[0]);

		nock('https://graph.microsoft.com/')
			.get(
				`/v1.0/groups/${config.referenceData.appeals.caseOfficerGroupId}/members?$select=id,displayName,userPrincipalName`
			)
			.reply(200, activeDirectoryUsersData);
	});
	afterEach(teardown);

	describe('GET /assign-user/case-officer', () => {
		it('should render the assign case officer page', async () => {
			const response = await request.get(`${baseUrl}/1/assign-user/case-officer`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /assign-user/case-officer', () => {
		it('should re-render the assign case officer page with the expected error message if a search term is not provided', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/case-officer`).send({
				searchTerm: ''
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the assign case officer page with the expected error message if search term is shorter than 2 characters', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/case-officer`).send({
				searchTerm: 'a'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the assign case officer page with the expected error message if search term is longer than 80 characters', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/case-officer`).send({
				searchTerm: 'a'.repeat(81)
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the assign case officer page with a list of search results if a valid search term is provided', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/case-officer`).send({
				searchTerm: 'john'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /assign-user/inspector', () => {
		it('should render the assign inspector page', async () => {
			const response = await request.get(`${baseUrl}/1/assign-user/inspector`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /assign-user/inspector', () => {
		it('should re-render the assign inspector page with the expected error message if a search term is not provided', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/inspector`).send({
				searchTerm: ''
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the assign inspector page with the expected error message if search term is shorter than 2 characters', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/inspector`).send({
				searchTerm: 'a'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the assign inspector page with the expected error message if search term is longer than 80 characters', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/inspector`).send({
				searchTerm: 'a'.repeat(81)
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the assign inspector page with a list of search results if a valid search term is provided', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/inspector`).send({
				searchTerm: 'john'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe(`GET /assign-user/case-officer/1/confirm`, () => {
		it('should render the confirm assign case officer page', async () => {
			const response = await request.get(`${baseUrl}/1/assign-user/case-officer/1/confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe(`POST /assign-user/case-officer/1/confirm`, () => {
		it('should re-render the confirm assign case officer page with the expected error message if a confirmation option is not selected', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/case-officer/1/confirm`).send({
				confirm: ''
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the confirm assign case officer page with the expected error message if the selected confirmation value is anything other than "yes" or "no"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/case-officer/1/confirm`).send({
				confirm: '1'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the assign case officer page if the selected confirmation value is "no"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/case-officer/1/confirm`).send({
				confirm: 'no'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/assign-user/case-officer'
			);
		});

		it('should send a patch request to the appeals/:appealId API endpoint and redirect to the case details page, which should display the expected notification banner, if the selected confirmation value is "yes"', async () => {
			nock('http://test/').patch('/appeals/1').reply(200, { caseOfficer: 'updatedCaseOfficerId' });

			const response = await request.post(`${baseUrl}/1/assign-user/case-officer/1/confirm`).send({
				confirm: 'yes'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1/');

			const appealDetailsGetResponse = await request.get(`${baseUrl}/1/`);
			const element = parseHtml(appealDetailsGetResponse.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe(`GET /assign-user/inspector/1/confirm`, () => {
		it('should render the confirm assign inspector page', async () => {
			const response = await request.get(`${baseUrl}/1/assign-user/inspector/1/confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe(`POST /assign-user/inspector/1/confirm`, () => {
		it('should re-render the confirm assign inspector page with the expected error message if a confirmation option is not selected', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/inspector/1/confirm`).send({
				confirm: ''
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the confirm assign inspector page with the expected error message if the selected confirmation value is anything other than "yes" or "no"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/inspector/1/confirm`).send({
				confirm: '1'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the assign inspector page if the selected confirmation value is "no"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-user/inspector/1/confirm`).send({
				confirm: 'no'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/assign-user/inspector'
			);
		});

		it('should send a patch request to the appeals/:appealId API endpoint and redirect to the case details page, which should display the expected notification banner, if the selected confirmation value is "yes"', async () => {
			nock('http://test/').patch('/appeals/1').reply(200, { inspector: 'updatedInspectorId' });

			const response = await request.post(`${baseUrl}/1/assign-user/inspector/1/confirm`).send({
				confirm: 'yes'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1/');

			const appealDetailsGetResponse = await request.get(`${baseUrl}/1/`);
			const element = parseHtml(appealDetailsGetResponse.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe(`GET /unassign-user/case-officer/1/confirm`, () => {
		it('should render the confirm unassign case officer page', async () => {
			const response = await request.get(`${baseUrl}/1/unassign-user/case-officer/1/confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe(`POST /unassign-user/case-officer/1/confirm`, () => {
		it('should re-render the confirm unassign case officer page with the expected error message if a confirmation option is not selected', async () => {
			const response = await request
				.post(`${baseUrl}/1/unassign-user/case-officer/1/confirm`)
				.send({
					confirm: ''
				});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the confirm unassign case officer page with the expected error message if the selected confirmation value is anything other than "yes" or "no"', async () => {
			const response = await request
				.post(`${baseUrl}/1/unassign-user/case-officer/1/confirm`)
				.send({
					confirm: '1'
				});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the assign case officer page if the selected confirmation value is "no"', async () => {
			const response = await request
				.post(`${baseUrl}/1/unassign-user/case-officer/1/confirm`)
				.send({
					confirm: 'no'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/assign-user/case-officer'
			);
		});

		it('should send a patch request to the appeals/:appealId API endpoint and redirect to the assign new case officer page if the selected confirmation value is "yes", and the appeal details page should then display the expected notification banner', async () => {
			nock('http://test/').patch('/appeals/1').reply(200, { caseOfficer: '' });

			const response = await request
				.post(`${baseUrl}/1/unassign-user/case-officer/1/confirm`)
				.send({
					confirm: 'yes'
				});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/assign-new-user/case-officer'
			);

			const appealDetailsGetResponse = await request.get(`${baseUrl}/1/`);
			const element = parseHtml(appealDetailsGetResponse.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe(`GET /unassign-user/inspector/1/confirm`, () => {
		it('should render the confirm unassign inspector page', async () => {
			const response = await request.get(`${baseUrl}/1/unassign-user/inspector/1/confirm`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe(`POST /unassign-user/inspector/1/confirm`, () => {
		it('should re-render the confirm unassign inspector page with the expected error message if a confirmation option is not selected', async () => {
			const response = await request.post(`${baseUrl}/1/unassign-user/inspector/1/confirm`).send({
				confirm: ''
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the confirm unassign inspector page with the expected error message if the selected confirmation value is anything other than "yes" or "no"', async () => {
			const response = await request.post(`${baseUrl}/1/unassign-user/inspector/1/confirm`).send({
				confirm: '1'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the assign inspector page if the selected confirmation value is "no"', async () => {
			const response = await request.post(`${baseUrl}/1/unassign-user/inspector/1/confirm`).send({
				confirm: 'no'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/assign-user/inspector'
			);
		});

		it('should send a patch request to the appeals/:appealId API endpoint and redirect to the assign new inspector page if the selected confirmation value is "yes", and the appeal details page should then display the expected notification banner', async () => {
			nock('http://test/').patch('/appeals/1').reply(200, { inspector: '' });

			const response = await request.post(`${baseUrl}/1/unassign-user/inspector/1/confirm`).send({
				confirm: 'yes'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/assign-new-user/inspector'
			);

			const appealDetailsGetResponse = await request.get(`${baseUrl}/1/`);
			const element = parseHtml(appealDetailsGetResponse.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /assign-new-user/case-officer', () => {
		it('should render the assign new case officer page', async () => {
			const response = await request.get(`${baseUrl}/1/assign-new-user/case-officer`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /assign-new-user/case-officer', () => {
		it('should re-render the assign new case officer page with the expected error message if a confirmation option is not selected', async () => {
			const response = await request.post(`${baseUrl}/1/assign-new-user/case-officer`).send({
				confirm: ''
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the assign new case officer page with the expected error message if the selected confirmation value is anything other than "yes" or "no"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-new-user/case-officer`).send({
				confirm: '1'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the case details page if the selected confirmation value is "no"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-new-user/case-officer`).send({
				confirm: 'no'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1/');
		});

		it('should redirect to the assign case officer page if the selected confirmation value is "yes"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-new-user/case-officer`).send({
				confirm: 'yes'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/assign-user/case-officer'
			);
		});
	});

	describe('GET /assign-new-user/inspector', () => {
		it('should render the assign new inspector page', async () => {
			const response = await request.get(`${baseUrl}/1/assign-new-user/inspector`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /assign-new-user/inspector', () => {
		it('should re-render the assign new inspector page with the expected error message if a confirmation option is not selected', async () => {
			const response = await request.post(`${baseUrl}/1/assign-new-user/inspector`).send({
				confirm: ''
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the assign new inspector page with the expected error message if the selected confirmation value is anything other than "yes" or "no"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-new-user/inspector`).send({
				confirm: '1'
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the case details page if the selected confirmation value is "no"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-new-user/inspector`).send({
				confirm: 'no'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual('Found. Redirecting to /appeals-service/appeal-details/1/');
		});

		it('should redirect to the assign inspector page if the selected confirmation value is "yes"', async () => {
			const response = await request.post(`${baseUrl}/1/assign-new-user/inspector`).send({
				confirm: 'yes'
			});

			expect(response.statusCode).toBe(302);
			expect(response.text).toEqual(
				'Found. Redirecting to /appeals-service/appeal-details/1/assign-user/inspector'
			);
		});
	});
});
