/** @type {Record<string, string>} */
const propertyToName = {
	preApplication: 'Pre-application',
	preApplicationSection: 'Pre-application',
	screeningAndScoping: 'Screening and scoping',
	datePINSFirstNotifiedOfProject: 'Date first notified of project',
	datePINSFirstNotifiedOfProject_label:
		'Applicant notifies the Planning Inspectorate of a project.',
	dateProjectAppearsOnWebsite: 'Project published on website',
	submissionAtPublished: 'Anticipated submission date published',
	submissionAtPublished_label: `Date the Planning Inspectorate expects the application to be submitted. For example, ‘between April and June 2024' or 'in September 2025’`,
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
	dateOfDCOSubmission_advisory: 'Recording this date may require you to change the case stage.',
	deadlineForAcceptanceDecision: 'Deadline for Acceptance decision',
	deadlineForAcceptanceDecision_label:
		'Deadline for Acceptance decision by the Planning Inspectorate.',
	dateOfDCOAcceptance: 'Date of Acceptance  (Section 55)',
	dateOfDCOAcceptance_label: 'Date of decision to accept.',
	dateOfDCOAcceptance_advisory: 'Recording this date may require you to change the case stage.',
	dateOfNonAcceptance: 'Date of Non-Acceptance',
	dateOfNonAcceptance_label: 'Date of decision not to accept.',

	preExamination: 'Pre-examination',
	relevantRepresentations: 'Relevant representations',
	relevantRepresentationsReOpen: 'Relevant representations re-open',
	otherDates: 'Other',

	dateOfRepresentationPeriodOpen: 'Open',
	dateOfRepresentationPeriodOpen_label:
		'Start date of Relevant Representation (RR) period. The RR portal will open on this date on website.',
	dateOfRelevantRepresentationClose: 'Close',
	dateOfRelevantRepresentationClose_label: 'Date RR period will close.',
	extensionToDateRelevantRepresentationsClose: 'Extension',
	extensionToDateRelevantRepresentationsClose_label:
		'Date RR period will close, if it has been extended.',
	dateRRepAppearOnWebsite: 'Relevant Representations appear on website',
	dateRRepAppearOnWebsite_label: 'Date for RRs to appear on the website.',
	dateOfReOpenRelevantRepresentationStart: 'Re-opens',
	dateOfReOpenRelevantRepresentationStart_label:
		'Date RR will open if a subsequent period is needed',
	dateOfReOpenRelevantRepresentationClose: 'Re-opening closes',
	dateOfReOpenRelevantRepresentationClose_label:
		'Date RR period will close, if it has been re-opened',
	dateIAPIDue: 'IAPI due',
	dateIAPIDue_label: 'Date that the ExA must have completed their IAPI.',
	rule6LetterPublishDate: 'Rule 6 letter publication',
	rule6LetterPublishDate_label: 'Date when Rule 6 letter is published on website.',
	preliminaryMeetingStartDate: 'Preliminary meeting',
	preliminaryMeetingStartDate_label: 'Start date of the Preliminary Meeting.',
	notificationDateForPMAndEventsDirectlyFollowingPM:
		'Preliminary meeting notification (including events following the PM)',
	notificationDateForPMAndEventsDirectlyFollowingPM_label:
		'28 days before PM. Rule 6 - 21 days + 7 days to allow for post.',
	notificationDateForEventsApplicant: 'Event Notification',
	notificationDateForEventsApplicant_label: '21 days before the event - Rule 13.',

	examination: 'Examination',
	dateSection58NoticeReceived: 'Date Section 58 Notice received',
	dateSection58NoticeReceived_label: 'Date s58 notice is received.',
	confirmedStartOfExamination: 'Examination start date',
	confirmedStartOfExamination_label: 'Start of examination.',
	confirmedStartOfExamination_advisory:
		'Recording this date may require you to change the case stage.',
	rule8LetterPublishDate: 'Rule 8 letter publication date',
	rule8LetterPublishDate_label: 'Date when Rule 8 letter is published.',
	deadlineForCloseOfExamination: 'Deadline for close of Examination',
	deadlineForCloseOfExamination_label: 'Deadline for the close of the examination.',
	dateTimeExaminationEnds: 'Examination closing date',
	dateTimeExaminationEnds_label: 'Date that the examination closes.',
	dateTimeExaminationEnds_advisory: 'Recording this date may require you to change the case stage.',
	stage4ExtensionToExamCloseDate: 'Extension to close of Examination',
	stage4ExtensionToExamCloseDate_label: 'Date examination will close, if it has been extended.',

	recommendation: 'Recommendation',
	deadlineForSubmissionOfRecommendation: 'Deadline for submission of Recommendation',
	deadlineForSubmissionOfRecommendation_label:
		'Deadline for submission of Recommendation report to the Secretary of State (SoS).',
	dateOfRecommendations: 'Date of Recommendation submitted to SoS',
	dateOfRecommendations_label: 'Date Recommendation report submitted to SoS.',
	dateOfRecommendations_advisory: 'Recording this date may require you to change the case stage.',
	stage5ExtensionToRecommendationDeadline: 'Extension to Recommendation deadline',
	stage5ExtensionToRecommendationDeadline_label:
		'Date for submission of Recommendation report, if this stage is extended.',

	decision: 'Decision',
	deadlineForDecision: 'Deadline for Decision',
	deadlineForDecision_label: 'Date of the deadline for a decision by the SoS.',
	confirmedDateOfDecision: 'Date of Decision',
	confirmedDateOfDecision_label: 'Date the decision is made by SoS.',
	confirmedDateOfDecision_advisory: 'Recording this date may require you to change the case stage.',
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
	if (property.endsWith('_advisory') || property.endsWith('_label')) {
		return propertyToName[property] ? propertyToName[property] : '';
	}
	return propertyToName[property] ? propertyToName[property] : 'property';
};
