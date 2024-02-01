import { appealShortReference } from '#lib/appeals-formatter.js';
import config from '@pins/appeals.web/environment/config.js';
import * as displayPageFormatter from '#lib/display-page-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';

/**
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 */
/**
 * @typedef {import('./issue-decision.types.js').InspectorDecisionRequest} InspectorDecisionRequest
 */

/**
 *
 * @param {Appeal} appealDetails
 * @param {InspectorDecisionRequest} inspectorDecision
 * @returns {PageContent}
 */
export function issueDecisionPage(appealDetails, inspectorDecision) {
	/** @type {PageComponent} */
	const selectVisitTypeComponent = {
		type: 'radios',
		parameters: {
			name: 'decision',
			fieldset: {
				legend: {
					text: 'Issue your decision',
					classes: 'govuk-fieldset__legend--m'
				}
			},
			items: [
				{
					value: 'Allowed',
					text: 'Allowed',
					checked: inspectorDecision?.outcome === 'Allowed'
				},
				{
					value: 'Dismissed',
					text: 'Dismissed',
					checked: inspectorDecision?.outcome === 'Dismissed'
				},
				{
					value: 'Split',
					text: 'Split Decision',
					checked: inspectorDecision?.outcome === 'Split-decision'
				}
			]
		}
	};

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `What is the decision? - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'What is the decision?',
		pageComponents: [selectVisitTypeComponent]
	};

	return pageContent;
}

/**
 * @param {Appeal} appealData
 * @param {number|undefined} folderId
 * @param {string} folderPath
 * @param {string} appealId
 * @param {import('@pins/express').ValidationErrors|undefined} errors
 * @returns {import('#appeals/appeal-documents/appeal-documents.types.js').DocumentUploadPageParameters}
 */
export function decisionLetterUploadPage(appealData, folderId, folderPath, appealId, errors) {
	const pathComponents = folderPath.split('/');
	const documentStage = pathComponents[0];
	const documentType = pathComponents[1];
	const shortAppealReference = appealShortReference(appealData.appealReference);

	return {
		backButtonUrl: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision`,
		appealId,
		folderId: `${folderId}`,
		useBlobEmulator: config.useBlobEmulator,
		blobStorageHost:
			config.useBlobEmulator === true ? config.blobEmulatorSasUrl : config.blobStorageUrl,
		blobStorageContainer: config.blobStorageDefaultContainer,
		multiple: false,
		documentStage: documentStage,
		pageTitle: `Appeal ${shortAppealReference}`,
		pageHeadingText: 'Upload your decision letter',
		caseInfoText: `Appeal ${shortAppealReference}`,
		documentType: documentType,
		nextPageUrl: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision-letter-date`,
		errors
	};
}

/**
 *
 * @param {Appeal} appealData
 * @param {string} decisionLetterDay
 * @param {string} decisionLetterMonth
 * @param {string} decisionLetterYear
 * @returns {PageContent}
 */
export function dateDecisionLetterPage(
	appealData,
	decisionLetterDay,
	decisionLetterMonth,
	decisionLetterYear
) {
	const title = `Tell us the date on your decision letter`;

	/** @type {PageComponent} */
	const selectDateComponent = {
		type: 'date-input',
		parameters: {
			id: 'decision-letter-date',
			namePrefix: 'decision-letter-date',
			fieldset: {
				legend: {
					text: '',
					classes: 'govuk-fieldset__legend--m'
				}
			},
			hint: {
				text: 'For example, 27 3 2023'
			},
			items: [
				{
					classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
					name: 'day',
					value: decisionLetterDay || ''
				},
				{
					classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
					name: 'month',
					value: decisionLetterMonth || ''
				},
				{
					classes: 'govuk-input govuk-date-input__input govuk-input--width-4',
					name: 'year',
					value: decisionLetterYear || ''
				}
			]
		}
	};

	return {
		title,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision-letter-upload`,
		backLinkText: 'Back',
		preHeading: `Appeal ${appealShortReference(appealData.appealReference)}`,
		heading: title,
		pageComponents: [selectDateComponent]
	};
}

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {Appeal} appealData
 * @param  {import('./issue-decision.types.js').InspectorDecisionRequest} session
 * @param {import('@pins/appeals.api').Schema.Folder|undefined} decisionLetterFolder
 * @returns {PageContent}
 */
export function checkAndConfirmPage(request, appealData, session, decisionLetterFolder) {
	const decisionOutcome = mapDecisionOutcome(session?.outcome);
	const letterDate = session && session.letterDate ? new Date(session.letterDate) : null;
	const decisionDateText = letterDate
		? `${letterDate.getDate()} ${letterDate.toLocaleString('default', {
				month: 'long'
		  })} ${letterDate.getFullYear()}`
		: '';

	/** @type {PageComponent} */
	const summaryListComponent = {
		type: 'summary-list',
		parameters: {
			rows: [
				{
					key: {
						text: 'Decision'
					},
					value: {
						text: decisionOutcome
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision`
							}
						]
					}
				},
				{
					key: {
						text: 'Decision letter'
					},
					value: displayPageFormatter.formatFolderValues(appealData.appealId, decisionLetterFolder),
					actions: {
						items: [
							{
								text: 'Change',
								href: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision-letter-upload`
							}
						]
					}
				},
				{
					key: {
						text: 'Decision date'
					},
					value: {
						text: decisionDateText
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision-letter-date`
							}
						]
					}
				}
			]
		}
	};

	/** @type {PageComponent} */
	const insetHtmlComponent = {
		type: 'html',
		parameters: {
			html: `<div class="govuk-warning-text"><span class="govuk-warning-text__icon" aria-hidden="true">!</span>
					<strong class="govuk-warning-text__text">
						<span class="govuk-warning-text__assistive">Warning</span> You are about to send the decision to all parties and close the appeal. Please make sure you have reviewed the decision information
					</strong>
				</div>`
		}
	};

	/** @type {PageComponent} */
	const insetConfirmComponent = {
		type: 'html',
		parameters: {
			html: `<div class="govuk-checkboxes__item govuk-!-margin-bottom-5">
					<input class="govuk-checkboxes__input" id="ready-to-send" name="ready-to-send" type="checkbox" value="Yes">
					<label class="govuk-label govuk-checkboxes__label" for="ready-to-send">This decision is ready to be sent to all parties</label>
				</div>`
		}
	};

	const title = 'Check your answers';
	const pageContent = {
		title,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision-letter-date`,
		backLinkText: 'Back',
		preHeading: `Appeal ${appealShortReference(appealData.appealReference)}`,
		heading: title,
		submitButtonText: 'Submit this decision',
		pageComponents: [summaryListComponent, insetHtmlComponent, insetConfirmComponent]
	};

	if (pageContent.pageComponents) {
		preRenderPageComponents(pageContent.pageComponents);
	}

	return pageContent;
}

/**
 *
 * @param {Appeal} appealData
 * @returns {ConfirmationPageContent}
 */
export function decisionConfirmationPage(appealData) {
	/** @type {ConfirmationPageContent} */
	const confirmationPage = {
		pageTitle: 'Decision sent',
		panel: {
			title: 'Decision sent',
			appealReference: {
				label: 'Appeal reference',
				reference: appealData.appealReference
			}
		},
		body: {
			preHeading: 'We have sent the decision to the relevant appeal parties.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: 'The appeal will be closed.'
				},
				{
					text: 'Back to your list',
					href: '/appeals-service/appeals-list'
				}
			]
		}
	};

	return confirmationPage;
}

/**
 * Checks if the given outcome is a valid InspectorDecisionRequest and returns the corresponding mapped value.
 * @param {string | undefined} outcome The outcome to check.
 * @returns {string} The mapped decision string, or a default value if the outcome is invalid or undefined.
 */
export function mapDecisionOutcome(outcome) {
	switch (outcome?.toLowerCase()) {
		case 'allowed':
			return 'Allowed';
		case 'dismissed':
			return 'Dismissed';
		case 'split':
			return 'Split decision';
		default:
			return '';
	}
}
