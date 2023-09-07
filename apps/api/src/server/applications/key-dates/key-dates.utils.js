export const preApplicationDateKeys = [
	'datePINSFirstNotifiedOfProject',
	'dateProjectAppearsOnWebsite',
	'submissionAtPublished',
	'submissionAtInternal',
	'screeningOpinionSought',
	'screeningOpinionIssued',
	'scopingOpinionSought',
	'scopingOpinionIssued',
	'section46Notification'
];
export const acceptanceDateKeys = [
	'dateOfDCOSubmission',
	'deadlineForAcceptanceDecision',
	'dateOfDCOAcceptance',
	'dateOfNonAcceptance'
];
export const preExaminationDateKeys = [
	'dateOfRepresentationPeriodOpen',
	'dateOfRelevantRepresentationClose',
	'extensionToDateRelevantRepresentationsClose',
	'dateRRepAppearOnWebsite',
	'dateIAPIDue',
	'rule6LetterPublishDate',
	'preliminaryMeetingStartDate',
	'notificationDateForPMAndEventsDirectlyFollowingPM',
	'notificationDateForEventsDeveloper'
];
export const examinationDateKeys = [
	'dateSection58NoticeReceived',
	'confirmedStartOfExamination',
	'rule8LetterPublishDate',
	'deadlineForCloseOfExamination',
	'dateTimeExaminationEnds',
	'stage4ExtensionToExamCloseDate'
];
export const recommendationDateKeys = [
	'deadlineForSubmissionOfRecommendation',
	'dateOfRecommendations',
	'stage5ExtensionToRecommendationDeadline'
];
export const decisionDateKeys = [
	'deadlineForDecision',
	'confirmedDateOfDecision',
	'stage5ExtensionToDecisionDeadline'
];
export const postDecisionDateKeys = ['jRPeriodEndDate'];
export const withdrawalDateKeys = ['dateProjectWithdrawn'];

export const allDateKeys = preApplicationDateKeys.concat(
	acceptanceDateKeys,
	preExaminationDateKeys,
	examinationDateKeys,
	recommendationDateKeys,
	decisionDateKeys,
	postDecisionDateKeys,
	withdrawalDateKeys
);
