import { jest } from '@jest/globals';
import { request } from '#app-test';
import { databaseConnector } from '#utils/database-connector.js';
import { mockApplicationGet } from '#utils/application-factory-for-tests.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';
import { NSIP_PROJECT } from '#infrastructure/topics.js';

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

const caseStatusInDatabase = [
	{
		status: 'draft'
	}
];

const applicationDetailsInDatabase = {
	locationDescription: 'Some Location',
	caseEmail: 'test@test.com',
	zoomLevel: {
		name: 'country'
	}
};

const projectInDatabase = {
	id: 1,
	reference: 'REF',
	applicantId: null,
	description: 'DESC',
	title: 'NAME',
	sourceSystem: 'back-office-applications',
	ProjectTeam: projectTeamInDatabase,
	CaseStatus: caseStatusInDatabase,
	ApplicationDetails: applicationDetailsInDatabase,
	anticipatedDateOfSubmission: null,
	anticipatedSubmissionDateNonSpecific: null
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
	legalOfficerId: null,
	migrationStatus: null
};

const expectedNSIPProjectEvent = buildPayloadEventsForSchema(NSIP_PROJECT, {
	caseId: 1,
	applicantId: '1',
	caseReference: 'REF',
	projectEmailAddress: 'test@test.com',
	projectLocation: 'Some Location',
	projectName: 'NAME',
	projectType: 'BC01 - Office Use',
	projectDescription: 'DESC',
	publishStatus: 'unpublished',
	mapZoomLevel: 'country',
	regions: ['north_west', 'south_west'],
	stage: 'draft',
	welshLanguage: false,
	...teamMembers,
	inspectorIds: ['hilmn6789'],
	easting: 123456,
	northing: 654321,
	anticipatedDateOfSubmission: '2022-07-22T10:38:33.000Z',
	anticipatedSubmissionDateNonSpecific: 'Q1 2023',
	sector: 'BC - Business and Commercial',
	sourceSystem: 'back-office-applications'
});

describe('Test Project team members', () => {
	beforeAll(() => {
		databaseConnector.case.findUnique.mockImplementation(
			mockApplicationGet(projectInDatabase, { ProjectTeam: projectTeamInDatabase })
		);
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
			expectedNSIPProjectEvent,
			'Update'
		);
	});
});
