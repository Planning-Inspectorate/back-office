import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
import { booleanAnswer } from '../../../lib/nunjucks-filters/boolean-answer.js';
import { displayDate } from '../../../lib/nunjucks-filters/date.js';
import { url } from '../../../lib/nunjucks-filters/url.js';
import { projectUpdateRoutes } from './project-updates.router.js';
import { featureFlagClient } from '../../../../common/feature-flags.js';

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
 * The form view for the create/content page
 *
 * @param {Object} opts
 * @param {any} opts.caseInfo
 * @param {import('@pins/express').ValidationErrors | undefined} opts.errors
 * @param {Record<string, any>} opts.values
 * @param {string} [opts.title]
 * @param {boolean} [opts.emailSubscribersEditable]
 * @param {boolean} [opts.caseIsWelsh]
 * @returns {import('./project-updates-views').ProjectUpdatesFormView}
 */
export function createContentFormView({
	caseInfo,
	errors,
	values,
	title,
	emailSubscribersEditable = true,
	caseIsWelsh = false
}) {
	let emailSubscribers = true;
	const characterCountLimit = 500;

	if (Object.prototype.hasOwnProperty.call(values, 'emailSubscribers')) {
		emailSubscribers = values.emailSubscribers;
	}

	if (!title) {
		title = 'Create project update';
	}

	const htmlContentEditorComponent = {
		type: 'html-content-editor',
		// specific field name to allow more specific WAF exception
		// see ASB-1692
		name: 'backOfficeProjectUpdateContent',
		label: {
			text: 'Details about the update',
			classes: 'govuk-!-font-weight-bold'
		},
		hint: {
			text: `The recommended length is ${characterCountLimit} characters`
		},
		value: values.backOfficeProjectUpdateContent,
		// The editorValue contains the content converted to the format expected by the toastUI editor
		editorValue: values.backOfficeProjectUpdateContent?.replaceAll(`<br />`, `<p><br></p>`),
		errorMessage: errors?.backOfficeProjectUpdateContent
	};

	const htmlContentEditorWelshComponent = {
		type: 'html-content-editor',
		name: 'backOfficeProjectUpdateContentWelsh',
		label: {
			text: 'Details about the update in Welsh',
			classes: 'govuk-!-font-weight-bold'
		},
		hint: {
			text: `The recommended length is ${characterCountLimit} characters`
		},
		value: values.backOfficeProjectUpdateContentWelsh,
		// The editorValue contains the content converted to the format expected by the toastUI editor
		editorValue: values.backOfficeProjectUpdateContentWelsh?.replaceAll(`<br />`, `<p><br></p>`),
		errorMessage: errors?.backOfficeProjectUpdateContentWelsh
	};

	const checkboxesComponent = {
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
				checked: emailSubscribers,
				disabled: !emailSubscribersEditable
			}
		],
		errorMessage: errors?.emailSubscribers
	};

	const components = caseIsWelsh
		? [htmlContentEditorComponent, htmlContentEditorWelshComponent, checkboxesComponent]
		: [htmlContentEditorComponent, checkboxesComponent];

	return {
		case: caseInfo,
		title,
		buttonText: 'Save and continue',
		errors, // for error summary
		form: { components }
	};
}

/**
 * The details view for the check-answers and review pages
 *
 * @param {Object} options
 * @param {any} options.caseInfo
 * @param {boolean} [options.caseIsWelsh]
 * @param {string} [options.title]
 * @param {string} [options.warningText]
 * @param {string} [options.buttonText]
 * @param {string} [options.buttonLink]
 * @param {boolean} [options.buttonWarning]
 * @param {string} [options.deleteButtonLink]
 * @param {import('./project-updates-views').ProjectUpdatesDetailsView['form']} [options.form]
 * @param {import('@pins/applications').ProjectUpdate} options.projectUpdate
 * @param {string} [options.backLink]
 * @param {boolean} [options.editable]
 * @returns {import('./project-updates-views').ProjectUpdatesDetailsView}
 */
export function createDetailsView({
	caseInfo,
	caseIsWelsh,
	title,
	warningText,
	buttonText,
	buttonLink,
	buttonWarning,
	deleteButtonLink,
	form,
	projectUpdate,
	backLink,
	editable = true
}) {
	const contentChangeLink = url('project-updates-step', {
		caseId: parseInt(caseInfo.id),
		step: projectUpdateRoutes.content,
		projectUpdateId: projectUpdate.id
	});
	const typeChangeLink = url('project-updates-step', {
		caseId: parseInt(caseInfo.id),
		step: projectUpdateRoutes.type,
		projectUpdateId: projectUpdate.id
	});
	const statusChangeLink = url('project-updates-step', {
		caseId: parseInt(caseInfo.id),
		step: projectUpdateRoutes.status,
		projectUpdateId: projectUpdate.id
	});
	const contentActions = {};
	const typeActions = {};
	const statusActions = {};
	if (editable) {
		contentActions.items = [
			{
				href: contentChangeLink,
				text: 'Change',
				visuallyHiddenText: 'content'
			}
		];
		typeActions.items = [
			{
				href: typeChangeLink,
				text: 'Change',
				visuallyHiddenText: 'content'
			}
		];
		statusActions.items = [
			{
				href: statusChangeLink,
				text: 'Change',
				visuallyHiddenText: 'status'
			}
		];
	}
	const rows = [];
	if (projectUpdate.status === ProjectUpdate.Status.published && projectUpdate.datePublished) {
		console.log(projectUpdate.datePublished);
		rows.push({
			key: { text: 'Date published' },
			value: { text: displayDate(projectUpdate.datePublished, { condensed: true }) }
		});
	}
	if (featureFlagClient.isFeatureActive('applic-55-welsh-translation')) {
		rows.push({
			key: { text: 'Details about the update' },
			value: { html: projectUpdate.htmlContent, classes: 'project-update' },
			actions: contentActions
		});
		if (caseIsWelsh) {
			rows.push({
				key: { text: 'Details about the update in Welsh' },
				value: { html: projectUpdate.htmlContentWelsh, classes: 'project-update' },
				actions: contentActions
			});
		}
		rows.push({
			key: { text: 'Email to subscribers' },
			value: { text: booleanAnswer(projectUpdate.emailSubscribers) },
			actions: contentActions
		});
	} else {
		rows.push({
			classes: 'no-border',
			key: {
				html: '<h2 class="govuk-heading-m govuk-!-margin-top-3">Content</h2>'
			},
			actions: contentActions
		});
		rows.push({
			classes: 'no-border',
			key: { text: 'Email to subscribers' },
			value: { text: booleanAnswer(projectUpdate.emailSubscribers) }
		});
		rows.push({
			key: { text: 'English' },
			value: { html: projectUpdate.htmlContent, classes: 'project-update' }
		});
	}

	return {
		case: caseInfo,
		title,
		warningText,
		buttonText,
		buttonLink,
		buttonClasses: buttonWarning ? 'govuk-button--warning' : '',
		deleteButtonLink,
		preview: {
			htmlContent: projectUpdate.htmlContent,
			htmlContentWelsh: projectUpdate.htmlContentWelsh ?? ''
		},
		backLink,
		form,
		summary: {
			rows: [
				...rows,
				{
					key: { text: 'What information does the update contain?' },
					value: { text: typeRadioOption(projectUpdate.type).text },
					actions: typeActions
				},
				{
					key: { text: 'Status' },
					value: { html: statusTag(projectUpdate.status) },
					actions: statusActions
				}
			]
		}
	};
}

/**
 * Re-order a list of statuses to the order they should be shown on the UI
 *
 * @param {string[]} statuses
 * @returns {string[]}
 */
export function sortStatuses(statuses) {
	// the order that statuses should show on radio buttons
	const viewOrder = [
		ProjectUpdate.Status.draft,
		ProjectUpdate.Status.readyToPublish,
		ProjectUpdate.Status.published,
		ProjectUpdate.Status.readyToUnpublish,
		ProjectUpdate.Status.unpublished,
		ProjectUpdate.Status.archived
	];
	const sorted = [];
	for (const status of viewOrder) {
		if (statuses.includes(status)) {
			sorted.push(status);
		}
	}
	return sorted;
}

/**
 * Returns a filter function for UI status options
 * This filters out statuses that shouldn't show on the UI
 *
 * @param {string} currentStatus
 * @returns {function(string): boolean}
 */
export function statusFilter(currentStatus) {
	// filter out any options that shouldn't be shown on the UI
	if (currentStatus === ProjectUpdate.Status.readyToPublish) {
		// you can't change an update to published from the status page
		// that happens on the check answers page
		// instead it'd be set to Ready to Publish
		return (status) => status !== ProjectUpdate.Status.published;
	} else if (currentStatus === ProjectUpdate.Status.readyToUnpublish) {
		// you can't change an update to unpublished from the status page
		// that happens on the check answers page
		// instead it'd be set to Ready to Unpublish
		return (status) => status !== ProjectUpdate.Status.unpublished;
	}
	return () => true;
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
			text = 'Ready to publish';
			break;
		case ProjectUpdate.Status.published:
			text = 'Published';
			break;
		case ProjectUpdate.Status.archived:
			text = 'Archived';
			break;
		case ProjectUpdate.Status.readyToUnpublish:
			text = 'Unpublish';
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

/**
 * Return the govukRadio options for the given type
 *
 * @param {string} type
 * @returns {{text: string, value: string}}
 */
export function typeRadioOption(type) {
	let text = type;
	switch (type) {
		case ProjectUpdate.Type.general:
			text = 'General';
			break;
		case ProjectUpdate.Type.applicationSubmitted:
			text = 'The application has been submitted';
			break;
		case ProjectUpdate.Type.registrationOpen:
			text = 'Register to have your say has opened';
			break;
		case ProjectUpdate.Type.applicationDecided:
			text = 'The final decision has been issued';
			break;
	}
	return {
		text,
		value: type
	};
}
