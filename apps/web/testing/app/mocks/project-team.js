import { jest } from '@jest/globals';
import * as projectTeamADService from '../../../src/server/applications/common/services/project-team.service.js';
import { omit } from 'lodash-es';

/** @typedef {import('../../../src/server/applications/applications.types').ProjectTeamMember} ProjectTeamMember */

/**
 * Provide mocked value for the project team search page
 *
 * @param {Partial<ProjectTeamMember>[]} mockedMembers
 */
export const installMockADToken = (mockedMembers) => {
	const mockedADUsers = mockedMembers.map((mockedMember) => omit(mockedMember, 'role'));

	jest.spyOn(projectTeamADService, 'getAllADUsers').mockResolvedValue(mockedADUsers);
	jest.spyOn(projectTeamADService, 'getAllCachedUsers').mockResolvedValue(mockedADUsers);
};
