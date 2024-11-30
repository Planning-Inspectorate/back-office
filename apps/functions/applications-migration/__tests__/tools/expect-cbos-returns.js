// @ts-nocheck
import { cloneDeep } from 'lodash-es';
import { projectTestDataCbos } from '../test-data/assert-from-cbos/project-test-data.js';
import { configureAlterations } from './utils.js';

/**
 *
 * @param {object} data
 * @param {import('./utils.js').Alterations | null} alterations
 * @returns
 */
const createNewObject = (data, alterations = null) => {
	const copiedData = cloneDeep(data);
	if (alterations) configureAlterations(copiedData, alterations);

	return copiedData;
};

/**
 *
 * @param {import('./utils.js').Alterations | null} alterations
 * @returns
 */
export const expectedCbosCaseTableData = (alterations = null) => {
	const caseData = createNewObject(projectTestDataCbos.Case, alterations);

	return caseData;
};

/**
 *
 * @param {import('./utils.js').Alterations | null} alterations
 * @returns
 */
export const expectedCbosApplicationDetailsTableData = (alterations = null) => {
	const applicationDetailsData = createNewObject(
		projectTestDataCbos.ApplicationDetails,
		alterations
	);
	return applicationDetailsData;
};
