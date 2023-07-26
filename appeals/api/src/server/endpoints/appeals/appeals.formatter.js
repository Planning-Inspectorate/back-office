import formatAddress from '#utils/format-address.js';
import { DOCUMENT_STATUS_NOT_RECEIVED, DOCUMENT_STATUS_RECEIVED } from '../constants.js';
import isFPA from '#utils/is-fpa.js';
import formatLinkedAppeals from '#utils/format-linked-appeals.js';
import formatNeighbouringSiteContacts from '#utils/format-neighbouring-site-contacts.js';

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
	localPlanningDepartment: appeal.localPlanningDepartment
});

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @returns {SingleAppealDetailsResponse | void}}
 */
const formatAppeal = (appeal) => {
	if (appeal) {
		return {
			agentName: appeal.appellant?.agentName,
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
			appealTimetable: {
				lpaQuestionnaireDueDate: appeal.appealTimetable?.lpaQuestionnaireDueDate || null,
				...(isFPA(appeal.appealType) && {
					finalCommentReviewDate: appeal.appealTimetable?.finalCommentReviewDate || null,
					statementReviewDate: appeal.appealTimetable?.statementReviewDate || null
				})
			},
			appealType: appeal.appealType?.type,
			appellantCaseId: appeal.appellantCase?.id,
			appellantName: appeal.appellant?.name,
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
			localPlanningDepartment: appeal.localPlanningDepartment,
			lpaQuestionnaireId: appeal.lpaQuestionnaire?.id || null,
			neighbouringSite: {
				contacts:
					formatNeighbouringSiteContacts(appeal.lpaQuestionnaire?.neighbouringSiteContact) || null,
				isAffected: appeal.lpaQuestionnaire?.isAffectingNeighbouringSites || null
			},
			otherAppeals: formatLinkedAppeals(appeal.otherAppeals, appeal.id),
			planningApplicationReference: appeal.planningApplicationReference,
			procedureType: appeal.lpaQuestionnaire?.procedureType?.name || null,
			siteVisit: {
				visitDate: appeal.siteVisit?.visitDate || null,
				visitType: appeal.siteVisit?.siteVisitType?.name || null
			},
			startedAt: appeal.startedAt,
			documentationSummary: {
				appellantCase: {
					status: appeal.appellantCase ? DOCUMENT_STATUS_RECEIVED : DOCUMENT_STATUS_NOT_RECEIVED,
					dueDate: null
				},
				lpaQuestionnaire: {
					status: appeal.lpaQuestionnaire ? DOCUMENT_STATUS_RECEIVED : DOCUMENT_STATUS_NOT_RECEIVED,
					dueDate: appeal.appealTimetable?.lpaQuestionnaireDueDate || null
				}
			}
		};
	}
};

export { formatAppeal, formatAppeals };
