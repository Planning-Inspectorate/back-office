/**
 * @type {import('@pins/appeals.api').Appeals.TimetableConfig}
 */
const config = {
	timetable: {
		FPA: {
			lpaQuestionnaireDueDate: {
				daysFromStartDate: 5
			},
			statementReviewDate: {
				daysFromStartDate: 25
			},
			finalCommentReviewDate: {
				daysFromStartDate: 35
			}
		},
		HAS: {
			lpaQuestionnaireDueDate: {
				daysFromStartDate: 5
			}
		}
	}
};

export default config;
