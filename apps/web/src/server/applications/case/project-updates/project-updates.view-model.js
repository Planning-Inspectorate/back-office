import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
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
				label: statusLabel(update.status)
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
 * @returns {import('./project-updates-views').ProjectUpdatesFormView}
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
 * The details view for the check-answers and review pages
 *
 * @param {Object} options
 * @param {any} options.caseInfo
 * @param {string} options.title
 * @param {string} options.buttonText
 * @param {import('./project-updates-views').ProjectUpdatesDetailsView['form']} options.form
 * @param {import('@pins/applications').ProjectUpdate} options.projectUpdate
 * @returns {import('./project-updates-views').ProjectUpdatesDetailsView}
 */
export function createDetailsView({ caseInfo, title, buttonText, form, projectUpdate }) {
	return {
		case: caseInfo,
		title,
		buttonText,
		preview: { html: projectUpdate.htmlContent },
		form,
		summary: {
			rows: [
				{
					key: {
						html: '<h2 class="govuk-heading-m govuk-!-margin-top-3">Content</h2>'
					},
					actions: {
						items: [
							{
								href: '#',
								text: 'Change',
								visuallyHiddenText: 'content'
							}
						]
					}
				},
				{
					key: { text: 'Email to subscribers' },
					value: { text: booleanAnswer(projectUpdate.emailSubscribers) }
				},
				{
					key: { text: 'English' },
					value: { html: projectUpdate.htmlContent }
				},
				{
					key: { text: 'Status' },
					value: { html: statusTag(projectUpdate.status) },
					actions: {
						items: [
							{
								href: '#',
								text: 'Change',
								visuallyHiddenText: 'content'
							}
						]
					}
				}
			]
		}
	};
}

/**
 * Return the govukRadio options for the given status
 *
 * @param {string} status
 * @returns {{text: string, value: string}}
 */
export function statusRadioOption(status) {
	let text = status;
	switch (status) {
		case ProjectUpdate.Status.draft:
			text = 'Draft';
			break;
		case ProjectUpdate.Status.readyToPublish:
			text = 'Ready to Publish';
			break;
		case ProjectUpdate.Status.published:
			text = 'Published';
			break;
		case ProjectUpdate.Status.archived:
			text = 'Archived';
			break;
		case ProjectUpdate.Status.unpublished:
			text = 'Unpublished';
			break;
	}
	return {
		text,
		value: status
	};
}

/**
 * Returns an HTML string for a govuk tag
 *
 * @param {string} status
 * @returns {string}
 */
export function statusTag(status) {
	const color = statusColor(status);
	const label = statusLabel(status);

	return `<strong class="govuk-tag govuk-tag--${color} single-line">${label}</strong>`;
}

/**
 * Label for the given status
 *
 * @param {string} status
 * @returns {string}
 */
function statusLabel(status) {
	return status.replaceAll('_', ' ').replaceAll('-', ' ');
}

/**
 * Tag color for the given status
 *
 * @param {string} status
 * @returns {string}
 */
function statusColor(status) {
	// list of available color classes can be found
	// at https://design-system.service.gov.uk/components/tag/#additional-colours
	// or https://github.dev/alphagov/govuk-frontend/src/govuk/components/tag/_index.scss
	switch (status.toLowerCase()) {
		case ProjectUpdate.Status.draft:
			return 'grey';
		case ProjectUpdate.Status.readyToPublish:
			return 'purple';
		case ProjectUpdate.Status.published:
			return 'blue';
		case ProjectUpdate.Status.archived:
			return 'red';
		case ProjectUpdate.Status.unpublished:
			return 'yellow';
	}
	return 'grey';
}
