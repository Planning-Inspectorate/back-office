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
	projectMaturity: 'project-maturity',
	preApplicationSection: 'preApplicationSection',
	submissionAtInternal: 'submissionAtInternal',
	inceptionMeetingDate: 'inceptionMeetingDate',
	maturityEvaluationMatrix: 'maturity-evaluation-matrix',
	projectTier: 'project-tier',
	scopingSubmission: 'scoping-submission',
	consultationMilestone: 'consultation-milestone',
	evidencePlanProcess: 'evidence-plan',
	programmeDocumentReceived: 'programme-document-received',
	programmeDocumentReviewed: 'programme-document-reviewed',
	programmeDocumentComments: 'programme-document-comments',
	addNewFee: 'add-new-fee',
	manageFee: 'manage-fee',
	addProjectMeeting: 'add-project-meeting',
	manageProjectMeeting: 'manage-project-meeting',
	addEvidencePlanMeeting: 'add-evidence-plan-meeting',
	manageEvidencePlanMeeting: 'manage-evidence-plan-meeting',
	fastTrack: 'fast-track',
	principalAreaDisagreementSummaryStmt: 'disagreement-summary-statement',
	policyComplianceDocument: 'policy-compliance-document',
	designApproachDocument: 'design-approach-document',
	matureOutlineControlDocument: 'control-documents',
	caAndTpEvidence: 'compulsory-acquisition',
	publicSectorEqualityDuty: 'public-sector-equality-duty',
	fastTrackAdmissionDocument: 'fast-track-admission',
	multipartyApplicationCheckDocument: 'multiparty-application',
	s61SummaryLink: 's61-summary-link',
	programmeDocumentLink: 'programme-document-link',
	issuesTrackerLink: 'issues-tracker-link',
	examiningInspectors: 'examining-inspectors',
	additionalComments: 'additional-comments'
};

export const sectionData = {
	projectMaturity: {
		sectionTitle: 'Project maturity',
		pageHeading: 'What is the new maturity of the project?',
		fieldName: 'newMaturity',
		componentType: 'radio-input',
		radioFieldPath: 'additionalDetails.newMaturity',
		radioOptions: [
			{ value: 'a', text: 'A' },
			{ value: 'b', text: 'B' },
			{ value: 'c', text: 'C' },
			{ value: 'd', text: 'D' },
			{ value: 'e', text: 'E' },
			{ value: 'f', text: 'F' },
			{ value: 'g', text: 'G' }
		]
	},
	maturityEvaluationMatrix: {
		sectionTitle: 'MEM last updated',
		pageHeading: 'Maturity Evaluation Matrix (MEM) last updated',
		fieldName: 'memLastUpdated',
		componentType: 'date-input'
	},
	projectTier: {
		sectionTitle: 'Project tier',
		pageHeading: 'Tier of the project',
		fieldName: 'tier',
		componentType: 'radio-input',
		radioFieldPath: 'additionalDetails.tier',
		radioOptions: [
			{ value: 'basic', text: 'Basic' },
			{ value: 'standard', text: 'Standard' },
			{ value: 'enhanced', text: 'Enhanced' }
		]
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
	evidencePlanProcess: {
		sectionTitle: 'Evidence plan process',
		pageHeading: 'Evidence plan process',
		fieldName: 'planProcessEvidence',
		componentType: 'radio-input',
		hintText:
			'The schedule of evidence plan activities should be provided before the process begins.',
		radioFieldPath: 'additionalDetails.planProcessEvidence',
		radioOptions: [
			{ value: 1, text: 'Required' },
			{ value: 0, text: 'Not required' }
		],
		insetText:
			'Adding the evidence plan process will require you to add any scheduled meetings to the evidence plan meetings section.'
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
	fastTrack: {
		sectionTitle: 'Fast track',
		pageHeading: 'Fast track',
		fieldName: 'essentialFastTrackComponents',
		componentType: 'radio-input',
		hintText:
			'Enhanced tier projects can be marked as fast track and require essential fast track components to be submitted by the applicant',
		radioFieldPath: 'additionalDetails.essentialFastTrackComponents',
		radioOptions: [
			{ value: 1, text: 'Yes' },
			{ value: 0, text: 'No' }
		]
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
	},
	s61SummaryLink: {
		sectionTitle: 'Link to s61 summary',
		pageHeading: 'Link to s61 summary',
		fieldName: 's61SummaryURI',
		componentType: 'text-input'
	},
	programmeDocumentLink: {
		sectionTitle: 'Link to the programme document',
		pageHeading: 'Link to the programme document',
		fieldName: 'programmeDocumentURI',
		componentType: 'text-input'
	},
	issuesTrackerLink: {
		sectionTitle: 'Link to the issues tracker',
		pageHeading: 'Link to the issues tracker',
		fieldName: 'issuesTracker',
		componentType: 'text-input'
	},
	examiningInspectors: {
		sectionTitle: 'Examining inspectors',
		pageHeading: 'Examining inspectors',
		fieldName: 'numberBand2Inspectors',
		additionalFieldName: 'numberBand3Inspectors',
		labelText: 'Number of band 2 inspectors',
		additionalLabelText: 'Number of band 3 inspectors',
		componentType: 'text-input'
	},
	additionalComments: {
		sectionTitle: 'Additional comments',
		pageHeading: 'Additional comments (optional)',
		fieldName: 'additionalComments',
		componentType: 'text-area'
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
