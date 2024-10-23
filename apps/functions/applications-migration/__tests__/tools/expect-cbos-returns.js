import { projectTestDataBackoffice } from '../test-data/assert-from-api/project-test-data.js';
import { configureAlterations, makeDeepCopy } from './utils.js';

export const expectedCbosProjectData = (alterations = null) => {
	const projectData = makeDeepCopy(projectTestDataBackoffice);
	if (alterations) configureAlterations(projectData, alterations);

	return projectData;
};
