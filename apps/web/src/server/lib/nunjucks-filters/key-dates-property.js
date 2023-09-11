/** @type {Record<string, string>} */
const propertyToName = {
	preApplication: 'Pre-application',
	datePINSFirstNotifiedOfProject: 'Date first notified of project',
	dateProjectAppearsOnWebsite: 'Project published on website',
	submissionAtPublished: 'Anticipated submission date published',
	submissionAtInternal: 'Anticipated submission date internal',
	screeningOpinionSought: 'Screening opinion sought',
	screeningOpinionIssued: 'Screening opinion issued',
	scopingOpinionSought: 'Scoping opinion sought',
	scopingOpinionIssued: 'Scoping opinion issued',
	section46Notification: 'Section 46 notification',

	acceptance: 'Acceptance',
	dateOfDCOSubmission: 'Application submitted (Section 55)',
	deadlineForAcceptanceDecision: 'Deadline for Acceptance decision',
	dateOfDCOAcceptance: 'Date of Acceptance  (Section 55)',
	dateOfNonAcceptance: 'Date of Non-Acceptance',

	preExamination: 'Pre-examination',
	dateOfRepresentationPeriodOpen: 'Date Relevant Representations open',
	dateOfRelevantRepresentationClose: 'Date Relevant Representations close',
	extensionToDateRelevantRepresentationsClose: 'Extension to date Relevant Representations close',
	dateRRepAppearOnWebsite: 'Date Relevant Representations to appear on website',
	dateIAPIDue: 'Date IAPI due',
	rule6LetterPublishDate: 'Rule 6 letter publication date',
	preliminaryMeetingStartDate: 'Preliminary Meeting start date',
	notificationDateForPMAndEventsDirectlyFollowingPM:
		'Notification date for PM and any events directly following the PM',
	notificationDateForEventsDeveloper: 'Notification date for events - Developer',

	examination: 'Examination',
	dateSection58NoticeReceived: 'Date Section 58 Notice received',
	confirmedStartOfExamination: 'Examination start date',
	rule8LetterPublishDate: 'Rule 8 letter publication date',
	deadlineForCloseOfExamination: 'Deadline for close of Examination',
	dateTimeExaminationEnds: 'Examination closing date',
	stage4ExtensionToExamCloseDate: 'Extension to close of Examination',

	recommendation: 'Recommendation',
	deadlineForSubmissionOfRecommendation: 'Deadline for submission of Recommendation',
	dateOfRecommendations: 'Date of Recommendation submitted to SoS',
	stage5ExtensionToRecommendationDeadline: 'Extension to Recommendation deadline',

	decision: 'Decision',
	deadlineForDecision: 'Deadline for Decision',
	confirmedDateOfDecision: 'Date of Decision',
	stage5ExtensionToDecisionDeadline: 'Extension to Decision deadline',

	postDecision: 'Post-decision',
	jRPeriodEndDate: 'Judicial review period end date',

	withdrawal: 'Withdrawal',
	dateProjectWithdrawn: 'Date project withdrawn'
};

/**
 * Returns the full name for a key dates property
 *
 * @param {string} property
 * @returns {string}
 */
export const keyDatesProperty = (property) => {
	return propertyToName[property] ? propertyToName[property] : property;
};
