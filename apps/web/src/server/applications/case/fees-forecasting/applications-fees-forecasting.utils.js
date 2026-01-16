/**
 * Returns section data based on the section name
 *
 * @param {string} sectionName
 * @param {Record<string, any>} urlSectionNames
 * @param {Record<string, any>} sectionData
 * @returns {Record<string, any>}
 */
export const getSectionData = (sectionName, urlSectionNames = {}, sectionData = {}) => {
	if (!sectionName) {
		return {};
	}

	const formattedSectionName = Object.keys(urlSectionNames).find(
		(key) => urlSectionNames[key] === sectionName
	);

	if (!formattedSectionName) {
		return {};
	}

	return Object.keys(sectionData).includes(formattedSectionName)
		? sectionData[formattedSectionName]
		: {};
};
