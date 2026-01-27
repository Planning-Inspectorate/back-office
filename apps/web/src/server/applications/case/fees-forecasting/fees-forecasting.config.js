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
	maturityEvaluationMatrix: 'maturity-evaluation-matrix',
	scopingSubmission: 'scoping-submission',
	consultationMilestone: 'consultation-milestone',
	programmeDocumentReceived: 'programme-document-received'
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
	}
};
