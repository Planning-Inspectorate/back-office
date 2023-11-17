import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';

const { databaseConnector } = await import('#utils/database-connector.js');

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

describe('Test Project team members', () => {
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

	test('Project team members beloging to a case are returned', async () => {
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
	});
});
