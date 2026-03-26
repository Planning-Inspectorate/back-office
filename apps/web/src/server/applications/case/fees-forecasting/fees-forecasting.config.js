import { getRows, getBackLinkParams } from './applications-fees-forecasting.utils.js';

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
	manageFee: 'manage-fee',
	addProjectMeeting: 'add-project-meeting',
	manageProjectMeeting: 'manage-project-meeting',
	addEvidencePlanMeeting: 'add-evidence-plan-meeting',
	manageEvidencePlanMeeting: 'manage-evidence-plan-meeting',
	principalAreaDisagreementSummaryStmt: 'disagreement-summary-statement',
	policyComplianceDocument: 'policy-compliance-document',
	designApproachDocument: 'design-approach-document',
	matureOutlineControlDocument: 'control-documents',
	caAndTpEvidence: 'compulsory-acquisition',
	publicSectorEqualityDuty: 'public-sector-equality-duty',
	fastTrackAdmissionDocument: 'fast-track-admission',
	multipartyApplicationCheckDocument: 'multiparty-application'
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
	manageFee: {
		sectionTitle: 'Manage fee',
		pageHeading: 'Manage fee',
		componentType: 'manage-fee'
	},
	addProjectMeeting: {
		sectionTitle: 'Add a project meeting',
		pageHeading: 'Add a project meeting',
		componentType: 'add-project-meeting'
	},
	manageProjectMeeting: {
		sectionTitle: 'Manage project meeting',
		pageHeading: 'Manage project meeting',
		componentType: 'manage-project-meeting'
	},
	addEvidencePlanMeeting: {
		sectionTitle: 'Add an evidence plan meeting',
		pageHeading: 'Add an evidence plan meeting',
		componentType: 'add-evidence-plan-meeting'
	},
	manageEvidencePlanMeeting: {
		sectionTitle: 'Manage evidence plan meeting',
		pageHeading: 'Manage evidence plan meeting',
		componentType: 'manage-evidence-plan-meeting'
	},
	principalAreaDisagreementSummaryStmt: {
		sectionTitle: 'Principal area disagreement summary statement (PADSS)',
		pageHeading: 'Principal area disagreement summary statement (PADSS)',
		fieldName: 'principalAreaDisagreementSummaryStmt',
		dateFieldName: 'principalAreaDisagreementSummaryStmtSubmittedDate',
		componentType: 'radio-date-input',
		radioFieldPath: 'additionalDetails.principalAreaDisagreementSummaryStmt',
		dateFieldPath: 'keyDates.preApplication.principalAreaDisagreementSummaryStmtSubmittedDate'
	},
	policyComplianceDocument: {
		sectionTitle: 'Policy compliance document (PCD)',
		pageHeading: 'Policy compliance document (PCD)',
		fieldName: 'policyComplianceDocument',
		dateFieldName: 'policyComplianceDocumentSubmittedDate',
		componentType: 'radio-date-input',
		radioFieldPath: 'additionalDetails.policyComplianceDocument',
		dateFieldPath: 'keyDates.preApplication.policyComplianceDocumentSubmittedDate'
	},
	designApproachDocument: {
		sectionTitle: 'Design approach document (DAD)',
		pageHeading: 'Design approach document (DAD)',
		fieldName: 'designApproachDocument',
		dateFieldName: 'designApproachDocumentSubmittedDate',
		componentType: 'radio-date-input',
		radioFieldPath: 'additionalDetails.designApproachDocument',
		dateFieldPath: 'keyDates.preApplication.designApproachDocumentSubmittedDate'
	},
	matureOutlineControlDocument: {
		sectionTitle: 'Mature outline control documents',
		pageHeading: 'Mature outline control documents',
		fieldName: 'matureOutlineControlDocument',
		dateFieldName: 'matureOutlineControlDocumentSubmittedDate',
		componentType: 'radio-date-input',
		radioFieldPath: 'additionalDetails.matureOutlineControlDocument',
		dateFieldPath: 'keyDates.preApplication.matureOutlineControlDocumentSubmittedDate'
	},
	caAndTpEvidence: {
		sectionTitle: 'Compulsory Acquisition (CA) and Temporary Possession (TP) evidence',
		pageHeading: 'Compulsory Acquisition (CA) and Temporary Possession (TP) evidence',
		fieldName: 'caAndTpEvidence',
		dateFieldName: 'caAndTpEvidenceSubmittedDate',
		componentType: 'radio-date-input',
		radioFieldPath: 'additionalDetails.caAndTpEvidence',
		dateFieldPath: 'keyDates.preApplication.caAndTpEvidenceSubmittedDate'
	},
	publicSectorEqualityDuty: {
		sectionTitle: 'Public Section Equality Duty (PSED)',
		pageHeading: 'Public Section Equality Duty (PSED)',
		fieldName: 'publicSectorEqualityDuty',
		dateFieldName: 'publicSectorEqualityDutySubmittedDate',
		componentType: 'radio-date-input',
		radioFieldPath: 'additionalDetails.publicSectorEqualityDuty',
		dateFieldPath: 'keyDates.preApplication.publicSectorEqualityDutySubmittedDate'
	},
	fastTrackAdmissionDocument: {
		sectionTitle: 'Fast track admission document',
		pageHeading: 'Fast track admission document',
		fieldName: 'fastTrackAdmissionDocument',
		dateFieldName: 'fastTrackAdmissionDocumentSubmittedDate',
		componentType: 'radio-date-input',
		radioFieldPath: 'additionalDetails.fastTrackAdmissionDocument',
		dateFieldPath: 'keyDates.preApplication.fastTrackAdmissionDocumentSubmittedDate'
	},
	multipartyApplicationCheckDocument: {
		sectionTitle: 'Multiparty application readiness gate-check (trial)',
		pageHeading: 'Multiparty application readiness gate-check (trial)',
		fieldName: 'multipartyApplicationCheckDocument',
		dateFieldName: 'multipartyApplicationCheckDocumentSubmittedDate',
		componentType: 'radio-date-input',
		radioFieldPath: 'additionalDetails.multipartyApplicationCheckDocument',
		dateFieldPath: 'keyDates.preApplication.multipartyApplicationCheckDocumentSubmittedDate'
	}
};

export const sectionDeleteData = {
	manageFee: {
		sectionTitle: 'Delete fee',
		pageHeading: 'Delete fee',
		warningText: 'Deleting this fee will remove it from future forecasting reporting.',
		backLinkSectionName: 'fees-forecasting-fee',
		/** @param {Record<string, any>} tableData */
		backLinkParams: (tableData) => getBackLinkParams(tableData),
		tableConfig: {
			headers: ['Stage', 'Amount', 'Invoice number', 'Status'],
			/** @param {Record<string, any>} tableData
			 * @param {{ getDisplayValue: Function, getStatusTag: Function, formatDateForDisplay: Function, invoiceStageDisplayValues: object}} helpers
			 */
			rows: (tableData, helpers) => getRows(tableData, helpers)
		}
	},
	manageProjectMeeting: {
		sectionTitle: 'Delete project meeting',
		pageHeading: 'Delete project meeting',
		warningText: 'Deleting this meeting will remove it from future forecasting reporting.',
		backLinkSectionName: 'fees-forecasting-project-meeting',
		/** @param {Record<string, any>} tableData */
		backLinkParams: (tableData) => getBackLinkParams(tableData),
		tableConfig: {
			headers: ['Meeting agenda', 'Date'],
			/** @param {Record<string, any>} tableData
			 * @param {{ getDisplayValue: Function, getStatusTag: Function, formatDateForDisplay: Function, invoiceStageDisplayValues: object}} helpers
			 */
			rows: (tableData, helpers) => getRows(tableData, helpers)
		}
	},
	manageEvidencePlanMeeting: {
		sectionTitle: 'Delete evidence plan meeting',
		pageHeading: 'Delete evidence plan meeting',
		warningText: 'Deleting this meeting will remove it from future forecasting reporting.',
		backLinkSectionName: 'fees-forecasting-evidence-plan-meeting',
		/** @param {Record<string, any>} tableData */
		backLinkParams: (tableData) => getBackLinkParams(tableData),
		tableConfig: {
			headers: ['Meeting agenda', 'Date'],
			/** @param {Record<string, any>} tableData
			 * @param {{ getDisplayValue: Function, getStatusTag: Function, formatDateForDisplay: Function, invoiceStageDisplayValues: object}} helpers
			 */
			rows: (tableData, helpers) => getRows(tableData, helpers)
		}
	}
};
