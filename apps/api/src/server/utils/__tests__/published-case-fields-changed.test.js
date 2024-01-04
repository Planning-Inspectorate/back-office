import { jest } from '@jest/globals';
import { publishedCaseFieldsHaveChanged } from '../published-case-fields-changed';
import { cloneDeep } from 'lodash-es';

describe('Function: mapPublishedCaseFields', () => {
	let original, updated;

	beforeEach(() => {
		original = {
			ApplicantDetails: {
				caseEmail: 'test@pins-test.gov'
			},
			CaseStatus: [
				{
					id: 1,
					status: 'Status',
					modifiedAt: null,
					createdAt: null
				}
			],
			hasUnpublishedChanges: false
		};
		updated = cloneDeep(original);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Should return false', () => {
		it('when nothing has changed', async () => {
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(false);
		});

		it('when only the modifiedAt field has changed', async () => {
			updated.modifiedAt = Date.now();
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(false);
		});

		it('when only the modifiedAt, createdAt and id fields in the CaseStatus have changed', async () => {
			updated.CaseStatus.modifiedAt = Date.now();
			updated.CaseStatus.createdAt = Date.now();
			updated.CaseStatus.id++;
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(false);
		});
	});

	describe('Should return true', () => {
		it('when the title is different', async () => {
			updated.title = 'Changed Title';
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
		});

		it('when the case email is different', async () => {
			updated.ApplicantDetails.caseEmail = 'changed@pins-test.gov';
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
		});

		it('when the case status is different', async () => {
			updated.CaseStatus[0].status = 'Changed';
			expect(publishedCaseFieldsHaveChanged(original, updated)).toBe(true);
		});
	});
});
