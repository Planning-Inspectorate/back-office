import { jest } from '@jest/globals';
import projectTeamADService from '../../../src/server/applications/case/project-team/application-project-team.azure-service.js';

/** @typedef {import('../../../src/server/applications/applications.types').ProjectTeamMember} ProjectTeamMember */

/**
 * Provide mocked value for the project team search page
 *
 * @param {ProjectTeamMember[]} mockedMembers
 */
export const installMockADToken = (mockedMembers) => {
	const mockGetToken = () => Promise.resolve({ token: 'mock_token' });
	const mockGetMembers = () => Promise.resolve(mockedMembers);

	jest.spyOn(projectTeamADService, 'getTokenOrAuthErrors').mockImplementationOnce(mockGetToken);
	jest.spyOn(projectTeamADService, 'searchADMember').mockImplementationOnce(mockGetMembers);
};