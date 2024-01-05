import { jest } from '@jest/globals';
import { publishedCaseFieldsHaveChanged } from '../published-case-fields-changed';
import { cloneDeep } from 'lodash-es';

describe('Function: mapPublishedCaseFields', () => {
	let original, updated;

	beforeEach(() => {
		original = {
			ApplicationDetails: {
				regions: [{ regionId: 10 }, { regionId: 20 }],
				zoomLevel: {}
			},
			CaseStatus: [
				{
					id: 1,
					status: 'Status'
				}
			],
			gridReference: {
				easting: 111111,
				northing: 222222
			},
			applicant: {}
		};
		updated = cloneDeep(original);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Should return false', () => {
		it('when nothing has changed', () => {
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(false);
		});

		it('when only the modifiedAt field has changed', () => {
			updated.modifiedAt = Date.now();
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(false);
		});

		it('when only the modifiedAt, createdAt and id fields in the CaseStatus have changed', () => {
			updated.CaseStatus.modifiedAt = Date.now();
			updated.CaseStatus.createdAt = Date.now();
			updated.CaseStatus.id++;
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(false);
		});
	});

	describe('Should return true', () => {
		describe('when checking project information', () => {
			it('and the Project name has changed', () => {
				updated.title = 'Project name';
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});

			it('and the Case Stage has changed', () => {
				updated.CaseStatus[0].status = 'Case Stage';
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});

			it('and the Project description has changed', () => {
				updated.description = 'Project description';
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});

			it('and the Project email address has changed', () => {
				updated.ApplicationDetails.caseEmail = 'email@pins-test.gov';
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});

			it('and the Project location has changed', () => {
				updated.ApplicationDetails.locationDescription = 'Project Location';
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});

			it('and the Grid references for northing has changed', () => {
				updated.gridReference.northing = 123456;
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});

			it('and the Grid references for easting has changed', () => {
				updated.gridReference.easting = 123456;
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});

			it('and the Regions have changed', () => {
				updated.ApplicationDetails.regions.push({ regionId: 30 });
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});

			it('and the Map zoom level has changed', () => {
				updated.ApplicationDetails.zoomLevel.name = 'X';
				expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
			});
		});

		describe('when checking applicant information', () => {
			[
				{ field: 'organisationName', description: 'Organisation name' },
				{ field: 'website', description: 'Website' },
				{ field: 'email', description: 'Email address' }
			].map(({ field, description }) =>
				it(`and the ${description} has changed`, () => {
					updated.applicant[field] = 'X';
					expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
				})
			);
		});

		describe('when checking key dates', () => {
			[
				{ field: 'submissionAtPublished', description: 'Anticipated submission date published' },
				{ field: 'dateOfDCOSubmission', description: 'Application submitted (Section 55)' },
				{ field: 'deadlineForAcceptanceDecision', description: 'Deadline for Acceptance decision' },
				{ field: 'dateOfDCOAcceptance', description: 'Date of Acceptance (Section 55)' },
				{ field: 'dateOfNonAcceptance', description: 'Date of Non-Acceptance' },
				{
					field: 'dateOfRepresentationPeriodOpen',
					description: 'Date Relevant Representations open'
				},
				{
					field: 'dateOfRelevantRepresentationClose',
					description: 'Date Relevant Representations close'
				},
				{
					field: 'dateRRepAppearOnWebsite',
					description: 'Date Relevant Representations to appear on website'
				},
				{ field: 'preliminaryMeetingStartDate', description: 'Preliminary Meeting start date' },
				{ field: 'confirmedStartOfExamination', description: 'Examination start date' },
				{
					field: 'deadlineForCloseOfExamination',
					description: 'Deadline for close of Examination'
				},
				{ field: 'dateTimeExaminationEnds', description: 'Examination closing date' },
				{
					field: 'stage4ExtensionToExamCloseDate',
					description: 'Extension to close of Examination'
				},
				{
					field: 'deadlineForSubmissionOfRecommendation',
					description: 'Deadline for submission of Recommendation'
				},
				{ field: 'dateOfRecommendations', description: 'Date of Recommendation submitted to SoS' },
				{
					field: 'stage5ExtensionToRecommendationDeadline',
					description: 'Extension to Recommendation deadline'
				},
				{ field: 'deadlineForDecision', description: 'Deadline for Decision' },
				{ field: 'confirmedDateOfDecision', description: 'Date of Decision' },
				{
					field: 'stage5ExtensionToDecisionDeadline',
					description: 'Extension to Decision deadline'
				},
				{ field: 'dateProjectWithdrawn', description: 'Date project withdrawn' }
			].map(({ field, description }) =>
				it(`and the ${description} has changed`, () => {
					updated.ApplicationDetails[field] = Date.now();
					expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
				})
			);
		});
	});
});
