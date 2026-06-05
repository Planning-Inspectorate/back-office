import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const estimatedPrelimMeetingDate = new Date(Date.UTC(2023, 6, 27));

describe('Test Retrieval of Key Dates', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('Key dates are returned in UNIX Timestamp Seconds Format', async () => {
		// GIVEN
		const keyDatesInDatabase = {
			datePINSFirstNotifiedOfProject: new Date(2023, 1, 1),
			dateProjectAppearsOnWebsite: new Date(2023, 1, 1),
			submissionAtPublished: 'Q3 2025',
			estimatedPrelimMeetingDate
		};

		databaseConnector.applicationDetails.findUnique.mockResolvedValue(keyDatesInDatabase);

		// WHEN
		const response = await request.get('/applications/1/key-dates').send();

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			acceptance: {},
			preApplication: {
				datePINSFirstNotifiedOfProject: 1_675_209_600,
				dateProjectAppearsOnWebsite: 1_675_209_600,
				submissionAtPublished: 'Q3 2025'
			},
			preExamination: {
				estimatedPrelimMeetingDate: 1_690_416_000
			},
			examination: {},
			recommendation: {},
			decision: {},
			postDecision: {},
			withdrawal: {}
		});
	});
});
