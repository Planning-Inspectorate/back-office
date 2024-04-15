import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import { NSIP_PROJECT, SERVICE_USER } from '#infrastructure/topics.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';
import { mockApplicationGet } from '#utils/application-factory-for-tests.js';
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

		databaseConnector.case.findUnique.mockImplementation(
			mockApplicationGet(
				{
					id: 1,
					reference: 'TEST',
					title: 'Test Update Key Dates',
					applicantId: 4,
					description: 'Test Update Key Dates description'
				},
				{
					applicant: { id: 4 },
					gridReference: {
						northing: 234567,
						easting: 765432
					},
					ApplicationDetails: {
						submissionAtPublished: 'Q3 2025',
						regions: [{ region: { name: 'east_midlands' } }],
						locationDescription: 'Location description',
						caseEmail: 'test@test.com',
						zoomLevel: {
							name: 'country'
						},
						confirmedDateOfDecision: null,
						confirmedStartOfExamination: null,
						dateIAPIDue: null,
						dateOfDCOAcceptance: null,
						dateOfDCOSubmission: null,
						dateOfNonAcceptance: null,
						dateOfReOpenRelevantRepresentationClose: null,
						dateOfReOpenRelevantRepresentationStart: null,
						dateOfRecommendations: null,
						dateOfRelevantRepresentationClose: null,
						dateOfRepresentationPeriodOpen: null,
						datePINSFirstNotifiedOfProject: new Date(2023, 1, 1),
						dateProjectAppearsOnWebsite: new Date(2023, 1, 1),
						dateProjectWithdrawn: null,
						dateRRepAppearOnWebsite: null,
						rule6LetterPublishDate: null,
						rule8LetterPublishDate: null,
						scopingOpinionIssued: null,
						scopingOpinionSought: null,
						screeningOpinionIssued: null,
						screeningOpinionSought: null,
						secretaryOfState: null,
						section46Notification: null,
						stage4ExtensionToExamCloseDate: null,
						stage5ExtensionToDecisionDeadline: null,
						stage5ExtensionToRecommendationDeadline: null,
						dateSection58NoticeReceived: null,
						dateTimeExaminationEnds: null,
						deadlineForAcceptanceDecision: null,
						deadlineForCloseOfExamination: null,
						deadlineForDecision: null,
						deadlineForSubmissionOfRecommendation: null,
						extensionToDateRelevantRepresentationsClose: null,
						notificationDateForPMAndEventsDirectlyFollowingPM: null,
						preliminaryMeetingStartDate: null,
						jRPeriodEndDate: null,
						subSectorId: 1,
						subSector: {
							id: 1,
							abbreviation: 'BC01',
							name: 'office_use',
							displayNameEn: 'Office Use',
							displayNameCy: 'Office Use',
							sectorId: 1,
							sector: {
								id: 1,
								abbreviation: 'BC',
								name: 'business_and_commercial',
								displayNameEn: 'Business and Commercial',
								displayNameCy: 'Business and Commercial'
							}
						}
					}
				}
			)
		);

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

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_PROJECT,
			buildPayloadEventsForSchema(NSIP_PROJECT, {
				caseId: 1,
				applicantId: '4',
				caseReference: 'TEST',
				datePINSFirstNotifiedOfProject: new Date(2023, 1, 1).toISOString(),
				dateProjectAppearsOnWebsite: new Date(2023, 1, 1).toISOString(),
				anticipatedSubmissionDateNonSpecific: 'Q3 2025',
				sourceSystem: 'back-office-applications',
				publishStatus: 'unpublished',
				welshLanguage: false,
				nsipOfficerIds: [],
				regions: ['east_midlands'],
				secretaryOfState: null,
				nsipAdministrationOfficerIds: [],
				inspectorIds: [],
				mapZoomLevel: 'country',
				northing: 234567,
				easting: 765432,
				projectDescription: 'Test Update Key Dates description',
				projectEmailAddress: 'test@test.com',
				projectLocation: 'Location description',
				projectName: 'Test Update Key Dates',
				projectType: 'BC01 - Office Use',
				sector: 'BC - Business and Commercial',
				stage: 'draft'
			}),
			'Update'
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			buildPayloadEventsForSchema(SERVICE_USER, {
				caseReference: 'TEST',
				id: '4',
				serviceUserType: 'Applicant',
				sourceSuid: '4',
				sourceSystem: 'back-office-applications'
			}),
			'Update',
			{ entityType: 'Applicant' }
		);
	});
});
