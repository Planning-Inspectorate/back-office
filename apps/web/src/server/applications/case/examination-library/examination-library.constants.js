/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibraryItem} ExaminationLibraryItem
 */

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibrarySection} ExaminationLibrarySection
 */

/**
 * @typedef {'in progress' | 'published' | 'unpublished'} ExaminationLibraryCategoryStatus
 */

/** @type {Record<string, { label: string, tagClass: string }>} */
export const CATEGORY_STATUS = {
	'in progress': { label: 'In progress', tagClass: 'govuk-tag--blue' },
	published: { label: 'Published', tagClass: 'govuk-tag--green' },
	unpublished: { label: 'Unpublished', tagClass: 'govuk-tag--grey' }
};

/**
 * Default section status for Examination Library categories
 *
 * @type {ExaminationLibraryCategoryStatus}
 */
export const DEFAULT_SECTION_STATUS = 'in progress';

export const getCategoryStatusTagClass = (/** @type {string} */ status) =>
	CATEGORY_STATUS[status]?.tagClass || 'govuk-tag--grey';

export const getCategoryStatusDisplayName = (/** @type {string} */ status) =>
	CATEGORY_STATUS[status]?.label || status || '';

/**
 * Examination Library category codes for documents
 *
 * @type {{APP: string, AoC: string, PD: string, AS: string, OD: string, RR: string}}
 */
export const categoryCodes = {
	APP: 'application-documents',
	AoC: 'adequacy-of-consultation-responses',
	PD: 'procedural-decisions',
	AS: 'additional-submissions',
	OD: 'other-documents',
	RR: 'relevant-representations'
};

/**
 * @type {string}
 */
export const NO_EXAMINATION_LIBRARY_CATEGORY_CODE = 'NELC';

/**
 * Table headers for Examination Library category subpages where document author is displayed
 *
 * @type {string[]}
 */
// TODO: Column header "Status" should be renamed to "Document status" to distinguish from category status
const tableHeadersWithAuthor = ['Reference', 'Document description', 'From', 'Status', 'Actions'];

/**
 * Table headers for Examination Library category subpages where document author is not displayed
 *
 * @type {string[]}
 */
const tableHeadersWithoutAuthor = ['Reference', 'Document description', 'Status', 'Actions'];

/**
 * Static data for Examination Library sections
 *
 * @type {ExaminationLibrarySection[]}
 */
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
		],
		tableHeaders: tableHeadersWithoutAuthor
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
		],
		tableHeaders: tableHeadersWithAuthor
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
		],
		tableHeaders: ['Reference', 'From', 'Status', 'Actions']
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
		],
		tableHeaders: tableHeadersWithoutAuthor
	},
	{
		index: 5,
		heading: 'Change requests',
		slug: 'change-requests',
		items: [],
		tableHeaders: tableHeadersWithAuthor
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
		],
		tableHeaders: tableHeadersWithAuthor
	},
	{
		index: 7,
		heading: 'Events and hearings',
		slug: 'events-and-hearings',
		items: [],
		tableHeaders: tableHeadersWithoutAuthor
	},
	{
		index: 8,
		heading: 'Procedural deadlines',
		slug: 'procedural-deadlines',
		items: [],
		tableHeaders: tableHeadersWithAuthor
	},
	{
		index: 9,
		heading: 'Deadlines',
		slug: 'deadlines',
		items: [],
		tableHeaders: tableHeadersWithAuthor
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
		],
		tableHeaders: tableHeadersWithAuthor
	}
];
