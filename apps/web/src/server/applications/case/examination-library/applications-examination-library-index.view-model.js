import { url } from '../../../lib/nunjucks-filters/url.js';
import { getStatusTagClass, getStatusDisplayName } from '@pins/applications/lib/status-utils.js';
import { examinationLibrarySections } from './examination-library.constants.js';

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
 * @typedef {object} ExaminationLibraryDynamicSection
 * @property {string} slug
 * @property {ExaminationLibraryItem[]} items
 */

/**
 * @typedef {object} SectionStatus
 * @property {string} slug
 * @property {import('@pins/applications/lib/status-utils.js').ApplicationStatus} status
 */

/**
 * Merge static sections with any dynamic overrides, then sort by index
 *
 * @param {ExaminationLibrarySection[]} staticSections
 * @param {ExaminationLibraryDynamicSection[]} dynamicSections
 * @returns {ExaminationLibrarySection[]}
 */
export const mergeSections = (staticSections, dynamicSections) => {
	return staticSections
		.map((section) => {
			const dynamicOverride = dynamicSections.find((ds) => ds.slug === section.slug);
			return dynamicOverride ? { ...section, items: dynamicOverride.items } : section;
		})
		.sort((a, b) => a.index - b.index);
};

/**
 * Map a single examination library item to its view model representation
 *
 * @param {ExaminationLibraryItem} item
 * @param {number} caseId
 * @param {import('@pins/applications/lib/status-utils.js').ApplicationStatus | undefined} sectionStatus
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
				text: getStatusDisplayName(sectionStatus),
				classes: getStatusTagClass(sectionStatus)
			}
		}
	})
});

/**
 * Map a section and its items to the view model shape
 *
 * @param {ExaminationLibrarySection} section
 * @param {number} caseId
 * @param {Map<string, import('@pins/applications/lib/status-utils.js').ApplicationStatus>} statusByCode
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
 * @param {{ caseId: number, dynamicSections?: ExaminationLibraryDynamicSection[], sectionStatuses?: SectionStatus[] }} params
 * @returns {{ sections: object[], selectedPageType: string }}
 */
export const getExaminationLibraryIndexViewModel = ({
	caseId,
	dynamicSections = [],
	sectionStatuses = []
}) => {
	const statusByCode = new Map(sectionStatuses.map(({ slug, status }) => [slug, status]));
	const sections = mergeSections(examinationLibrarySections, dynamicSections);

	return {
		selectedPageType: 'examination-library',
		sections: sections.map((section) => mapSectionToViewModel(section, caseId, statusByCode))
	};
};
