import { url } from '../../../lib/nunjucks-filters/url.js';
import {
	examinationLibrarySections,
	getCategoryStatusTagClass,
	getCategoryStatusDisplayName
} from './examination-library.constants.js';

/**
 * @typedef {object} ExaminationLibraryItem
 * @property {string} title
 * @property {string} [hint]
 * @property {string} href
 */

/**
 * @typedef {object} ExaminationLibrarySection
 * @property {number} index
 * @property {string} heading
 * @property {string} slug
 * @property {ExaminationLibraryItem[]} items
 * @property {string[]} tableHeaders
 */

/**
 * @typedef {object} SectionStatus
 * @property {string} slug
 * @property {string} status
 */

/**
 * Map a single examination library item to its view model representation
 *
 * @param {ExaminationLibraryItem} item
 * @param {number} caseId
 * @param {string} [sectionStatus]
 * @returns {object}
 */
export const mapItemToViewModel = (item, caseId, sectionStatus) => ({
	title: {
		text: item.title
	},
	...(item.hint && { hint: { text: item.hint } }),
	href: url('examination-library-section', { caseId, slug: item.href }),
	...(sectionStatus && {
		status: {
			tag: {
				text: getCategoryStatusDisplayName(sectionStatus),
				classes: `${getCategoryStatusTagClass(sectionStatus)} single-line`
			}
		}
	})
});

/**
 * Map a section and its items to the view model shape
 *
 * @param {ExaminationLibrarySection} section
 * @param {number} caseId
 * @param {Map<string, string>} statusByCode
 * @returns {object}
 */
export const mapSectionToViewModel = (section, caseId, statusByCode) => {
	const sectionStatus = statusByCode.get(section.slug);

	return {
		heading: section.heading,
		slug: section.slug,
		items: section.items.map((item) => mapItemToViewModel(item, caseId, sectionStatus))
	};
};

/**
 * @param {{ caseId: number, sectionStatuses?: SectionStatus[] }} params
 * @returns {{ sections: object[], selectedPageType: string }}
 */
export const getExaminationLibraryIndexViewModel = ({ caseId, sectionStatuses = [] }) => {
	const statusByCode = new Map(sectionStatuses.map(({ slug, status }) => [slug, status]));

	return {
		selectedPageType: 'examination-library',
		sections: examinationLibrarySections.map((section) =>
			mapSectionToViewModel(section, caseId, statusByCode)
		)
	};
};
