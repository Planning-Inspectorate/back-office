import { projectTestDataCbos } from '../test-data/assert-from-cbos/project-test-data.js';
import { configureAlterations, makeDeepCopy } from './utils.js';

export const expectedCbosProjectData = (alterations = null) => {
	const projectData = makeDeepCopy(projectTestDataCbos);
	if (alterations) configureAlterations(projectData, alterations);

	return projectData;
};
