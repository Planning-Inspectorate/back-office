import { getExaminationLibraryCategoryDisplay } from '../utils/examination-library-category-display';

describe('getExaminationLibraryCategoryDisplay', () => {
	const caseId = 100004119;

	it('maps an APP category to the Application documents parent category', () => {
		expect(getExaminationLibraryCategoryDisplay('APP', 'Reports', caseId)).toEqual({
			name: 'Application documents (APP)',
			href: `/applications-service/case/${caseId}/examination-library/category/application-documents`
		});
	});

	it('maps a standard category to its examination library page', () => {
		expect(
			getExaminationLibraryCategoryDisplay('AoC', 'Adequacy of consultation responses', caseId)
		).toEqual({
			name: 'Adequacy of consultation responses (AoC)',
			href: `/applications-service/case/${caseId}/examination-library/category/adequacy-of-consultation-responses`
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

	it('maps an events and hearings category to its dynamic examination library page', () => {
		expect(getExaminationLibraryCategoryDisplay('EV1', 'open floor hearing 1', caseId)).toEqual({
			name: 'open floor hearing 1 (EV1)',
			href: `/applications-service/case/${caseId}/examination-library/category/events-and-hearings/open-floor-hearing-1`
		});
	});

	it('maps a procedural deadline category to its dynamic examination library page', () => {
		expect(getExaminationLibraryCategoryDisplay('PDA', 'Procedural deadline A', caseId)).toEqual({
			name: 'Procedural deadline A (PDA)',
			href: `/applications-service/case/${caseId}/examination-library/category/procedural-deadlines/procedural-deadline-a`
		});
	});

	it('maps a deadline category to its dynamic examination library page', () => {
		expect(getExaminationLibraryCategoryDisplay('REP1', 'Deadline 1', caseId)).toEqual({
			name: 'Deadline 1 (REP1)',
			href: `/applications-service/case/${caseId}/examination-library/category/deadlines/deadline-1`
		});
	});

	it('maps a deadline with a letter suffix to its dynamic examination library page', () => {
		expect(getExaminationLibraryCategoryDisplay('REP1a', 'Deadline 1a', caseId)).toEqual({
			name: 'Deadline 1a (REP1a)',
			href: `/applications-service/case/${caseId}/examination-library/category/deadlines/deadline-1a`
		});
	});
});
