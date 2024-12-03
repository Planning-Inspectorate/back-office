import { isDatePastToday, timestampToDate } from '../../../lib/dates.js';

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

export { isRelevantRepresentationsReOpened, getProjectFormLink };
