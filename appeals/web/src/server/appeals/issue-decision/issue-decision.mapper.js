import { appealShortReference } from '#lib/appeals-formatter.js';
import { getFileInfo } from '#appeals/appeal-documents/appeal.documents.service.js';
/**
 * @typedef {import('../appeal-details/appeal-details.types.js').WebAppeal} Appeal
 */
/**
 * @typedef {import('./issue-decision.types.d.ts').InspectorDecisionRequest} InspectorDecisionRequest
 */

/**
 *
 * @param {Appeal} appealDetails
 * @returns {Promise<PageContent>}
 */
export async function issueDecisionPage(appealDetails) {
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
					checked: appealDetails.decision?.outcome === 'Allowed'
				},
				{
					value: 'Dismissed',
					text: 'Dismissed',
					checked: appealDetails.decision?.outcome === 'Dismissed'
				},
				{
					value: 'Split',
					text: 'Split Decision',
					checked: appealDetails.decision?.outcome === 'Split-decision'
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
 *
 * @param {Appeal} appealData
 * @param {string} decisionLetterDay
 * @param {string} decisionLetterMonth
 * @param {string} decisionLetterYear
 * @returns {Promise<PageContent>}
 */
export async function dateDecisionLetterPage(
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
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision-letter-date`,
		backLinkText: 'Back',
		preHeading: `Appeal ${appealShortReference(appealData.appealReference)}`,
		heading: title,
		pageComponents: [selectDateComponent]
	};
}

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {Appeal} appealData
 * @param  {import('./issue-decision.types').InspectorDecisionRequest} session
 * @returns {Promise<PageContent>}
 */
export async function checkAndConfirmPage(request, appealData, session) {
	const title = 'Check your answers';

	const decisionOutcome = mapDecisionOutcome(session?.outcome);
	const letterDate = session && session.letterDate ? new Date(session.letterDate) : null;
	const decisionDateText = letterDate
		? `${letterDate.getDate()} ${letterDate.toLocaleString('default', {
				month: 'long'
		  })} ${letterDate.getFullYear()}`
		: '';

	var documentName, documentURI;
	if (session.documentId) {
		const fileInfo = await getFileInfo(
			request.apiClient,
			appealData.appealId.toString(),
			session.documentId
		);
		documentName = fileInfo?.latestDocumentVersion.fileName;
		documentURI = fileInfo?.latestDocumentVersion.documentURI;
	}

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
					value: {
						html: `<a href="${documentURI}" class="govuk-link">${documentName}</a>`
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

	return {
		title,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}/issue-decision/decision-letter-date`,
		backLinkText: 'Back',
		preHeading: `Appeal ${appealShortReference(appealData.appealReference)}`,
		heading: title,
		submitButtonText: 'Submit this decision',
		pageComponents: [summaryListComponent, insetHtmlComponent, insetConfirmComponent]
	};
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
	switch (outcome) {
		case 'allowed':
			return 'Allowed';
		case 'dismissed':
			return 'Dismissed';
		case 'split':
			return 'Split-decision';
		default:
			return '';
	}
}
