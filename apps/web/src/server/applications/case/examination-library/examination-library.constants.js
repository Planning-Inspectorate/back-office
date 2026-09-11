/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibraryItem} ExaminationLibraryItem
 */

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibrarySection} ExaminationLibrarySection
 */

/**
 * @typedef {import('./applications-examination-library-index.view-model.js').ExaminationLibraryDynamicSection} ExaminationLibraryDynamicSection
 */

/**
 * Examination Library category codes for documents
 *
 * @type {{APP: string, AoC: string, PD: string, AS: string, OD: string}}
 */
export const categoryCodes = {
	APP: 'application-documents',
	AoC: 'adequacy-of-consultation-responses',
	PD: 'procedural-decisions',
	AS: 'additional-submissions',
	OD: 'other-documents'
};

/**
 * Table headers for Examination Library category subpages where document author is displayed
 *
 * @type {string[]}
 */
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

/**
 * Placeholder section statuses for the Examination Library.
 *
 * These are temporary static values used until the service layer
 * is implemented to fetch statuses from the database.
 */
/** @type {Array<{slug: string, status: import('@pins/applications/lib/status-utils.js').ApplicationStatus}>} */
export const placeholderSectionStatuses = [
	{ slug: 'application-documents', status: 'published' },
	{ slug: 'adequacy-of-consultation-responses', status: 'published' },
	{ slug: 'relevant-representations', status: 'published' },
	{ slug: 'procedural-decisions', status: 'published' },
	{ slug: 'additional-submissions', status: 'published' },
	{ slug: 'other-documents', status: 'published' }
];

/**
 * Placeholder section status for Examination Library category subpages
 *
 * This is a temporary static value in use until the status can be fetched from the database
 *
 * @type {string}
 */
export const placeholderSectionStatus = 'published';

/**
 * Placeholder data for dynamic Examination Library categories
 *
 * This temporary static data is in use until dynamic category data can be fetched from the database
 *
 * @type {ExaminationLibraryDynamicSection[]}
 */
export const placeHolderDynamicSections = [
	{
		slug: 'change-requests',
		items: [
			{
				title: 'Change request 1',
				href: 'change-request-1'
			},
			{
				title: 'Change request 2',
				href: 'change-request-2'
			}
		]
	},
	{
		slug: 'events-and-hearings',
		items: [
			{
				title: 'Events and hearings 1',
				href: 'events-and-hearings-1'
			},
			{
				title: 'Events and hearings 2',
				href: 'events-and-hearings-2'
			}
		]
	},
	{
		slug: 'procedural-deadlines',
		items: [
			{
				title: 'Procedural deadlines 1',
				href: 'procedural-deadlines-1'
			},
			{
				title: 'Procedural deadlines 2',
				href: 'procedural-deadlines-2'
			}
		]
	},
	{
		slug: 'deadlines',
		items: [
			{
				title: 'Deadlines 1',
				href: 'deadlines-1'
			},
			{
				title: 'Deadlines 2',
				href: 'deadlines-2'
			}
		]
	}
];
