import { odwQueryMock } from '../setup/mock-db-queries.js';
import { makeDeepCopy } from './utils.js';
import { projectTestData } from '../test-data/mock-from-odw/project-test-data.js';

/** @typedef {{ add?: object, change?: object, remove?: string[] }} Alterations*/

/**
 *
 * @param {Record<string, unknown>} data
 */
const givenOdwReturns = (data) => {
	odwQueryMock.mockResolvedValue(data);
};

/**
 * @param {Record<string, unknown>} data
 * @param {Alterations} alterations
 */
const configureAlterations = (data, alterations) => {
	data = { ...data, ...alterations.add, ...alterations.change };
	alterations.remove?.forEach((key) => delete data[key]);
};

/**
 * @param {Alterations | null} alterations
 */
export const givenOdwReturnsProjectData = (alterations = null) => {
	const projectData = makeDeepCopy(projectTestData);
	if (alterations) configureAlterations(projectData, alterations);

	givenOdwReturns(projectData);
};
