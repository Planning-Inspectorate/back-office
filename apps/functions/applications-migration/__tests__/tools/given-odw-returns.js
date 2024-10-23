import { odwQueryMock } from '../setup/mock-db-queries.js';
import { configureAlterations, makeDeepCopy } from './utils.js';
import { projectTestDataOdw } from '../test-data/mock-from-odw/project-test-data.js';

/**
 *
 * @param {Record<string, unknown>} data
 */
const givenOdwReturns = (data) => {
	// @ts-ignore
	odwQueryMock.mockResolvedValue(data);
};

/**
 * @param {import('./utils.js').Alterations | null} alterations
 */
export const givenOdwReturnsProjectData = (alterations = null) => {
	const projectData = makeDeepCopy(projectTestDataOdw);
	if (alterations) configureAlterations(projectData, alterations);

	givenOdwReturns(projectData);
};
