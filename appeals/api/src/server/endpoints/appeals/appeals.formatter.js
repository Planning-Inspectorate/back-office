import formatAddress from '#utils/format-address.js';
import isFPA from '#utils/is-fpa.js';
import formatLinkedAppeals from '#utils/format-linked-appeals.js';
import {
	formatAppellantCaseDocumentationStatus,
	formatLpaQuestionnaireDocumentationStatus
} from '#utils/format-documentation-status.js';
import { add } from 'date-fns';
import {
	STATE_TARGET_FINAL_COMMENT_REVIEW,
	STATE_TARGET_STATEMENT_REVIEW,
	STATE_TARGET_ISSUE_DETERMINATION,
	STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
	STATE_TARGET_READY_TO_START,
	STATE_TARGET_ASSIGN_CASE_OFFICER,
	STATE_TARGET_COMPLETE
} from '#endpoints/constants.js';

const approxStageCompletion = {
	STATE_TARGET_READY_TO_START: 5,
	STATE_TARGET_LPA_QUESTIONNAIRE_DUE: 10,
	STATE_TARGET_ASSIGN_CASE_OFFICER: 15,
	STATE_TARGET_ISSUE_DETERMINATION: 30,
	STATE_TARGET_STATEMENT_REVIEW: 55,
	STATE_TARGET_FINAL_COMMENT_REVIEW: 60
};

/** @typedef {import('@pins/appeals.api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.AppealRelationship} AppealRelationship */
/** @typedef {import('@pins/appeals.api').Appeals.AppealListResponse} AppealListResponse */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAppealDetailsResponse} SingleAppealDetailsResponse */
/** @typedef {import('#db-client').AppealStatus} AppealStatus */
/**
 * @param {RepositoryGetAllResultItem} appeal
 * @param {AppealRelationship[]} linkedAppeals
 * @returns {AppealListResponse}}
 */
const formatAppeals = (appeal, linkedAppeals) => ({
	appealId: appeal.id,
	appealReference: appeal.reference,
	appealSite: formatAddress(appeal.address),
	appealStatus: appeal.appealStatus[0].status,
	appealType: appeal.appealType?.type,
	createdAt: appeal.createdAt,
	localPlanningDepartment: appeal.lpa.name,
	appellantCaseStatus: '',
	lpaQuestionnaireStatus: '',
	dueDate: null,
	isParentAppeal: linkedAppeals.filter((link) => link.parentRef === appeal.reference).length > 0,
	isChildAppeal: linkedAppeals.filter((link) => link.childRef === appeal.reference).length > 0
});

/**
 * @param {RepositoryGetAllResultItem} appeal
 * @param {AppealRelationship[]} linkedAppeals
 * @returns {AppealListResponse}}
 */
const formatMyAppeals = (appeal, linkedAppeals) => ({
	appealId: appeal.id,
	appealReference: appeal.reference,
	appealSite: formatAddress(appeal.address),
	appealStatus: appeal.appealStatus[0].status,
	appealType: appeal.appealType?.type,
	createdAt: appeal.createdAt,
	localPlanningDepartment: appeal.lpa.name,
	lpaQuestionnaireId: appeal.lpaQuestionnaire?.id || null,
	appealTimetable: appeal.appealTimetable
		? {
				appealTimetableId: appeal.appealTimetable.id,
				lpaQuestionnaireDueDate: appeal.appealTimetable.lpaQuestionnaireDueDate || null,
				...(isFPA(appeal.appealType) && {
					finalCommentReviewDate: appeal.appealTimetable.finalCommentReviewDate || null,
					statementReviewDate: appeal.appealTimetable.statementReviewDate || null,
					issueDeterminationDate: appeal.appealTimetable.issueDeterminationDate || null
				})
		  }
		: undefined,
	appellantCaseStatus: appeal?.appellantCase?.appellantCaseValidationOutcome?.name || null,
	lpaQuestionnaireStatus: appeal.lpaQuestionnaire?.lpaQuestionnaireValidationOutcome?.name || null,
	dueDate: mapAppealToDueDate(
		appeal,
		appeal?.appellantCase?.appellantCaseValidationOutcome?.name,
		appeal.dueDate
	),
	isParentAppeal: linkedAppeals.filter((link) => link.parentRef === appeal.reference).length > 0,
	isChildAppeal: linkedAppeals.filter((link) => link.childRef === appeal.reference).length > 0
});

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @param {Folder[]} folders
 * @returns {SingleAppealDetailsResponse | void}}
 */
const formatAppeal = (appeal, folders) => {
	if (appeal) {
		return {
			...(appeal.agent && {
				agent: {
					firstName: appeal.agent?.firstName,
					lastName: appeal.agent?.lastName,
					email: appeal.agent?.email
				}
			}),
			...(appeal.appellant && {
				appellant: {
					firstName: appeal.appellant?.firstName,
					lastName: appeal.appellant?.lastName,
					email: appeal.appellant?.email
				}
			}),
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
			appellantCaseId: appeal.appellantCase?.id || 0,
			caseOfficer: appeal.caseOfficer?.azureAdUserId || null,
			transferredAppealRef: appeal.transferredCaseId,
			decision: {
				folderId: folders[0].id,
				outcome: appeal.inspectorDecision?.outcome,
				// @ts-ignore
				documentId: appeal.inspectorDecision?.decisionLetterGuid
			},
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
			linkedAppeals: formatLinkedAppeals(appeal.linkedAppeals || [], appeal.reference),
			isParentAppeal:
				(appeal.linkedAppeals || []).filter((link) => link.parentRef === appeal.reference).length >
				0,
			isChildAppeal:
				(appeal.linkedAppeals || []).filter((link) => link.childRef === appeal.reference).length >
				0,
			localPlanningDepartment: appeal.lpa.name,
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

/**
 * Map each appeal to include a due date.
 * @param {RepositoryGetAllResultItem} appeal
 * @param {string} appellantCaseStatus
 * @param {Date | null} appellantCaseDueDate
 * @returns { Date | null | undefined }
 */
export const mapAppealToDueDate = (appeal, appellantCaseStatus, appellantCaseDueDate) => {
	switch (appeal.appealStatus[0].status) {
		case STATE_TARGET_READY_TO_START:
			if (appellantCaseStatus == 'Incomplete' && appellantCaseDueDate) {
				return new Date(appellantCaseDueDate);
			}
			return add(new Date(appeal.createdAt), {
				days: approxStageCompletion.STATE_TARGET_READY_TO_START
			});
		case STATE_TARGET_LPA_QUESTIONNAIRE_DUE:
			if (appeal.appealTimetable?.lpaQuestionnaireDueDate) {
				return new Date(appeal.appealTimetable?.lpaQuestionnaireDueDate);
			}
			return add(new Date(appeal.createdAt), {
				days: approxStageCompletion.STATE_TARGET_LPA_QUESTIONNAIRE_DUE
			});
		case STATE_TARGET_ASSIGN_CASE_OFFICER:
			return add(new Date(appeal.createdAt), {
				days: approxStageCompletion.STATE_TARGET_ASSIGN_CASE_OFFICER
			});
		case STATE_TARGET_ISSUE_DETERMINATION: {
			if (appeal.appealTimetable?.issueDeterminationDate) {
				return new Date(appeal.appealTimetable?.issueDeterminationDate);
			}
			return add(new Date(appeal.createdAt), {
				days: approxStageCompletion.STATE_TARGET_ISSUE_DETERMINATION
			});
		}
		case STATE_TARGET_STATEMENT_REVIEW: {
			if (appeal.appealTimetable?.statementReviewDate) {
				return new Date(appeal.appealTimetable?.statementReviewDate);
			}
			return add(new Date(appeal.createdAt), {
				days: approxStageCompletion.STATE_TARGET_STATEMENT_REVIEW
			});
		}
		case STATE_TARGET_FINAL_COMMENT_REVIEW: {
			if (appeal.appealTimetable?.finalCommentReviewDate) {
				return new Date(appeal.appealTimetable?.finalCommentReviewDate);
			}
			return add(new Date(appeal.createdAt), {
				days: approxStageCompletion.STATE_TARGET_FINAL_COMMENT_REVIEW
			});
		}
		case STATE_TARGET_COMPLETE: {
			return null;
		}
		default: {
			return undefined;
		}
	}
};

export { formatAppeal, formatAppeals, formatMyAppeals };
