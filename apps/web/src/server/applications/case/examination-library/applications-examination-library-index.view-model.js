import { url } from '../../../lib/nunjucks-filters/url.js';
import {
	examinationLibrarySections,
	getCategoryStatusTagClass,
	getCategoryStatusDisplayName,
	categoryCodes,
	DEFAULT_SECTION_STATUS
} from './examination-library.constants.js';
import {
	getCategoryCode,
	getCategorySlug,
	getDynamicSectionSlug
} from './applications-examination-library-utils.js';

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
 * @typedef {object} ExaminationLibraryCategory
 * @property {string} categoryCode
 * @property {string} categoryName
 * @property {string} publishedStatus
 * @property {string} source
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
 * @param {Map<string, string>} statusByHref
 * @returns {object}
 */
export const mapSectionToViewModel = (section, caseId, statusByHref) => ({
	heading: section.heading,
	slug: section.slug,
	items: section.items.map((item) => mapItemToViewModel(item, caseId, statusByHref.get(item.href)))
});

/**
 * @param {{ caseId: number, categories?: ExaminationLibraryCategory[] }} params
 * @returns {{ sections: object[], selectedPageType: string }}
 */
export const getExaminationLibraryIndexViewModel = ({ caseId, categories = [] }) => {
	const statusByHref = new Map();
	const sections = examinationLibrarySections.map((section) => ({
		...section,
		items: [...section.items]
	}));

	for (const category of categories) {
		if (category.source === 'TIMETABLE') {
			const sectionSlug = getDynamicSectionSlug(category.categoryCode);

			if (!sectionSlug) continue;

			const section = sections.find((section) => section.slug === sectionSlug);

			if (!section) continue;

			const itemSlug = getCategorySlug(category.categoryName);

			const href = `${sectionSlug}/${itemSlug}`;
			section.items.push({
				title: category.categoryName,
				href
			});

			statusByHref.set(href, category.publishedStatus || DEFAULT_SECTION_STATUS);
		} else {
			const section = sections.find(
				(section) => getCategoryCode(section, categoryCodes) === category.categoryCode
			);

			if (section) {
				statusByHref.set(section.slug, category.publishedStatus || DEFAULT_SECTION_STATUS);
			}
		}
	}

	return {
		selectedPageType: 'examination-library',
		sections: sections.map((section) => mapSectionToViewModel(section, caseId, statusByHref))
	};
};
