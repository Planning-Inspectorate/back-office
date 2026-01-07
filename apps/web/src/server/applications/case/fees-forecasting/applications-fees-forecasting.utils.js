import { sectionData, urlSectionNames } from './fees-forecasting.config.js';

/**
 * Returns section data based on the section name
 *
 * @param {string} sectionName
 * @returns {Record<string, any>}
 */
export const getSectionData = (sectionName) => {
	/** @type {Record<string, string>} */
	const sectionNames = urlSectionNames;

	/** @type {Record<string, any>} */
	const section = sectionData;

	const formattedSectionName = Object.keys(sectionNames).find(
		(key) => sectionNames[key] === sectionName
	);

	if (!formattedSectionName) {
		return {};
	}

	return Object.keys(section).includes(formattedSectionName) ? section[formattedSectionName] : {};
};
