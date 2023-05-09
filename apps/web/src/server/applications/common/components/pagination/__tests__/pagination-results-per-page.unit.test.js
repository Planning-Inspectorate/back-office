import { showingPage } from '../pagination-results-per-page.js';

describe('pagination results per page', () => {
	describe('#getResultsPerPage', () => {});

	describe('#showingPage', () => {
		it('showing 1 to 5 of 23 (first showing)', () => {
			const response = showingPage(1, 5, 5, 23);

			expect(response).toEqual({
				from: 1,
				of: 23,
				to: 5
			});
		});

		it('showing 6 to 10 of 23', () => {
			const response = showingPage(2, 5, 5, 23);

			expect(response).toEqual({
				from: 6,
				of: 23,
				to: 10
			});
		});

		it('showing 21 to 23 of 23 ( end show should capture the reduced item count)', () => {
			const response = showingPage(5, 5, 5, 23);

			expect(response).toEqual({
				from: 21,
				of: 23,
				to: 23
			});
		});
	});
});
