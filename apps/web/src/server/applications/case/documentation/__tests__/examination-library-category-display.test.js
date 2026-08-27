import { getExaminationLibraryCategoryDisplay } from '../utils/examination-library-category-display';

describe('getExaminationLibraryCategoryDisplay', () => {
	const caseId = 100004119;

	it('maps an APP category to the Application documents parent category', () => {
		expect(getExaminationLibraryCategoryDisplay('APP', 'Reports', caseId)).toEqual({
			name: 'Application documents (APP)',
			href: `/applications-service/case/${caseId}/examination-library/application-documents`
		});
	});

	it('maps a standard category to its examination library page', () => {
		expect(
			getExaminationLibraryCategoryDisplay('AoC', 'Adequacy of consultation responses', caseId)
		).toEqual({
			name: 'Adequacy of consultation responses (AoC)',
			href: `/applications-service/case/${caseId}/examination-library/adequacy-of-consultation-responses`
		});
	});

	it('does not provide a link for no examination library category', () => {
		expect(
			getExaminationLibraryCategoryDisplay('NELC', 'No examination library category', caseId)
		).toEqual({
			name: 'No examination library category',
			href: null
		});
	});

	it('falls back to the category name when the code is not recognised', () => {
		expect(getExaminationLibraryCategoryDisplay('UNKNOWN', 'Unknown category', caseId)).toEqual({
			name: 'Unknown category',
			href: null
		});
	});

	it('returns an empty display when there is no category', () => {
		expect(getExaminationLibraryCategoryDisplay(null, null, caseId)).toEqual({
			name: '',
			href: null
		});
	});
});
