/**
 * @type {import('@pins/api').Appeals.TimetableConfig}
 */
const config = {
	timetable: {
		FPA: {
			questionnaireDueDate: {
				daysFromStartDate: 30
			},
			statementDueDate: {
				daysFromStartDate: 60
			},
			interestedPartyRepsDueDate: {
				daysFromStartDate: 90
			},
			finalEventsDueDate: {
				daysFromStartDate: 120
			}
		},
		HAS: {
			questionnaireDueDate: {
				daysFromStartDate: 30
			},
			finalEventsDueDate: {
				daysFromStartDate: 60
			}
		}
	}
};

export default config;
