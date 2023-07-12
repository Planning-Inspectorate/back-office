import { booleanAnswer } from '../../../lib/nunjucks-filters/boolean-answer.js';
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
			emailed: booleanAnswer(update.emailSubscribers),
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
 * The form view for the create page
 *
 * @param {any} caseInfo
 * @param {import('@pins/express').ValidationErrors | undefined} errors
 * @param {Record<string, any>} values
 * @returns {import('./project-updates-form').ProjectUpdatesFormView}
 */
export function createFormView(caseInfo, errors, values) {
	let emailSubscribers = true;
	if (Object.prototype.hasOwnProperty.call(values, 'emailSubscribers')) {
		emailSubscribers = values.emailSubscribers;
	}
	return {
		case: caseInfo,
		title: 'Create a project update',
		buttonText: 'Save and continue',
		errors, // for error summary
		form: {
			components: [
				{
					type: 'html-content-editor',
					name: 'content',
					label: {
						text: 'Content',
						classes: 'govuk-!-font-weight-bold'
					},
					characterCount: true,
					value: values.content,
					errorMessage: errors?.content
				},
				{
					type: 'checkboxes',
					name: 'emailSubscribers',
					fieldset: {
						legend: {
							text: 'Email to subscribers?',
							classes: 'govuk-!-font-weight-bold'
						}
					},
					hint: {
						text: 'De-select if you do not want to send an email notification to subcribers'
					},
					items: [
						{
							value: true,
							text: 'Send to subscribers',
							checked: emailSubscribers
						}
					],
					errorMessage: errors?.emailSubscribers
				}
			]
		}
	};
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
		case 'to-publish':
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
