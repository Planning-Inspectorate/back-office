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

export const fixtureFeesForecastingCase = {
	...baseCase,
	additionalDetails: {
		tier: 'mock-tier',
		newMaturity: 'C',
		s61SummaryURI: 'mock-s61-summary-uri',
		programmeDocumentURI: 'mock-programme-document-uri',
		numberBand2Inspectors: 2,
		numberBand3Inspectors: 1,
		additionalComments: 'Some comments',
		planProcessEvidence: 'Required'
	},
	keyDates: {
		preApplication: {
			submissionAtInternal: 1736112000,
			estimatedScopingSubmissionDate: 1739059200,
			consultationMilestoneAdequacyDate: 1741824000,
			updatedProgrammeDocumentReceivedDate: 1744291200,
			programmeDocumentReviewedByEstDate: 1746969600,
			caseTeamIssuedCommentsDate: 1749273600,
			memLastUpdated: 1710000000
		}
	}
};

export const fixtureFeesForecastingInvoices = [
	{
		id: 1,
		caseId: 4,
		invoiceNumber: '180000000',
		invoiceStage: 'Pre-application',
		amountDue: '20500',
		paymentDueDate: '2025-11-05T00:00:00.000Z',
		paymentDate: '2025-11-05T00:00:00.000Z',
		refundIssueDate: '2025-11-15T00:00:00.000Z'
	},
	{
		id: 2,
		caseId: 4,
		invoiceNumber: '180000001',
		invoiceStage: 'Pre-application',
		amountDue: '30000',
		paymentDueDate: '2025-10-05T00:00:00.000Z',
		paymentDate: '2025-10-05T00:00:00.000Z',
		refundIssueDate: '2025-10-10T00:00:00.000Z'
	}
];

export const fixtureFeesForecastingMeetings = [
	{
		id: 1,
		caseId: 4,
		meetingType: 'Pre-application',
		agenda: 'Inception meeting',
		meetingDate: '2025-01-09T00:00:00.000Z'
	},
	{
		id: 2,
		caseId: 4,
		meetingType: 'Pre-application',
		agenda: 'Project Update Meeting (PUM)',
		meetingDate: '2025-01-11T00:00:00.000Z'
	}
];
