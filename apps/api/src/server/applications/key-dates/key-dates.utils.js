/**
 * @file key-dates.utils.js
 * @description Field name arrays for each stage of the NSIP application lifecycle.
 *
 * These arrays are used by the API mapper (map-key-dates.js) to:
 *   - Pick the correct fields from the database record per section
 *   - Filter incoming request fields before database writes
 *   - Control which fields are included in Service Bus broadcast events
 *
 * Each array corresponds to a case lifecycle stage. Most fields are date fields
 * stored as Unix timestamps, with the following exceptions:
 *   - `submissionAtPublished` (preApplication) — stored as a plain string
 *   - `courtDecisionOutcome` (postDecision) — stored as a plain string
 *   - `courtDecisionOutcomeText` (postDecision) — stored as a plain string
 *
 * These non-date fields require special handling in the mapper to bypass
 * Unix timestamp conversion.
 *
 * `allKeyDateNames` is the union of all stage arrays and acts as an allowlist —
 * only fields listed here will be processed by the API.
 */

export const preApplicationDateNames = [
	'datePINSFirstNotifiedOfProject',
	'dateProjectAppearsOnWebsite',
	'submissionAtPublished',
	'submissionAtInternal',
	'screeningOpinionSought',
	'screeningOpinionIssued',
	'scopingOpinionSought',
	'scopingOpinionIssued',
	'section46Notification',
	'inceptionMeetingDate',
	'draftDocumentSubmissionDate',
	'programmeDocumentSubmissionDate',
	'estimatedScopingSubmissionDate',
	'consultationMilestoneAdequacyDate',
	'principalAreaDisagreementSummaryStmtSubmittedDate',
	'policyComplianceDocumentSubmittedDate',
	'designApproachDocumentSubmittedDate',
	'matureOutlineControlDocumentSubmittedDate',
	'caAndTpEvidenceSubmittedDate',
	'publicSectorEqualityDutySubmittedDate',
	'fastTrackAdmissionDocumentSubmittedDate',
	'multipartyApplicationCheckDocumentSubmittedDate',
	'updatedProgrammeDocumentReceivedDate',
	'programmeDocumentReviewedByEstDate',
	'caseTeamIssuedCommentsDate',
	'statutoryConsultationPeriodEndDate',
	'submissionOfDraftDocumentsDate',
	'memLastUpdated'
];
export const acceptanceDateNames = [
	'dateOfDCOSubmission',
	'deadlineForAcceptanceDecision',
	'dateOfDCOAcceptance',
	'dateOfNonAcceptance'
];
export const preExaminationDateNames = [
	'dateOfRepresentationPeriodOpen',
	'dateOfRelevantRepresentationClose',
	'extensionToDateRelevantRepresentationsClose',
	'dateOfReOpenRelevantRepresentationStart',
	'dateOfReOpenRelevantRepresentationClose',
	'dateRRepAppearOnWebsite',
	'dateIAPIDue',
	'rule6LetterPublishDate',
	'preliminaryMeetingStartDate',
	'notificationDateForPMAndEventsDirectlyFollowingPM',
	'notificationDateForEventsApplicant'
];
export const examinationDateNames = [
	'dateSection58NoticeReceived',
	'confirmedStartOfExamination',
	'rule8LetterPublishDate',
	'deadlineForCloseOfExamination',
	'dateTimeExaminationEnds',
	'stage4ExtensionToExamCloseDate'
];
export const recommendationDateNames = [
	'deadlineForSubmissionOfRecommendation',
	'dateOfRecommendations',
	'stage5ExtensionToRecommendationDeadline'
];
export const decisionDateNames = [
	'deadlineForDecision',
	'confirmedDateOfDecision',
	'stage5ExtensionToDecisionDeadline'
];
export const postDecisionDateNames = [
	'jRPeriodEndDate',
	'courtDecisionDate',
	'decisionChallengeSubmissionDate',
	'courtDecisionOutcome',
	'courtDecisionOutcomeText'
];
export const withdrawalDateNames = ['dateProjectWithdrawn'];

export const allKeyDateNames = preApplicationDateNames.concat(
	acceptanceDateNames,
	preExaminationDateNames,
	examinationDateNames,
	recommendationDateNames,
	decisionDateNames,
	postDecisionDateNames,
	withdrawalDateNames
);
