import { createCase } from '../factory/application.js';
import { fixtureSectors, fixtureSubSectors } from './options-item.js';

const baseCase = createCase({
	id: 4,
	modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
	title: 'Unpublished case with no applicant and case email',
	reference: 'CASE/04',
	sector: fixtureSectors[0],
	subSector: fixtureSubSectors[0],
	status: 'Pre-Application',
	caseEmail: 'some@ema.il'
});

export const fixtureFeesForecastingIndex = {
	caseData: {
		...baseCase,
		additionalDetails: {
			tier: 'basic',
			newMaturity: 'c',
			s61SummaryURI: 'mock-s61-summary-uri',
			programmeDocumentURI: 'mock-programme-document-uri',
			numberBand2Inspectors: 2,
			numberBand3Inspectors: 1,
			additionalComments: 'Some comments',
			planProcessEvidence: true,
			issuesTracker: 'mock-issues-tracker-uri',
			essentialFastTrackComponents: true,
			principalAreaDisagreementSummaryStmt: 'submitted_by_applicant',
			policyComplianceDocument: 'not_applicable',
			designApproachDocument: 'awaiting_submission',
			matureOutlineControlDocument: 'awaiting_submission',
			caAndTpEvidence: 'awaiting_submission',
			publicSectorEqualityDuty: 'not_applicable',
			fastTrackAdmissionDocument: 'submitted_by_applicant',
			multipartyApplicationCheckDocument: 'awaiting_submission'
		},
		keyDates: {
			preApplication: {
				submissionAtInternal: 1736112000,
				estimatedScopingSubmissionDate: 1739059200,
				consultationMilestoneAdequacyDate: 1741824000,
				updatedProgrammeDocumentReceivedDate: 1744291200,
				programmeDocumentReviewedByEstDate: 1746969600,
				caseTeamIssuedCommentsDate: 1749273600,
				memLastUpdated: 1710000000,
				principalAreaDisagreementSummaryStmtSubmittedDate: 1710000000,
				fastTrackAdmissionDocumentSubmittedDate: 1749273600,
				inceptionMeetingDate: 1749273600
			}
		}
	},
	invoices: [
		{
			id: 1,
			caseId: 4,
			invoiceNumber: '180000000',
			invoiceStage: 'pre_acceptance',
			amountDue: '20500',
			paymentDueDate: '2025-11-05T00:00:00.000Z',
			paymentDate: '2025-11-05T00:00:00.000Z',
			refundIssueDate: '2025-11-15T00:00:00.000Z'
		},
		{
			id: 2,
			caseId: 4,
			invoiceNumber: '180000001',
			invoiceStage: 'acceptance',
			amountDue: '30000',
			paymentDueDate: '2025-10-05T00:00:00.000Z',
			paymentDate: '2025-10-05T00:00:00.000Z',
			refundIssueDate: '2025-10-10T00:00:00.000Z'
		}
	],
	meetings: [
		{
			id: 1,
			caseId: 4,
			meetingType: 'project',
			agenda: 'Project Update Meeting (PUM)',
			pinsRole: null,
			meetingDate: '2025-01-11T00:00:00.000Z'
		},
		{
			id: 2,
			caseId: 4,
			meetingType: 'evidence_plan',
			agenda: 'Flood Risk Assessment',
			pinsRole: 'facilitator',
			meetingDate: '2025-01-09T00:00:00.000Z'
		},
		{
			id: 3,
			caseId: 4,
			meetingType: 'evidence_plan',
			agenda: 'Habitat Regulation Assessment',
			pinsRole: 'advisor',
			meetingDate: '2025-01-11T00:00:00.000Z'
		}
	]
};

export const fixtureFeesForecastingEdit = {
	urlSectionNames: {
		testSection: 'test-section',
		anotherTestSection: 'another-test-section'
	},
	sectionData: {
		testSection: {
			sectionTitle: 'Test section',
			pageHeading: 'Test page heading',
			fieldName: 'testSection',
			hintText: 'Test section hint text',
			componentType: 'date-input'
		},
		anotherTestSection: {
			sectionTitle: 'Another test section',
			pageHeading: 'Another test page heading',
			fieldName: 'anotherTestSection',
			hintText: 'Another test section hint text',
			componentType: 'date-input'
		}
	}
};
