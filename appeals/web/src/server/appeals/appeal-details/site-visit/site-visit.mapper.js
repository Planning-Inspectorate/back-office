import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';
import { isDefined } from '#lib/ts-utilities.js';
import { capitalize } from 'lodash-es';
import { dateToDisplayDate } from '#lib/dates.js';

/**
 * @typedef {'unaccompanied'|'accompanied'|'accessRequired'} WebSiteVisitType
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 * @typedef {string|null|undefined} ApiVisitType
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
 * @param {ApiVisitType} getApiVisitType
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
 * @param {'schedule' | 'manage'} pageType
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
export async function scheduleOrManageSiteVisitPage(
	pageType,
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
	const titlePrefix = capitalize(pageType);

	visitType ??= mapGetApiVisitTypeToWebVisitType(appealDetails.siteVisit?.visitType);
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
		? appealDetails.siteVisit?.visitStartTime.split(':')[0]?.toString()
		: undefined;
	visitStartTimeMinute ??= appealDetails.siteVisit?.visitStartTime
		? appealDetails.siteVisit?.visitStartTime.split(':')[1]?.toString()
		: undefined;
	visitEndTimeHour ??= appealDetails.siteVisit?.visitEndTime
		? appealDetails.siteVisit?.visitEndTime.split(':')[0]?.toString()
		: undefined;
	visitEndTimeMinute ??= appealDetails.siteVisit?.visitEndTime
		? appealDetails.siteVisit?.visitEndTime.split(':')[1]?.toString()
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
						].map((row) => removeActions(row))
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
					classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
					name: 'day',
					value: visitDateDay || ''
				},
				{
					classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
					name: 'month',
					value: visitDateMonth || ''
				},
				{
					classes: 'govuk-input govuk-date-input__input govuk-input--width-4',
					name: 'year',
					value: visitDateYear || ''
				}
			]
		}
	};

	/** @type {PageComponent} */
	const selectStartTimeComponent = {
		type: 'time-input',
		wrapperHtml: {
			opening:
				'<fieldset class="govuk-fieldset govuk-!-margin-bottom-4"><legend class="govuk-fieldset__legend govuk-fieldset__legend--s">Start time</legend>',
			closing: '</fieldset>'
		},
		parameters: {
			id: 'visit-start-time',
			hour: {
				value: visitStartTimeHour
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
			opening:
				'<fieldset class="govuk-fieldset govuk-!-margin-bottom-6"><legend class="govuk-fieldset__legend govuk-fieldset__legend--s">End time</legend>',
			closing: '</fieldset>'
		},
		parameters: {
			id: 'visit-end-time',
			hour: {
				value: visitEndTimeHour
			},
			minute: {
				value: visitEndTimeMinute
			}
		}
	};

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `${titlePrefix} site visit - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: `${titlePrefix} site visit`,
		pageComponents: [
			siteInformationComponent,
			selectVisitTypeComponent,
			selectDateComponent,
			selectStartTimeComponent,
			selectEndTimeComponent
		]
	};

	if (pageContent.pageComponents) {
		preRenderPageComponents(pageContent.pageComponents);
	}

	return pageContent;
}

/**
 * @typedef {'new'|'unchanged'|'visit-type'|'date-time'|'all'} SiteVisitConfirmationPageType
 */

/**
 * @param {string} pageType
 * @returns {pageType is SiteVisitConfirmationPageType}
 */
export function stringIsSiteVisitConfirmationPageType(pageType) {
	return (
		pageType === 'new' ||
		pageType === 'unchanged' ||
		pageType === 'visit-type' ||
		pageType === 'date-time' ||
		pageType === 'all'
	);
}

/**
 * @param {SiteVisitConfirmationPageType} pageType
 * @param {import('@pins/appeals.api/src/server/endpoints/appeals.js').SingleSiteVisitDetailsResponse} siteVisit
 * @param {Appeal} appealDetails
 * @returns {ConfirmationPageContent}
 */
export function scheduleOrManageSiteVisitConfirmationPage(pageType, siteVisit, appealDetails) {
	const formattedSiteVisitType = siteVisit.visitType.toLowerCase();
	const formattedSiteAddress = appealDetails?.appealSite
		? Object.values(appealDetails?.appealSite)?.join(', ')
		: 'Address not known';
	const formattedSiteVisitDate = dateToDisplayDate(siteVisit.visitDate);

	const timeText =
		siteVisit.visitStartTime && siteVisit.visitEndTime
			? `, between ${siteVisit.visitStartTime} and ${siteVisit.visitEndTime}`
			: '';

	let title;
	let preHeading;
	const bodyTitleTextForChangedPageTypes = 'What happens next';
	let bodyTitleText;
	let bodyRows = [];
	const backToCaseDetailsBodyRow = {
		text: 'Go back to case details',
		href: `/appeals-service/appeal-details/${appealDetails.appealId}`
	};

	switch (pageType) {
		case 'new':
			title = 'Site visit booked';
			preHeading = `Your ${formattedSiteVisitType} site visit at ${formattedSiteAddress} is booked for ${formattedSiteVisitDate}${timeText}.`;
			bodyTitleText = bodyTitleTextForChangedPageTypes;
			bodyRows = [
				{
					text: `We updated the case timetable.${
						formattedSiteVisitType !== 'unaccompanied'
							? ` We've sent an email to the LPA and appellant to confirm the site visit.`
							: ''
					}`
				},
				backToCaseDetailsBodyRow
			];
			break;
		case 'unchanged':
			title = 'No changes were made';
			bodyRows = [
				{
					text: `The original details still apply.`
				},
				{
					text: `No emails have been sent to the parties.`
				},
				backToCaseDetailsBodyRow
			];
			break;
		case 'visit-type':
			title = 'Site visit type changed';
			preHeading = `The visit type is now changed to ${formattedSiteVisitType}. Your site visit at ${formattedSiteAddress} is still scheduled for ${formattedSiteVisitDate}${timeText}.`;
			bodyTitleText = bodyTitleTextForChangedPageTypes;
			bodyRows = [
				{
					text: `We updated the case timetable.${
						formattedSiteVisitType !== 'unaccompanied'
							? ` We've sent an email to the LPA and appellant to confirm the changes to the site visit.`
							: ''
					}`
				},
				backToCaseDetailsBodyRow
			];
			break;
		case 'date-time':
			title = 'Site visit rescheduled';
			preHeading = `Your ${formattedSiteVisitType} site visit at ${formattedSiteAddress} is rescheduled for ${formattedSiteVisitDate}${timeText}.`;
			bodyTitleText = bodyTitleTextForChangedPageTypes;
			bodyRows = [
				{
					text: `We updated the case timetable.${
						formattedSiteVisitType !== 'unaccompanied'
							? ` We've sent an email to the LPA and appellant to confirm the site visit.`
							: ''
					}`
				},
				backToCaseDetailsBodyRow
			];
			break;
		case 'all':
		default:
			title = 'Site visit changed';
			preHeading = `Your site visit at ${formattedSiteAddress} is rescheduled for ${formattedSiteVisitDate}${timeText}. The site visit type is now changed to ${formattedSiteVisitType}.`;
			bodyTitleText = bodyTitleTextForChangedPageTypes;
			bodyRows = [
				{
					text: `We updated the case timetable.${
						formattedSiteVisitType !== 'unaccompanied'
							? ` We've sent an email to the LPA and appellant to confirm the changes to the site visit.`
							: ''
					}`
				},
				backToCaseDetailsBodyRow
			];
			break;
	}

	return {
		pageTitle: title,
		panel: {
			title,
			appealReference: {
				label: 'Appeal ID',
				reference: appealShortReference(appealDetails?.appealReference) || ''
			}
		},
		body: {
			...(preHeading && {
				preHeading: preHeading || ''
			}),
			...(bodyTitleText && {
				title: {
					text: bodyTitleText || ''
				}
			}),
			rows: bodyRows
		}
	};
}

/**
 * @param {Appeal} appealDetails
 * @param {string|undefined} visitType
 * @returns {PageContent}
 */
export function setVisitTypePage(appealDetails, visitType) {
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
