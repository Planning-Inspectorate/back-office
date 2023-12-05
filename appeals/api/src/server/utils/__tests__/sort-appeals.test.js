import { sortAppeals } from '#utils/appeal-sorter.js';

describe('Sort appeals', () => {
	test('match results', () => {
		const appeals = [
			{
				createdAt: '2023-01-01T00:00:55.000Z',
				appealId: 2,
				appealReference: 'APP/Q9999/D/21/33813',
				appealStatus: 'lpa_questionnaire_due',
				appealType: 'Householder',
				appealTimetable: {
					lpaQuestionnaireDueDate: '2023-10-01T00:00:55.000Z'
				}
			},
			{
				createdAt: '2023-01-03T00:00:55.000Z',
				appealId: 4,
				appealReference: 'APP/Q9999/D/21/33813',
				appealStatus: 'statement_review',
				appealType: 'Householder',
				appealTimetable: {
					statementReviewDate: '2023-11-30T00:00:55.000Z'
				}
			},
			{
				createdAt: '2023-01-01T00:00:55.000Z',
				appealId: 3,
				appealReference: 'APP/Q9999/D/21/33813',
				appealStatus: 'ready_to_start',
				appealType: 'Householder'
			},
			{
				createdAt: '2023-11-02T00:00:55.000Z',
				appealId: 1,
				appealReference: 'APP/Q9999/D/21/33813',
				appealStatus: 'ready_to_start',
				appealType: 'Householder'
			},
			{
				createdAt: '2023-01-02T00:00:55.000Z',
				appealId: 6,
				appealReference: 'APP/Q9999/D/21/33813',
				appealStatus: 'ready_to_start',
				appealType: 'Householder'
			},
			{
				createdAt: '2023-01-18T00:00:55.000Z',
				appealId: 5,
				appealReference: 'APP/Q9999/D/21/33813',
				appealStatus: 'final_comment_review',
				appealType: 'Householder',
				appealTimetable: {
					finalCommentReviewDate: '2023-11-01T00:00:55.000Z'
				}
			}
		];

		//@ts-ignore
		const data = sortAppeals(appeals);

		const result = data.map((a) => a?.appealId);

		expect(result).toEqual([3, 6, 2, 5, 1, 4]);
	});
});
