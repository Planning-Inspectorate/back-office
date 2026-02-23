export const genericHrefText = 'Change';
export const feesHrefText = 'Review';
export const editPageURL = '#';

export const newMaturityDisplayValues = {
	a: 'A',
	b: 'B',
	c: 'C',
	d: 'D',
	e: 'E',
	f: 'F',
	g: 'G'
};

export const tierDisplayValues = {
	basic: 'Basic',
	standard: 'Standard',
	enhanced: 'Enhanced'
};

export const invoiceStageDisplayValues = {
	pre_acceptance: 'Pre-acceptance',
	acceptance: 'Acceptance',
	pre_examination: 'Pre-examination',
	initial_examination: 'Initial examination',
	final_examination: 'Final examination'
};

export const supplementaryComponentsDisplayValues = {
	submitted_by_applicant: 'Submitted',
	awaiting_submission: 'Awaiting submission',
	not_applicable: 'Not applicable'
};

// Different formats used for key dates and fees and forecasting
export const urlSectionNames = {
	preApplicationSection: 'preApplicationSection',
	submissionAtInternal: 'submissionAtInternal',
	inceptionMeetingDate: 'inceptionMeetingDate',
	maturityEvaluationMatrix: 'maturity-evaluation-matrix',
	scopingSubmission: 'scoping-submission',
	consultationMilestone: 'consultation-milestone',
	programmeDocumentReceived: 'programme-document-received',
	programmeDocumentReviewed: 'programme-document-reviewed',
	programmeDocumentComments: 'programme-document-comments',
	addNewFee: 'add-new-fee',
	addProjectMeeting: 'add-project-meeting',
	addEvidencePlanMeeting: 'add-evidence-plan-meeting'
};

export const sectionData = {
	maturityEvaluationMatrix: {
		sectionTitle: 'MEM last updated',
		pageHeading: 'Maturity Evaluation Matrix (MEM) last updated',
		fieldName: 'memLastUpdated',
		componentType: 'date-input'
	},
	scopingSubmission: {
		sectionTitle: 'Estimated scoping submission date',
		pageHeading: 'Estimated scoping submission date',
		fieldName: 'estimatedScopingSubmissionDate',
		componentType: 'date-input'
	},
	consultationMilestone: {
		sectionTitle: 'Adequacy of Consultation Milestone (AoCM) date',
		pageHeading: 'Adequacy of Consultation Milestone (AoCM) date',
		fieldName: 'consultationMilestoneAdequacyDate',
		componentType: 'date-input'
	},
	programmeDocumentReceived: {
		sectionTitle: 'Date updated programme document received',
		pageHeading: 'Date updated programme document received',
		fieldName: 'updatedProgrammeDocumentReceivedDate',
		hintText:
			'Date the Planning Inspectorate received the most recently updated programme document from applicant',
		componentType: 'date-input'
	},
	programmeDocumentReviewed: {
		sectionTitle: 'Date programme document reviewed by EST',
		pageHeading: 'Date programme document reviewed by EST',
		fieldName: 'programmeDocumentReviewedByEstDate',
		hintText: 'Date of the most recent review by Environmental Services Team (EST)',
		componentType: 'date-input'
	},
	programmeDocumentComments: {
		sectionTitle: 'Date case team issued comments on programme document',
		pageHeading: 'Date case team issued comments on programme document',
		fieldName: 'caseTeamIssuedCommentsDate',
		hintText: 'Issue date of the most recent initial comments on programme document to applicant',
		componentType: 'date-input'
	},
	addNewFee: {
		sectionTitle: 'Add a new fee',
		pageHeading: 'Add a new fee',
		componentType: 'add-new-fee'
	},
	addProjectMeeting: {
		sectionTitle: 'Add a project meeting',
		pageHeading: 'Add a project meeting',
		componentType: 'add-project-meeting'
	},
	addEvidencePlanMeeting: {
		sectionTitle: 'Add an evidence plan meeting',
		pageHeading: 'Add an evidence plan meeting',
		componentType: 'add-evidence-plan-meeting'
	}
};
