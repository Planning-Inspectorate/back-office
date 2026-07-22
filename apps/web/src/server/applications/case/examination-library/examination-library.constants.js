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
