import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
const { eventClient } = await import('../../../infrastructure/event-client.js');

const { databaseConnector } = await import('#utils/database-connector.js');

const updatedDateFromDatabase = {
	datePINSFirstNotifiedOfProject: new Date(2023, 1, 1),
	dateProjectAppearsOnWebsite: new Date(2023, 1, 1)
};

const updatedDateResponse = {
	acceptance: {},
	preApplication: {
		datePINSFirstNotifiedOfProject: 1_675_209_600,
		dateProjectAppearsOnWebsite: 1_675_209_600
	},
	preExamination: {},
	examination: {},
	recommendation: {},
	decision: {},
	postDecision: {},
	withdrawal: {}
};
const now = 1_675_209_600_000;

jest.useFakeTimers({ now });

describe('Test Updating Key Dates', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('Provided key dates are updated and event is broadcast', async () => {
		// GIVEN
		const updateKeyDates = {
			preApplication: {
				datePINSFirstNotifiedOfProject: 1_675_209_600,
				dateProjectAppearsOnWebsite: 1_675_209_600,
				nonExistentKeyDate: 1_675_209_600,
				submissionAtPublished: 'Q3 2025',
				submissionAtInternal: null
			}
		};

		databaseConnector.case.update.mockResolvedValue({
			ApplicationDetails: updatedDateFromDatabase
		});

		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			serviceCustomer: [{ id: 4 }],
			ApplicationDetails: {
				datePINSFirstNotifiedOfProject: new Date(2023, 1, 1),
				dateProjectAppearsOnWebsite: new Date(2023, 1, 1),
				submissionAtPublished: 'Q3 2025'
			}
		});

		// WHEN
		const response = await request.patch('/applications/1/key-dates').send(updateKeyDates);

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual(updatedDateResponse);
		expect(databaseConnector.case.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				modifiedAt: new Date(2023, 1, 1),
				ApplicationDetails: {
					update: {
						datePINSFirstNotifiedOfProject: new Date(2023, 1, 1),
						dateProjectAppearsOnWebsite: new Date(2023, 1, 1),
						submissionAtPublished: 'Q3 2025',
						submissionAtInternal: null
					}
				}
			},
			select: {
				ApplicationDetails: true
			}
		});

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[
				{
					caseId: 1,
					datePINSFirstNotifiedOfProject: new Date(2023, 1, 1),
					dateProjectAppearsOnWebsite: new Date(2023, 1, 1),
					anticipatedSubmissionDateNonSpecific: 'Q3 2025',
					sourceSystem: 'ODT',
					publishStatus: 'unpublished',
					applicantIds: ['4'],
					welshLanguage: false,
					nsipOfficerIds: [],
					regions: [],
					nsipAdministrationOfficerIds: [],
					inspectorIds: [],
					interestedPartyIds: []
				}
			],
			'Update'
		);
	});
});
