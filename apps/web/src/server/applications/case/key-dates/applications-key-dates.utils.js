import { isDatePastToday, timestampToDate } from '../../../lib/dates.js';
import { url } from '../../../lib/nunjucks-filters/url.js';
import config from '../../../../../environment/config.js';

/**
 * @param {number|string} reOpenClosesDate
 * @returns {Boolean}
 */

const isRelevantRepresentationsReOpened = (reOpenClosesDate) =>
	typeof reOpenClosesDate === 'number'
		? !isDatePastToday(timestampToDate(reOpenClosesDate))
		: false;

/**
 * @typedef {Object} ProjectData
 * @property {string} reference
 */

/**
 * @param {ProjectData} projectData
 * @returns {string}
 */
const getProjectFormLink = ({ reference }) =>
	`${config.frontOfficeURL}/projects/${reference}/register/register-have-your-say`;

/**
 * Returns key dates section values based on the section name passed in from the request query
 *
 * @param {Record<string, any>} sectionValues
 * @param {string} showOnlySection
 * @returns {Record<string, any>}
 */
const getSectionValuesForDisplay = (sectionValues, showOnlySection) => {
	const showOnlySectionExists = Object.keys(sectionValues).includes(showOnlySection);
	return showOnlySection && showOnlySectionExists
		? { [showOnlySection]: sectionValues[showOnlySection] }
		: sectionValues;
};

/**
 * Returns the correct url based on whether the user navigated from the key dates or fees forecasting index page
 *
 * @param {string} showOnlySection
 * @param {number} caseId
 * @returns {string}
 */
const getBackLink = (showOnlySection, caseId) => {
	const keyDatesIndexUrl = url('key-dates', { caseId });
	const feesForecastingIndexUrl = url('fees-forecasting', { caseId });

	return showOnlySection ? feesForecastingIndexUrl : keyDatesIndexUrl;
};

export {
	isRelevantRepresentationsReOpened,
	getProjectFormLink,
	getSectionValuesForDisplay,
	getBackLink
};
