import config from '#environment/config.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { buildNotificationBanners } from '#lib/mappers/notification-banners.mapper.js';
import { isDefined } from '#lib/ts-utilities.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import {
	mapDocumentDownloadUrl,
	mapVirusCheckStatus
} from '#appeals/appeal-documents/appeal-documents.mapper.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';

export const pageHeading = 'Case details';

/**
 * @param {import('./appeal-details.types.js').WebAppeal} appealDetails
 * @param {string} currentRoute
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns {Promise<PageContent>}
 */
export async function appealDetailsPage(appealDetails, currentRoute, session) {
	const mappedData = await initialiseAndMapAppealData(appealDetails, currentRoute, session);
	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Case details - ${shortAppealReference}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Case details',
		pageComponents: []
	};

	/** @type {PageComponent|undefined} */
	let statusTag;

	if (mappedData.appeal.appealStatus.display?.statusTag) {
		statusTag = {
			type: 'status-tag',
			parameters: {
				...mappedData.appeal.appealStatus.display.statusTag
			}
		};
	}

	/** @type {PageComponent} */
	const caseSummary = {
		type: 'summary-list',
		parameters: {
			rows: [
				removeActions(mappedData.appeal.siteAddress.display.summaryListItem),
				removeActions(mappedData.appeal.localPlanningAuthority.display.summaryListItem)
			].filter(isDefined),
			classes: 'govuk-summary-list--no-border'
		}
	};

	/** @type {PageComponent} */
	const caseOverview = {
		type: 'summary-list',
		parameters: {
			rows: [
				mappedData.appeal.appealType.display.summaryListItem,
				mappedData.appeal?.caseProcedure?.display.summaryListItem,
				mappedData.appeal?.linkedAppeals?.display.summaryListItem,
				mappedData.appeal?.otherAppeals?.display.summaryListItem,
				mappedData.appeal?.allocationDetails?.display.summaryListItem,
				removeActions(mappedData.appeal?.lpaReference?.display.summaryListItem),
				mappedData.appeal?.decision?.display.summaryListItem
			].filter(isDefined)
		}
	};

	const neighbouringSitesSummaryLists = Object.keys(mappedData.appeal)
		.filter((key) => key.indexOf('neighbouringSiteAddress') >= 0)
		.map((key) => mappedData.appeal[key].display.summaryListItem)
		.filter(isDefined);

	/** @type {PageComponent} */
	const siteDetails = {
		type: 'summary-list',
		parameters: {
			rows: [
				mappedData.appeal.lpaInspectorAccess.display.summaryListItem,
				mappedData.appeal.appellantInspectorAccess.display.summaryListItem,
				mappedData.appeal.neighbouringSiteIsAffected.display.summaryListItem,
				...neighbouringSitesSummaryLists,
				mappedData.appeal.lpaHealthAndSafety.display.summaryListItem,
				mappedData.appeal.appellantHealthAndSafety.display.summaryListItem,
				mappedData.appeal.visitType.display.summaryListItem
			].filter(isDefined)
		}
	};

	/** @type {PageComponent} */
	const caseTimetable = appealDetails.startedAt
		? {
				type: 'summary-list',
				parameters: {
					rows: [
						mappedData.appeal.startedAt.display.summaryListItem,
						mappedData.appeal.lpaQuestionnaireDueDate.display.summaryListItem,
						mappedData.appeal.siteVisitDate.display.summaryListItem,
						...(appealDetails.appealType === 'Full planning'
							? [
									mappedData.appeal.issueDeterminationDate?.display.summaryListItem,
									mappedData.appeal.completeDate?.display.summaryListItem
							  ]
							: [])
					].filter(isDefined)
				}
		  }
		: {
				type: 'inset-text',
				parameters: {
					html: `<p class="govuk-body">Case not started</p><a href="/appeals-service/appeal-details/${appealDetails.appealId}/appellant-case" class="govuk-link">Review appeal</a>`
				}
		  };

	/** @type {PageComponent} */
	const caseDocumentation = {
		type: 'table',
		parameters: {
			head: [
				{ text: 'Documentation' },
				{ text: 'Status' },
				{ text: 'Due date' },
				{ text: 'Action' }
			],
			rows: [
				mappedData.appeal.appellantCase.display.tableItem,
				mappedData.appeal.lpaQuestionnaire.display.tableItem
			].filter(isDefined),
			firstCellIsHeader: true
		}
	};

	/** @type {PageComponent} */
	const caseContacts = {
		type: 'summary-list',
		parameters: {
			rows: [
				mappedData.appeal.appellant.display.summaryListItem,
				mappedData.appeal.agent.display.summaryListItem,
				mappedData.appeal.localPlanningAuthority.display.summaryListItem
			].filter(isDefined)
		}
	};

	/** @type {PageComponent} */
	const caseTeam = {
		type: 'summary-list',
		parameters: {
			rows: [
				mappedData.appeal.caseOfficer.display.summaryListItem,
				mappedData.appeal.inspector.display.summaryListItem
			].filter(isDefined)
		}
	};

	if (
		!session.account.idTokenClaims.groups.includes(config.referenceData.appeals.caseOfficerGroupId)
	) {
		[
			caseSummary,
			caseOverview,
			siteDetails,
			caseTimetable,
			caseDocumentation,
			caseContacts,
			caseTeam
		].forEach((component) => removeActions(component));
	}

	/** @type {PageComponent} */
	const appealDetailsAccordion = {
		type: 'accordion',
		parameters: {
			id: 'accordion-default' + appealDetails.appealId,
			items: [
				{
					heading: { text: 'Case overview' },
					content: { html: '', pageComponents: [caseOverview] }
				},
				{
					heading: { text: 'Site details' },
					content: { html: '', pageComponents: [siteDetails] }
				},
				{
					heading: { text: 'Case timetable' },
					content: { html: '', pageComponents: [caseTimetable] }
				},
				{
					heading: { text: 'Case documentation' },
					content: { html: '', pageComponents: [caseDocumentation] }
				},
				{
					heading: { text: 'Case contacts' },
					content: { html: '', pageComponents: [caseContacts] }
				},
				{
					heading: { text: 'Case team' },
					content: { html: '', pageComponents: [caseTeam] }
				}
			]
		}
	};

	if (appealDetails.appealStatus === 'issue_determination') {
		const bannerHtml = `<p class="govuk-notification-banner__heading">The appeal is ready for a decision.</p><p class="govuk-notification-banner__heading"><a class="govuk-notification-banner__link" href="/appeals-service/appeal-details/${appealDetails.appealId}/issue-decision/decision">Issue a decision</a>.</p>`;
		addNotificationBannerToSession(session, 'readyForDecision', appealDetails.appealId, bannerHtml);
	}

	const notificationBanners = buildNotificationBanners(
		session,
		'appealDetails',
		appealDetails.appealId
	);

	const statusTagComponentGroup = statusTag ? [statusTag] : [];
	const isAppealComplete = appealDetails.appealStatus === 'complete';
	if (isAppealComplete && statusTagComponentGroup.length > 0 && appealDetails.decision.documentId) {
		const letterDate = appealDetails.decision?.letterDate
			? new Date(appealDetails.decision.letterDate)
			: new Date();

		const virusCheckStatus = mapVirusCheckStatus(
			appealDetails.decision.virusCheckStatus || 'not_checked'
		);
		const letterDownloadUrl = appealDetails.decision?.documentId
			? mapDocumentDownloadUrl(appealDetails.appealId, appealDetails.decision?.documentId)
			: '#';

		if (virusCheckStatus.checked && virusCheckStatus.safe) {
			statusTagComponentGroup.push({
				type: 'inset-text',
				parameters: {
					html: `<p>
						Appeal completed: ${letterDate.toLocaleDateString('en-gb', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})}
							</p>
							<p>Decision: ${appealDetails.decision?.outcome}</p>
							<p><a class="govuk-link" target="_blank" href="${letterDownloadUrl}">View decision letter</a></p>`
				}
			});
		} else {
			statusTagComponentGroup.push({
				type: 'inset-text',
				parameters: {
					html: `<p>
						Appeal completed: ${letterDate.toLocaleDateString('en-gb', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})}
							</p>
							<p>Decision: ${appealDetails.decision?.outcome}</p>
							<p><span class="govuk-body">View decision letter</span>
							<strong class="govuk-tag govuk-tag--yellow single-line">Virus scanning</strong></p>`
				}
			});
		}

		shortAppealReference;
	}

	const pageComponents = [
		...notificationBanners,
		...statusTagComponentGroup,
		caseSummary,
		appealDetailsAccordion
	];

	preRenderPageComponents(pageComponents);

	pageContent.pageComponents = pageComponents;

	return pageContent;
}
