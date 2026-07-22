import { url } from '../../../lib/nunjucks-filters/url.js';
import { getStatusTagClass, getStatusDisplayName } from '@pins/applications/lib/status-utils.js';

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

/** @type {ExaminationLibrarySection[]} */
export const examinationLibrarySections = [
	{
		index: 1,
		heading: 'Application documents',
		slug: 'application-documents',
		items: [
			{
				title: 'Application documents',
				hint: 'Any amended versions accepted before or at the Preliminary Meeting should be saved as Additional Submissions.',
				href: 'application-documents'
			}
		]
	},
	{
		index: 2,
		heading: 'Adequacy of consultation responses',
		slug: 'adequacy-of-consultation-responses',
		items: [
			{
				title: 'Adequacy of consultation responses',
				href: 'adequacy-of-consultation-responses'
			}
		]
	},
	{
		index: 3,
		heading: 'Relevant representations (registration comments)',
		slug: 'relevant-representations',
		items: [
			{
				title: 'Relevant representations',
				href: 'relevant-representations'
			}
		]
	},
	{
		index: 4,
		heading: 'Procedural decisions and notifications from Examining Authority',
		slug: 'procedural-decisions',
		items: [
			{
				title: 'Procedural decisions and notifications from Examining Authority',
				hint: "Includes Examining Authority's written questions, event notifications and procedural decisions on the examination.",
				href: 'procedural-decisions'
			}
		]
	},
	{
		index: 5,
		heading: 'Change requests',
		slug: 'change-requests',
		items: []
	},
	{
		index: 6,
		heading: 'Additional submissions',
		slug: 'additional-submissions',
		items: [
			{
				title: 'Additional submissions',
				hint: 'Includes anything accepted at the discretion of the Examining Authority outside of a formal deadline.',
				href: 'additional-submissions'
			}
		]
	},
	{
		index: 7,
		heading: 'Events and hearings',
		slug: 'events-and-hearings',
		items: []
	},
	{
		index: 8,
		heading: 'Procedural deadlines',
		slug: 'procedural-deadlines',
		items: []
	},
	{
		index: 9,
		heading: 'Deadlines',
		slug: 'deadlines',
		items: []
	},
	{
		index: 10,
		heading: 'Other documents',
		slug: 'other-documents',
		items: [
			{
				title: 'Other documents',
				hint: 'Includes s127/131/138 information, s56, s58 and s59 certificates, and transboundary documents.',
				href: 'other-documents'
			}
		]
	}
];

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
