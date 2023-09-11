export const preApplicationDateNames = [
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
	'dateRRepAppearOnWebsite',
	'dateIAPIDue',
	'rule6LetterPublishDate',
	'preliminaryMeetingStartDate',
	'notificationDateForPMAndEventsDirectlyFollowingPM',
	'notificationDateForEventsDeveloper'
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
export const postDecisionDateNames = ['jRPeriodEndDate'];
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
