import { jest } from '@jest/globals';
import { request } from '#app-test';
import { databaseConnector } from '#utils/database-connector.js';
import { omit } from 'lodash-es';

const { eventClient } = await import('#infrastructure/event-client.js');

const projectTeamInDatabase = [
	{
		userId: 'abcdef1234',
		role: 'officer',
		caseId: 1,
		createdAt: '2023-11-17T14:43:42.773Z'
	},
	{
		userId: 'hilmn6789',
		role: 'inspector',
		caseId: 1,
		createdAt: '2023-11-17T14:43:49.808Z'
	}
];

const projectInDatabase = {
	id: 1,
	reference: 'REF',
	applicantId: undefined,
	description: 'DESC',
	title: 'NAME',
	sourceSystem: 'back-office-applications',
	ProjectTeam: projectTeamInDatabase
};

const teamMembers = {
	operationsLeadId: null,
	operationsManagerId: null,
	caseManagerId: null,
	nsipOfficerIds: [],
	nsipAdministrationOfficerIds: [],
	leadInspectorId: null,
	inspectorIds: [],
	environmentalServicesOfficerId: null,
	legalOfficerId: null
};

const expectedNSIPProjectEvent = (() => {
	const {
		id: caseId,
		reference: caseReference,
		description: projectDescription,
		title: projectName,
		...rest
	} = projectInDatabase;
	return {
		...omit(rest, 'ProjectTeam'),
		caseId,
		caseReference,
		projectName,
		projectDescription,
		publishStatus: 'unpublished',
		...teamMembers,
		inspectorIds: ['hilmn6789']
	};
})();

describe('Test Project team members', () => {
	beforeAll(() => {
		databaseConnector.case.findUnique.mockResolvedValue(projectInDatabase);
	});

	afterAll(() => {
		jest.resetAllMocks();
	});

	test('Project team member with given ID is returned', async () => {
		databaseConnector.projectTeam.findUnique.mockResolvedValue(projectTeamInDatabase[0]);

		// WHEN
		const response = await request.get('/applications/1/project-team/abcdef1234').send();

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			userId: 'abcdef1234',
			role: 'officer',
			createdAt: '2023-11-17T14:43:42.773Z'
		});
	});

	test('Project team members belonging to a case are returned', async () => {
		databaseConnector.projectTeam.findMany.mockResolvedValue(projectTeamInDatabase);

		// WHEN
		const response = await request.get('/applications/1/project-team').send();

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				userId: 'abcdef1234',
				role: 'officer',
				createdAt: '2023-11-17T14:43:42.773Z'
			},
			{
				userId: 'hilmn6789',
				role: 'inspector',
				createdAt: '2023-11-17T14:43:49.808Z'
			}
		]);

		expect(databaseConnector.projectTeam.findMany).toHaveBeenCalledTimes(1);
	});

	test('Team member is removed from project', async () => {
		databaseConnector.projectTeam.findUnique.mockResolvedValue(projectTeamInDatabase[0]);
		databaseConnector.projectTeam.delete.mockResolvedValue({});

		const response = await request
			.post('/applications/1/project-team/remove-member')
			.send({ userId: 'abcdef1234' });

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			caseId: 1,
			userId: 'abcdef1234',
			role: 'officer',
			createdAt: '2023-11-17T14:43:42.773Z'
		});

		expect(databaseConnector.projectTeam.delete).toHaveBeenCalledTimes(1);
		expect(databaseConnector.projectTeam.delete).toHaveBeenCalledWith({
			where: {
				caseId_userId: {
					userId: 'abcdef1234',
					caseId: 1
				}
			}
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[expectedNSIPProjectEvent],
			'Update'
		);
	});
});
