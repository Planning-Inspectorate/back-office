/** @type {Record<string, string>} */
const propertyToName = {
	preApplication: 'Pre-application',
	datePINSFirstNotifiedOfProject: 'Date first notified of project',
	datePINSFirstNotifiedOfProject_label:
		'Applicant notifies the Planning Inspectorate of a project.',
	dateProjectAppearsOnWebsite: 'Project published on website',
	dateProjectAppearsOnWebsite_label: 'Applicant notifies the Planning Inspectorate of a project.',
	submissionAtPublished: 'Anticipated submission date published',
	submissionAtPublished_label:
		'Date the Planning Inspectorate expects the application to be submitted e.g. Q4 2023.',
	submissionAtInternal: 'Anticipated submission date internal',
	submissionAtInternal_label:
		'Date the Planning Inspectorate expects the application to be submitted.',
	screeningOpinionSought: 'Screening opinion sought',
	screeningOpinionSought_label: 'Date Applicant requests a screening opinion.',
	screeningOpinionIssued: 'Screening opinion issued',
	screeningOpinionIssued_label: 'Date the Planning Inspectorate issues our screening opinion.',
	scopingOpinionSought: 'Scoping opinion sought',
	scopingOpinionSought_label: 'Date Applicant requests a scoping opinion.',
	scopingOpinionIssued: 'Scoping opinion issued',
	scopingOpinionIssued_label: 'Date the Planning Inspectorate issues our scoping opinion.',
	section46Notification: 'Section 46 notification',
	section46Notification_label:
		'Date Applicant notifies the Planning Inspectorate of statutory consultation.',

	acceptance: 'Acceptance',
	dateOfDCOSubmission: 'Application submitted (Section 55)',
	dateOfDCOSubmission_label: 'Date the application is submitted.',
	deadlineForAcceptanceDecision: 'Deadline for Acceptance decision',
	deadlineForAcceptanceDecision_label:
		'Deadline for Acceptance decision by the Planning Inspectorate.',
	dateOfDCOAcceptance: 'Date of Acceptance  (Section 55)',
	dateOfDCOAcceptance_label: 'Date of decision to accept.',
	dateOfNonAcceptance: 'Date of Non-Acceptance',
	dateOfNonAcceptance_label: 'Date of decision not to accept.',

	preExamination: 'Pre-examination',
	dateOfRepresentationPeriodOpen: 'Date Relevant Representations open',
	dateOfRepresentationPeriodOpen_label:
		'Start date of Relevant Representation (RR) period. The RR portal will open on this date on website.',
	dateOfRelevantRepresentationClose: 'Date Relevant Representations close',
	dateOfRelevantRepresentationClose_label: 'Date RR period will close.',
	extensionToDateRelevantRepresentationsClose: 'Extension to date Relevant Representations close',
	extensionToDateRelevantRepresentationsClose_label:
		'Date RR period will close, if it has been extended.',
	dateRRepAppearOnWebsite: 'Date Relevant Representations to appear on website',
	dateRRepAppearOnWebsite_label: 'Date for RRs to appear on the website.',
	dateIAPIDue: 'Date IAPI due',
	dateIAPIDue_label: 'Date that the ExA must have completed their IAPI.',
	rule6LetterPublishDate: 'Rule 6 letter publication date',
	rule6LetterPublishDate_label: 'Date when Rule 6 letter is published on website.',
	preliminaryMeetingStartDate: 'Preliminary Meeting start date',
	preliminaryMeetingStartDate_label: 'Start date of the Preliminary Meeting.',
	notificationDateForPMAndEventsDirectlyFollowingPM:
		'Notification date for PM and any events directly following the PM',
	notificationDateForPMAndEventsDirectlyFollowingPM_label:
		'28 days before PM. Rule 6 - 21 days + 7 days to allow for post.',
	notificationDateForEventsDeveloper: 'Notification date for events - Developer',
	notificationDateForEventsDeveloper_label: '21 days before the event - Rule 13.',

	examination: 'Examination',
	dateSection58NoticeReceived: 'Date Section 58 Notice received',
	dateSection58NoticeReceived_label: 'Date s58 notice is received.',
	confirmedStartOfExamination: 'Examination start date',
	confirmedStartOfExamination_label: 'Start of examination.',
	rule8LetterPublishDate: 'Rule 8 letter publication date',
	rule8LetterPublishDate_label: 'Date when Rule 8 letter is published.',
	deadlineForCloseOfExamination: 'Deadline for close of Examination',
	deadlineForCloseOfExamination_label: 'Deadline for the close of the examination.',
	dateTimeExaminationEnds: 'Examination closing date',
	dateTimeExaminationEnds_label: 'Date that the examination closes.',
	stage4ExtensionToExamCloseDate: 'Extension to close of Examination',
	stage4ExtensionToExamCloseDate_label: 'Date examination will close, if it has been extended.',

	recommendation: 'Recommendation',
	deadlineForSubmissionOfRecommendation: 'Deadline for submission',
	deadlineForSubmissionOfRecommendation_label:
		'Deadline for submission of Recommendation report to the Secretary of State (SoS).',
	dateOfRecommendations: 'Date of Recommendation submitted to SoS',
	dateOfRecommendations_label: 'Date Recommendation report submitted to SoS.',
	stage5ExtensionToRecommendationDeadline: 'Extension to Recommendation deadline',
	stage5ExtensionToRecommendationDeadline_label:
		'Date for submission of Recommendation report, if this stage is extended.',

	decision: 'Decision',
	deadlineForDecision: 'Deadline for Decision',
	deadlineForDecision_label: 'Date of the deadline for a decision by the SoS.',
	confirmedDateOfDecision: 'Date of Decision',
	confirmedDateOfDecision_label: 'Date the decision is made by SoS.',
	stage5ExtensionToDecisionDeadline: 'Extension to Decision deadline',
	stage5ExtensionToDecisionDeadline_label:
		'Date of the deadline for a decision by the SoS, if extended.',

	postDecision: 'Post-decision',
	jRPeriodEndDate: 'Judicial review period end date',
	jRPeriodEndDate_label: 'Close of the judicial review period.',

	withdrawal: 'Withdrawal',
	dateProjectWithdrawn: 'Date project withdrawn',
	dateProjectWithdrawn_label: ' Date project withdrawn by Applicant.'
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
