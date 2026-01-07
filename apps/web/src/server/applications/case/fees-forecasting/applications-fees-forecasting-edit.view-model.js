import { getSectionData } from './applications-fees-forecasting.utils.js';

/**
 * @param {string} projectName
 * @param {string} sectionName
 * @returns {object}
 */
export const getFeesForecastingEditViewModel = (projectName, sectionName) => {
	const section = getSectionData(sectionName);

	return {
		selectedPageType: 'fees-forecasting',
		pageTitle: section?.pageTitle ? `${section.pageTitle} - ${projectName}` : '',
		pageHeading: section?.pageHeading || '',
		fieldName: section?.fieldName || '',
		componentType: section?.componentType || ''
	};
};
