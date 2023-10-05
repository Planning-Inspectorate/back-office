import formatAddress from '#utils/format-address.js';
import isFPA from '#utils/is-fpa.js';
import formatLinkedAppeals from '#utils/format-linked-appeals.js';
import {
	formatAppellantCaseDocumentationStatus,
	formatLpaQuestionnaireDocumentationStatus
} from '#utils/format-documentation-status.js';

/** @typedef {import('@pins/appeals.api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/appeals.api').Appeals.AppealListResponse} AppealListResponse */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAppealDetailsResponse} SingleAppealDetailsResponse */

/**
 * @param {RepositoryGetAllResultItem} appeal
 * @returns {AppealListResponse}}
 */
const formatAppeals = (appeal) => ({
	appealId: appeal.id,
	appealReference: appeal.reference,
	appealSite: formatAddress(appeal.address),
	appealStatus: appeal.appealStatus[0].status,
	appealType: appeal.appealType?.type,
	createdAt: appeal.createdAt,
	localPlanningDepartment: appeal.lpa.lpaName
});

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns {SingleAppealDetailsResponse | void}}
 */
const formatAppeal = (appeal) => {
	if (appeal) {
		return {
			agentName: appeal.agent?.name,
			allocationDetails: appeal.allocation
				? {
						level: appeal.allocation.level,
						band: appeal.allocation.band,
						specialisms: appeal.specialisms?.map((s) => s.specialism?.name) || []
				  }
				: null,
			appealId: appeal.id,
			appealReference: appeal.reference,
			appealSite: formatAddress(appeal.address),
			appealStatus: appeal.appealStatus[0].status,
			appealTimetable: appeal.appealTimetable
				? {
						appealTimetableId: appeal.appealTimetable.id,
						lpaQuestionnaireDueDate: appeal.appealTimetable.lpaQuestionnaireDueDate || null,
						...(isFPA(appeal.appealType) && {
							finalCommentReviewDate: appeal.appealTimetable.finalCommentReviewDate || null,
							statementReviewDate: appeal.appealTimetable.statementReviewDate || null
						})
				  }
				: null,
			appealType: appeal.appealType?.type,
			appellantCaseId: appeal.appellantCase?.id,
			appellantName: appeal.appellant?.name,
			caseOfficer: appeal.caseOfficer?.azureAdUserId || null,
			decision: appeal.inspectorDecision?.outcome,
			healthAndSafety: {
				appellantCase: {
					details: appeal.appellantCase?.healthAndSafetyIssues || null,
					hasIssues: appeal.appellantCase?.hasHealthAndSafetyIssues || null
				},
				lpaQuestionnaire: {
					details: appeal.lpaQuestionnaire?.healthAndSafetyDetails || null,
					hasIssues: appeal.lpaQuestionnaire?.doesSiteHaveHealthAndSafetyIssues || null
				}
			},
			inspector: appeal.inspector?.azureAdUserId || null,
			inspectorAccess: {
				appellantCase: {
					details: appeal.appellantCase?.visibilityRestrictions || null,
					isRequired: !appeal.appellantCase?.isSiteVisibleFromPublicRoad
				},
				lpaQuestionnaire: {
					details: appeal.lpaQuestionnaire?.inspectorAccessDetails || null,
					isRequired: appeal.lpaQuestionnaire?.doesSiteRequireInspectorAccess || null
				}
			},
			isParentAppeal: appeal.linkedAppealId ? appeal.id === appeal.linkedAppealId : null,
			linkedAppeals: formatLinkedAppeals(appeal.linkedAppeals, appeal.id),
			localPlanningDepartment: appeal.lpa.lpaName,
			lpaQuestionnaireId: appeal.lpaQuestionnaire?.id || null,
			neighbouringSite: {
				contacts:
					appeal.lpaQuestionnaire?.neighbouringSiteContact?.map((contact) => ({
						address: formatAddress(contact.address),
						firstName: contact.firstName,
						lastName: contact.lastName
					})) || null,
				isAffected: appeal.lpaQuestionnaire?.isAffectingNeighbouringSites || null
			},
			otherAppeals: formatLinkedAppeals(appeal.otherAppeals, appeal.id),
			planningApplicationReference: appeal.planningApplicationReference,
			procedureType: appeal.lpaQuestionnaire?.procedureType?.name || null,
			siteVisit: {
				siteVisitId: appeal.siteVisit?.id || null,
				visitDate: appeal.siteVisit?.visitDate || null,
				visitStartTime: appeal.siteVisit?.visitStartTime || null,
				visitEndTime: appeal.siteVisit?.visitEndTime || null,
				visitType: appeal.siteVisit?.siteVisitType?.name || null
			},
			startedAt: appeal.startedAt,
			documentationSummary: {
				appellantCase: {
					status: formatAppellantCaseDocumentationStatus(appeal),
					dueDate: appeal.dueDate
				},
				lpaQuestionnaire: {
					status: formatLpaQuestionnaireDocumentationStatus(appeal),
					dueDate: appeal.appealTimetable?.lpaQuestionnaireDueDate || null
				}
			}
		};
	}
};

export { formatAppeal, formatAppeals };
