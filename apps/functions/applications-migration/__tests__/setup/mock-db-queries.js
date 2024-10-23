import { jest } from '@jest/globals';

const odwQueryMock = jest.fn();
jest.unstable_mockModule('../../common/synapse-db', () => ({
	executeOdwQuery: odwQueryMock
}));

const niDbQueryMock = jest.fn();
jest.unstable_mockModule('../../project-updates-migration/src/execute-sequelize-query', () => ({
	executeNiDbQuery: niDbQueryMock
}));

export { odwQueryMock, niDbQueryMock };
