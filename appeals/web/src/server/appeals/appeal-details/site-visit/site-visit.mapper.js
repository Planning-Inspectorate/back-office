import config from '#environment/config.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';

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
 *
 * @param {*} data
 * @param {string} currentRoute
 * @param {import('../../../app/auth/auth-session.service').SessionWithAuth} session
 * @returns {Promise<(SummaryListRowProperties|undefined)[]>}
 */
export async function buildSiteDetailsSummaryListRows(data, currentRoute, session) {
	const mappedData = await initialiseAndMapAppealData(data, currentRoute, session);

	/**
	 * @type {(SummaryListRowProperties | undefined)[]}
	 */
	const neighbouringSitesSummaryLists = Object.keys(mappedData.appeal)
		.filter((key) => key.indexOf('neighbouringSiteAddress') >= 0)
		.map((key) => mappedData.appeal[key].display.summaryListItem);

	const rows = [
		mappedData.appeal.siteAddress.display.summaryListItem,
		mappedData.appeal.lpaHealthAndSafety.display.summaryListItem,
		mappedData.appeal.appellantHealthAndSafety.display.summaryListItem,
		...neighbouringSitesSummaryLists
	];

	rows.forEach((row) => removeActions(row));

	return rows;
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
						rows: [
							mappedData.appeal.siteAddress.display.summaryListItem,
							mappedData.appeal.lpaHealthAndSafety.display.summaryListItem,
							mappedData.appeal.appellantHealthAndSafety.display.summaryListItem
						]
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
			opening: '<h2>Select a time</h2><p class="govuk-body">Time is optional for unaccompanied site visits</p><p class="govuk-body">Enter a time, for example 9:00 or 16:30</p><fieldset class="govuk-fieldset"><legend class="govuk-fieldset__legend govuk-fieldset__legend--s">Start time</legend>', // TODO: this is hacky af - need a PageComponent type for basic body html elements like p, headings etc.
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
			opening: '<fieldset class="govuk-fieldset"><legend class="govuk-fieldset__legend govuk-fieldset__legend--s">End time</legend>',
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

	/** @type {PageContent} */
	const pageContent = {
		title: `Schedule site visit - ${appealDetails.appealId}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${appealShortReference(appealDetails.appealReference)}`,
		heading: 'Schedule site visit',
		pageComponents: [
			siteInformationComponent,
			selectVisitTypeComponent,
			selectDateComponent,
			selectStartTimeComponent,
			selectEndTimeComponent
		]
	};

	if (!session.account.idTokenClaims.groups.includes(
		config.referenceData.appeals.caseOfficerGroupId
	)) {
		pageContent.pageComponents.forEach((component) => {
			if ('rows' in component.parameters && Array.isArray(component.parameters.rows)) {
				component.parameters.rows = component.parameters.rows.map(row => removeActions(row));
			}
		});
	}

	// TODO: appeal-details.mapper.js does this slightly differently (build array, prerender, then assign to pageContent.pageComponents) - don't think it matters, but check to make sure
	preRenderPageComponents(pageContent.pageComponents);

	return pageContent;
}
