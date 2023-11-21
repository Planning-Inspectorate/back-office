import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';
import { isDefined } from '#lib/ts-utilities.js';

/**
 * @typedef {'unaccompanied'|'accompanied'|'accessRequired'} WebSiteVisitType
 * @typedef {import('@pins/appeals.api').Appeals.SingleAppealDetailsResponse} Appeal
 * @typedef {string|null} GetApiVisitType
 */

/**
 *
 * @param {WebSiteVisitType} webVisitType
 * @returns {import('@pins/appeals/types/inspector.js').SiteVisitType}
 */
export function mapWebVisitTypeToApiVisitType(webVisitType) {
	switch (webVisitType) {
		case 'accessRequired':
			return 'access required';
		default:
			return webVisitType;
	}
}
/**
 *
 * @param {GetApiVisitType} getApiVisitType
 * @returns {WebSiteVisitType | null}
 */
export function mapGetApiVisitTypeToWebVisitType(getApiVisitType) {
	switch (getApiVisitType) {
		case 'Unaccompanied':
			return 'unaccompanied';
		case 'Access required':
			return 'accessRequired';
		case 'Accompanied':
			return 'accompanied';
		default:
			return null;
	}
}

/**
 * @param {Appeal} appealDetails
 * @param {string} currentRoute
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {WebSiteVisitType|null|undefined} visitType
 * @param {string|null|undefined} visitDateDay
 * @param {string|null|undefined} visitDateMonth
 * @param {string|null|undefined} visitDateYear
 * @param {string|null|undefined} visitStartTimeHour
 * @param {string|null|undefined} visitStartTimeMinute
 * @param {string|null|undefined} visitEndTimeHour
 * @param {string|null|undefined} visitEndTimeMinute
 * @returns {Promise<PageContent>}
 */
export async function scheduleSiteVisitPage (
	appealDetails,
	currentRoute,
	session,
	visitType,
	visitDateDay,
	visitDateMonth,
	visitDateYear,
	visitStartTimeHour,
	visitStartTimeMinute,
	visitEndTimeHour,
	visitEndTimeMinute
) {
	const mappedData = await initialiseAndMapAppealData(appealDetails, currentRoute, session);

	visitType ??= mapGetApiVisitTypeToWebVisitType(appealDetails.siteVisit.visitType);
	visitDateDay ??= appealDetails.siteVisit?.visitDate
		? new Date(appealDetails.siteVisit?.visitDate).getDate().toString()
		: undefined;
	visitDateMonth ??= appealDetails.siteVisit?.visitDate
		? (new Date(appealDetails.siteVisit?.visitDate).getMonth() + 1).toString()
		: undefined;
	visitDateYear ??= appealDetails.siteVisit?.visitDate
		? new Date(appealDetails.siteVisit?.visitDate).getFullYear().toString()
		: undefined;
	visitStartTimeHour ??= appealDetails.siteVisit?.visitStartTime
		? (appealDetails.siteVisit?.visitStartTime.split(':')[0])?.toString()
		: undefined;
	visitStartTimeMinute ??= appealDetails.siteVisit?.visitStartTime
		? (appealDetails.siteVisit?.visitStartTime.split(':')[1])?.toString()
		: undefined;
	visitEndTimeHour ??= appealDetails.siteVisit?.visitEndTime
		? (appealDetails.siteVisit?.visitEndTime.split(':')[0])?.toString()
		: undefined;
	visitEndTimeMinute ??= appealDetails.siteVisit?.visitEndTime
		? (appealDetails.siteVisit?.visitEndTime.split(':')[1])?.toString()
		: undefined;

	/**
	 * @type {(SummaryListRowProperties)[]}
	 */
	const neighbouringSitesSummaryLists = Object.keys(mappedData.appeal)
		.filter((key) => key.indexOf('neighbouringSiteAddress') >= 0)
		.map((key) => mappedData.appeal[key].display.summaryListItem)
		.filter(isDefined);

	/** @type {PageComponent} */
	const siteInformationComponent = {
		type: 'details',
		parameters: {
			summaryText: 'Site information',
			html: '',
			pageComponents: [
				{
					type: 'summary-list',
					parameters: {
						classes: 'govuk-summary-list--no-border',
						rows: [
							mappedData.appeal.siteAddress.display.summaryListItem,
							mappedData.appeal.lpaHealthAndSafety.display.summaryListItem,
							mappedData.appeal.appellantHealthAndSafety.display.summaryListItem,
							...neighbouringSitesSummaryLists
						].map(row => removeActions(row))
					}
				}
			]
		}
	};

	/** @type {PageComponent} */
	const selectVisitTypeComponent = {
		type: 'radios',
		parameters: {
			name: 'visit-type',
			id: 'visit-type',
			fieldset: {
				legend: {
					text: 'Select visit type',
					classes: 'govuk-fieldset__legend--m'
				}
			},
			value: visitType,
			items: [
				{
					value: 'unaccompanied',
					text: 'Unaccompanied'
				},
				{
					value: 'accessRequired',
					text: 'Access Required'
				},
				{
					value: 'accompanied',
					text: 'Accompanied'
				}
			]
		}
	};

	/** @type {PageComponent} */
	const selectDateComponent = {
		type: 'date-input',
		parameters: {
			id: 'visit-date',
			namePrefix: 'visit-date',
			fieldset: {
				legend: {
					text: 'Select a date',
					classes: 'govuk-fieldset__legend--m'
				}
			},
			hint: {
				text: 'For example, 27 3 2023'
			},
			items: [
				{
					classes: "govuk-input govuk-date-input__input govuk-input--width-2",
					name: "day",
					value: visitDateDay || ''
				},
				{
					classes: "govuk-input govuk-date-input__input govuk-input--width-2",
					name: "month",
					value: visitDateMonth || ''
				},
				{
					classes: "govuk-input govuk-date-input__input govuk-input--width-4",
					name: "year",
					value: visitDateYear || ''
				}
			]
		}
	};

	/** @type {PageComponent} */
	const selectStartTimeComponent = {
		type: 'time-input',
		wrapperHtml: {
			opening: '<fieldset class="govuk-fieldset govuk-!-margin-bottom-4"><legend class="govuk-fieldset__legend govuk-fieldset__legend--s">Start time</legend>',
			closing: '</fieldset>'
		},
		parameters: {
			id: 'visit-start-time',
			hour: {
				value: visitStartTimeHour,
			},
			minute: {
				value: visitStartTimeMinute
			}
		}
	};

	/** @type {PageComponent} */
	const selectEndTimeComponent = {
		type: 'time-input',
		wrapperHtml: {
			opening: '<fieldset class="govuk-fieldset govuk-!-margin-bottom-6"><legend class="govuk-fieldset__legend govuk-fieldset__legend--s">End time</legend>',
			closing: '</fieldset>'
		},
		parameters: {
			id: 'visit-end-time',
			hour: {
				value: visitEndTimeHour,
			},
			minute: {
				value: visitEndTimeMinute
			}
		}
	};

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Schedule site visit - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Schedule site visit',
		pageComponents: [
			siteInformationComponent,
			selectVisitTypeComponent,
			selectDateComponent,
			selectStartTimeComponent,
			selectEndTimeComponent
		]
	};

	preRenderPageComponents(pageContent.pageComponents);

	return pageContent;
}

/**
 * @param {Appeal} appealDetails
 * @param {string|undefined} visitType
 * @returns {PageContent}
 */
export function setVisitTypePage (appealDetails, visitType) {
	/** @type {PageComponent} */
	const selectVisitTypeComponent = {
		type: 'radios',
		parameters: {
			name: 'visit-type',
			fieldset: {
				legend: {
					text: 'Select visit type',
					classes: 'govuk-fieldset__legend--m'
				}
			},
			items: [
				{
					value: 'unaccompanied',
					text: 'Unaccompanied',
					checked: visitType === 'unaccompanied'
				},
				{
					value: 'accessRequired',
					text: 'Access required',
					checked: visitType === 'accessRequired'
				},
				{
					value: 'accompanied',
					text: 'Accompanied',
					checked: visitType === 'accompanied'
				}
			]
		}
	};

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Select site visit type - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Select site visit type',
		pageComponents: [selectVisitTypeComponent]
	};

	return pageContent;
}
