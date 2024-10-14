import { jest } from '@jest/globals';
import { logger } from '@azure/identity';
import {
	mockSequelizeResponseEnglish,
	mockSequelizeResponseWelsh
} from '../test-data/mock-from-odw/project-updates-test-data.js';

const sequelizeQueryMock = jest.fn();
jest.unstable_mockModule('../../project-updates-migration/src/execute-sequelize-query', () => ({
	executeSequelizeQuery: sequelizeQueryMock
}));

const { migrateProjectUpdates } = await import(
	'../../project-updates-migration/src/project-updates-migration.js'
);

describe('this', () => {
	beforeEach(() => {
		sequelizeQueryMock.mockReset();
	});

	it('is returning english only', async () => {
		sequelizeQueryMock.mockResolvedValueOnce(mockSequelizeResponseEnglish);

		await migrateProjectUpdates(logger, ['123'], false);
		expect(true).toBe(true);
	});

	it('is return english and welsh', async () => {
		sequelizeQueryMock
			.mockResolvedValueOnce(mockSequelizeResponseEnglish)
			.mockResolvedValueOnce(mockSequelizeResponseWelsh);

		await migrateProjectUpdates(logger, ['123'], true);
		expect(true).toBe(true);
	});
});
