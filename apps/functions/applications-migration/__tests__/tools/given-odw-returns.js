// @ts-nocheck
import { odwQueryMock } from '../setup/mock-db-queries.js';
import { configureAlterations, createIncrementingId } from './utils.js';
import { projectTestDataOdw } from '../test-data/mock-from-odw/project-test-data.js';
import { cloneDeep } from 'lodash-es';

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
	const projectData = cloneDeep(projectTestDataOdw);
	const caseId = createIncrementingId();
	projectData[0].caseId = caseId;
	if (alterations) configureAlterations(projectData, alterations);

	givenOdwReturns(projectData);
	return caseId;
};
