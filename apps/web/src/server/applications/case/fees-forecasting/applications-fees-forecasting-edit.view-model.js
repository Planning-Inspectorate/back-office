import { getSectionData } from './applications-fees-forecasting.utils.js';
import { sectionData, urlSectionNames } from './fees-forecasting.config.js';

/**
 * @param {string|null} projectName
 * @param {string} sectionName
 * @returns {object}
 */
export const getFeesForecastingEditViewModel = (projectName, sectionName) => {
	const section = getSectionData(sectionName, urlSectionNames, sectionData);

	return {
		selectedPageType: 'fees-forecasting',
		pageTitle:
			section?.sectionTitle && projectName ? `${section.sectionTitle} - ${projectName}` : '',
		pageHeading: section?.pageHeading || '',
		fieldName: section?.fieldName || '',
		componentType: section?.componentType || ''
	};
};
