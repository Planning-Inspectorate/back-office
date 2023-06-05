import { displayDate } from '../../../lib/nunjucks-filters/date.js';

/**
 * @typedef {Object} projectUpdatesRow
 * @property {number} id
 * @property {string} datePublished
 * @property {string} content
 * @property {string} emailed
 * @property {Object} status
 * @property {string} status.color
 * @property {string} status.label
 */

/**
 *
 * @param {import('@pins/applications').ProjectUpdate[]} projectUpdates
 * @returns {projectUpdatesRow[]}
 */
export function projectUpdatesRows(projectUpdates) {
	return projectUpdates.map((update) => {
		const row = {
			id: update.id,
			datePublished: '',
			content: update.htmlContent,
			emailed: update.emailSubscribers ? 'Yes' : 'No',
			status: {
				color: statusColor(update.status),
				label: update.status.replaceAll('_', ' ')
			}
		};
		if (update.datePublished) {
			row.datePublished = displayDate(update.datePublished, { condensed: true });
		}
		return row;
	});
}

/**
 *
 * @param {string} status
 * @returns {string}
 */
function statusColor(status) {
	// list of available color classes can be found
	// at https://design-system.service.gov.uk/components/tag/#additional-colours
	// or https://github.dev/alphagov/govuk-frontend/src/govuk/components/tag/_index.scss
	switch (status.toLowerCase()) {
		case 'draft':
			return 'grey';
		case 'to-published':
			return 'purple';
		case 'published':
			return 'blue';
		case 'archived':
			return 'red';
		case 'unpublished':
			return 'yellow';
	}
	return 'grey';
}
