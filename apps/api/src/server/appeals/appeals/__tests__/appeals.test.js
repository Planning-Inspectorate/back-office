import supertest from 'supertest';
import { app } from '../../../app-test.js';
import {
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_NOT_FOUND,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
} from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);
const householdAppeal = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [
		{
			status: 'awaiting_lpa_questionnaire',
			valid: true
		}
	],
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton',
		agentName: null
	},
	startedAt: new Date(2022, 4, 18),
	address: {
		addressLine1: '96 The Avenue',
		town: 'Maidstone',
		county: 'Kent',
		postcode: 'MD21 5XY'
	},
	appealTimetable: {
		id: 1,
		appealId: 1,
		finalEventsDueDate: '2023-04-16T00:00:00.000Z',
		interestedPartyRepsDueDate: '2023-05-17T00:00:00.000Z',
		questionnaireDueDate: '2023-06-18T00:00:00.000Z',
		statementDueDate: '2023-07-19T00:00:00.000Z'
	},
	appealType: {
		id: 2,
		type: 'household',
		shorthand: 'HAS'
	},
	appealDetailsFromAppellant: {
		appellantOwnsWholeSite: true,
		siteVisibleFromPublicLand: true,
		healthAndSafetyIssues: false
	},
	inspectorDecision: {
		outcome: 'Not issued yet'
	},
	siteVisit: {
		id: 1,
		appealId: 1,
		visitDate: '2022-03-31T12:00:00.000Z',
		visitSlot: '1pm - 2pm',
		visitType: 'unaccompanied'
	},
	lpaQuestionnaire: {
		id: 1,
		appealId: 1,
		communityInfrastructureLevyAdoptionDate: null,
		designatedSites: [
			{
				designatedSite: {
					name: 'cSAC',
					description: 'candidate special area of conservation'
				}
			}
		],
		developmentDescription: null,
		doesAffectAListedBuilding: null,
		doesAffectAScheduledMonument: null,
		doesSiteHaveHealthAndSafetyIssues: null,
		doesSiteRequireInspectorAccess: null,
		extraConditions: null,
		hasCommunityInfrastructureLevy: null,
		hasCompletedAnEnvironmentalStatement: null,
		hasEmergingPlan: null,
		hasExtraConditions: null,
		hasProtectedSpecies: null,
		hasRepresentationsFromOtherParties: null,
		hasResponsesOrStandingAdviceToUpload: null,
		hasStatementOfCase: null,
		hasStatutoryConsultees: null,
		hasSupplementaryPlanningDocuments: null,
		hasTreePreservationOrder: null,
		inCAOrrelatesToCA: null,
		includesScreeningOption: null,
		isCommunityInfrastructureLevyFormallyAdopted: null,
		isDevelopmentInOrNearDesignatedSites: null,
		isEnvironmentalStatementRequired: null,
		isGypsyOrTravellerSite: null,
		isListedBuilding: null,
		isPublicRightOfWay: null,
		isSensitiveArea: null,
		isSiteVisible: null,
		isTheSiteWithinAnAONB: null,
		listedBuildingDetails: [
			{
				grade: 'Grade I',
				description: 'http://localhost:8080',
				affectsListedBuilding: false
			},
			{
				grade: 'Grade II',
				description: 'http://localhost:8081',
				affectsListedBuilding: true
			}
		],
		lpaNotificationMethods: [
			{
				lpaNotificationMethod: {
					name: 'A site notice'
				}
			}
		],
		meetsOrExceedsThresholdOrCriteriaInColumn2: null,
		procedureType: {
			name: 'Written'
		},
		procedureTypeId: 3,
		receivedAt: null,
		scheduleType: {
			name: 'Schedule 1'
		},
		scheduleTypeId: 1,
		sentAt: '2023-05-24T10:34:09.286Z',
		siteWithinGreenBelt: null
	},
	linkedAppealId: 1,
	otherAppealId: 3
};
const fullPlanningAppeal = {
	...householdAppeal,
	id: 2,
	appealType: {
		id: 1,
		type: 'full planning',
		shorthand: 'FPA'
	},
	otherAppealId: null
};
const householdAppealTwo = {
	...householdAppeal,
	id: 3
};
const linkedAppeals = [
	{
		id: householdAppeal.id,
		reference: householdAppeal.reference
	},
	{
		id: fullPlanningAppeal.id,
		reference: fullPlanningAppeal.reference
	}
];
const otherAppeals = [
	{
		id: householdAppeal.id,
		reference: householdAppeal.reference
	},
	{
		id: householdAppealTwo.id,
		reference: householdAppealTwo.reference
	}
];

describe('Appeals', () => {
	describe('/appeals', () => {
		describe('GET', () => {
			test('gets appeals when not given pagination params', async () => {
				// @ts-ignore
				databaseConnector.appeal.count.mockResolvedValue(5);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue([householdAppeal, fullPlanningAppeal]);

				const response = await request.get('/appeals');

				expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith(
					expect.objectContaining({
						skip: 0,
						take: 30
					})
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					itemCount: 5,
					items: [
						{
							appealId: householdAppeal.id,
							appealReference: householdAppeal.reference,
							appealSite: {
								addressLine1: householdAppeal.address.addressLine1,
								town: householdAppeal.address.town,
								county: householdAppeal.address.county,
								postCode: householdAppeal.address.postcode
							},
							appealStatus: householdAppeal.appealStatus[0].status,
							appealType: householdAppeal.appealType.type,
							createdAt: householdAppeal.createdAt.toISOString(),
							localPlanningDepartment: householdAppeal.localPlanningDepartment
						},
						{
							appealId: fullPlanningAppeal.id,
							appealReference: fullPlanningAppeal.reference,
							appealSite: {
								addressLine1: fullPlanningAppeal.address.addressLine1,
								town: fullPlanningAppeal.address.town,
								county: fullPlanningAppeal.address.county,
								postCode: fullPlanningAppeal.address.postcode
							},
							appealStatus: fullPlanningAppeal.appealStatus[0].status,
							appealType: fullPlanningAppeal.appealType.type,
							createdAt: fullPlanningAppeal.createdAt.toISOString(),
							localPlanningDepartment: fullPlanningAppeal.localPlanningDepartment
						}
					],
					page: 1,
					pageCount: 1,
					pageSize: 30
				});
			});

			test('gets appeals when given pagination params', async () => {
				// @ts-ignore
				databaseConnector.appeal.count.mockResolvedValue(5);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue([fullPlanningAppeal]);

				const response = await request.get('/appeals?pageNumber=2&pageSize=1');

				expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith(
					expect.objectContaining({
						skip: 1,
						take: 1
					})
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					itemCount: 5,
					items: [
						{
							appealId: fullPlanningAppeal.id,
							appealReference: fullPlanningAppeal.reference,
							appealSite: {
								addressLine1: fullPlanningAppeal.address.addressLine1,
								town: fullPlanningAppeal.address.town,
								county: fullPlanningAppeal.address.county,
								postCode: fullPlanningAppeal.address.postcode
							},
							appealStatus: fullPlanningAppeal.appealStatus[0].status,
							appealType: fullPlanningAppeal.appealType.type,
							createdAt: fullPlanningAppeal.createdAt.toISOString(),
							localPlanningDepartment: fullPlanningAppeal.localPlanningDepartment
						}
					],
					page: 2,
					pageCount: 5,
					pageSize: 1
				});
			});

			test('returns an error if pageNumber is given and pageSize is not given', async () => {
				const response = await request.get('/appeals?pageNumber=1');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageNumber: ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
					}
				});
			});

			test('returns an error if pageSize is given and pageNumber is not given', async () => {
				const response = await request.get('/appeals?pageSize=1');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageSize: ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
					}
				});
			});

			test('returns an error if pageNumber is not numeric', async () => {
				const response = await request.get('/appeals?pageNumber=one&pageSize=1');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageNumber: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if pageNumber is less than 1', async () => {
				const response = await request.get('/appeals?pageNumber=-1&pageSize=1');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageNumber: ERROR_MUST_BE_GREATER_THAN_ZERO
					}
				});
			});

			test('returns an error if pageSize is not numeric', async () => {
				const response = await request.get('/appeals?pageNumber=1&pageSize=one');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageSize: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if pageSize is less than 1', async () => {
				const response = await request.get('/appeals?pageNumber=1&pageSize=-1');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageSize: ERROR_MUST_BE_GREATER_THAN_ZERO
					}
				});
			});
		});
	});

	describe('/appeals/:appealId', () => {
		describe('GET', () => {
			test('gets a single household appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appeal.findMany
					.mockResolvedValueOnce(linkedAppeals)
					.mockResolvedValueOnce(otherAppeals);

				const response = await request.get(`/appeals/${householdAppeal.id}`);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					agentName: householdAppeal.appellant.agentName,
					allocationDetails: 'F / General Allocation',
					appealId: householdAppeal.id,
					appealReference: householdAppeal.reference,
					appealSite: {
						addressLine1: householdAppeal.address.addressLine1,
						town: householdAppeal.address.town,
						county: householdAppeal.address.county,
						postCode: householdAppeal.address.postcode
					},
					appealStatus: householdAppeal.appealStatus[0].status,
					appealTimetable: {
						finalEventsDueDate: householdAppeal.appealTimetable.finalEventsDueDate,
						questionnaireDueDate: householdAppeal.appealTimetable.questionnaireDueDate
					},
					appealType: householdAppeal.appealType.type,
					appellantName: householdAppeal.appellant.name,
					decision: householdAppeal.inspectorDecision.outcome,
					isParentAppeal: true,
					linkedAppeals: [
						{
							appealId: fullPlanningAppeal.id,
							appealReference: fullPlanningAppeal.reference
						}
					],
					documentationSummary: {
						appellantCase: {
							status: 'received',
							dueDate: null
						},
						lpaQuestionnaire: {
							dueDate: '2023-06-18T00:00:00.000Z',
							status: 'received'
						}
					},
					localPlanningDepartment: householdAppeal.localPlanningDepartment,
					lpaQuestionnaireId: householdAppeal.lpaQuestionnaire.id,
					otherAppeals: [
						{
							appealId: householdAppealTwo.id,
							appealReference: householdAppealTwo.reference
						}
					],
					planningApplicationReference: householdAppeal.planningApplicationReference,
					procedureType: householdAppeal.lpaQuestionnaire.procedureType.name,
					siteVisit: {
						visitDate: householdAppeal.siteVisit.visitDate
					},
					startedAt: householdAppeal.startedAt.toISOString()
				});
			});

			test('gets a single full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);
				// @ts-ignore
				databaseConnector.appeal.findMany
					.mockResolvedValueOnce(linkedAppeals)
					.mockResolvedValueOnce([]);

				const response = await request.get(`/appeals/${fullPlanningAppeal.id}`);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					agentName: fullPlanningAppeal.appellant.agentName,
					allocationDetails: 'F / General Allocation',
					appealId: fullPlanningAppeal.id,
					appealReference: fullPlanningAppeal.reference,
					appealSite: {
						addressLine1: fullPlanningAppeal.address.addressLine1,
						town: fullPlanningAppeal.address.town,
						county: fullPlanningAppeal.address.county,
						postCode: fullPlanningAppeal.address.postcode
					},
					appealStatus: fullPlanningAppeal.appealStatus[0].status,
					appealTimetable: {
						finalEventsDueDate: fullPlanningAppeal.appealTimetable.finalEventsDueDate,
						interestedPartyRepsDueDate:
							fullPlanningAppeal.appealTimetable.interestedPartyRepsDueDate,
						questionnaireDueDate: fullPlanningAppeal.appealTimetable.questionnaireDueDate,
						statementDueDate: fullPlanningAppeal.appealTimetable.statementDueDate
					},
					appealType: fullPlanningAppeal.appealType.type,
					appellantName: fullPlanningAppeal.appellant.name,
					decision: fullPlanningAppeal.inspectorDecision.outcome,
					isParentAppeal: false,
					linkedAppeals: [
						{
							appealId: householdAppeal.id,
							appealReference: householdAppeal.reference
						}
					],
					documentationSummary: {
						appellantCase: {
							status: 'received',
							dueDate: null
						},
						lpaQuestionnaire: {
							dueDate: '2023-06-18T00:00:00.000Z',
							status: 'received'
						}
					},
					localPlanningDepartment: fullPlanningAppeal.localPlanningDepartment,
					lpaQuestionnaireId: fullPlanningAppeal.lpaQuestionnaire.id,
					otherAppeals: [],
					planningApplicationReference: fullPlanningAppeal.planningApplicationReference,
					procedureType: fullPlanningAppeal.lpaQuestionnaire.procedureType.name,
					siteVisit: {
						visitDate: fullPlanningAppeal.siteVisit.visitDate
					},
					startedAt: fullPlanningAppeal.startedAt.toISOString()
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.get('/appeals/one');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request.get('/appeals/3');

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});
		});

		describe('PATCH', () => {
			test('updates an appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-05-05'
				});

				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-05-05T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-05-05T01:00:00.000Z'
				});
			});

			test('sets the timetable for a houshold appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-05-05'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							questionnaireDueDate: new Date('2023-06-20T01:00:00.000Z'),
							finalEventsDueDate: new Date('2023-08-01T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-05-05T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-05-05T01:00:00.000Z'
				});
			});

			test('sets the timetable for a full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const response = await request.patch(`/appeals/${fullPlanningAppeal.id}`).send({
					startedAt: '2023-05-05'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							questionnaireDueDate: new Date('2023-06-20T01:00:00.000Z'),
							statementDueDate: new Date('2023-08-01T01:00:00.000Z'),
							interestedPartyRepsDueDate: new Date('2023-09-13T01:00:00.000Z'),
							finalEventsDueDate: new Date('2023-10-25T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-05-05T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: fullPlanningAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-05-05T01:00:00.000Z'
				});
			});

			test('sets the deadline to two days after the deadline if the deadline day and the day after are bank holidays', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-11-13'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							questionnaireDueDate: new Date('2023-12-27T01:00:00.000Z'),
							finalEventsDueDate: new Date('2024-02-08T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-11-13T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-11-13T01:00:00.000Z'
				});
			});

			test('sets the deadline to the Monday after the deadline if the deadline is a Saturday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-04-19'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							questionnaireDueDate: new Date('2023-06-05T01:00:00.000Z'),
							finalEventsDueDate: new Date('2023-07-17T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-04-19T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-04-19T01:00:00.000Z'
				});
			});

			test('sets the deadline to the Tuesday after the deadline if the deadline is a Saturday and the Monday after is a bank holiday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-04-13'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							questionnaireDueDate: new Date('2023-05-30T01:00:00.000Z'),
							finalEventsDueDate: new Date('2023-07-11T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-04-13T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-04-13T01:00:00.000Z'
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.patch('/appeals/one');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request.get(`/appeals/${householdAppeal.id}`);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if startedAt is not in the correct format', async () => {
				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '05/05/2023'
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if startedAt does not contain leading zeros', async () => {
				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-5-5'
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if startedAt is not a valid date', async () => {
				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-02-30'
				});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if given an incorrect field name', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				// @ts-ignore
				databaseConnector.appeal.update.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_SAVE_DATA);
				});

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAtDate: '2023-02-10'
				});

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({
					errors: {
						body: ERROR_FAILED_TO_SAVE_DATA
					}
				});
			});

			test('does not throw an error if given an empty body', async () => {
				// @ts-ignore
				databaseConnector.appeal.update.mockResolvedValue(true);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({});

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({});
			});
		});
	});

	describe('/appeals/:appealId/lpa-questionnaires/:lpaQuestionnaireId', () => {
		describe('GET', () => {
			test('gets a single lpa questionnaire', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { lpaQuestionnaire } = householdAppeal;
				const response = await request.get(
					`/appeals/${householdAppeal.id}/lpa-questionnaires/${lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					affectsListedBuildingDetails: [
						{
							grade: lpaQuestionnaire.listedBuildingDetails[1].grade,
							description: lpaQuestionnaire.listedBuildingDetails[1].description
						}
					],
					appealId: householdAppeal.id,
					appealReference: householdAppeal.reference,
					appealSite: {
						addressLine1: householdAppeal.address.addressLine1,
						town: householdAppeal.address.town,
						county: householdAppeal.address.county,
						postCode: householdAppeal.address.postcode
					},
					communityInfrastructureLevyAdoptionDate:
						lpaQuestionnaire.communityInfrastructureLevyAdoptionDate,
					designatedSites: lpaQuestionnaire.designatedSites.map(
						({ designatedSite: { name, description } }) => ({ name, description })
					),
					developmentDescription: lpaQuestionnaire.developmentDescription,
					documents: {
						communityInfrastructureLevy: 'community-infrastructure-levy.pdf',
						conservationAreaMapAndGuidance: 'conservation-area-map-and-guidance.pdf',
						consultationResponses: 'consultation-responses.pdf',
						definitiveMapAndStatement: 'right-of-way.pdf',
						emergingPlans: ['emerging-plan-1.pdf'],
						environmentalStatementResponses: 'environment-statement-responses.pdf',
						issuedScreeningOption: 'issued-screening-opinion.pdf',
						lettersToNeighbours: 'letters-to-neighbours.pdf',
						otherRelevantPolicies: ['policy-1.pdf'],
						planningOfficersReport: 'planning-officers-report.pdf',
						policiesFromStatutoryDevelopment: ['policy-a.pdf'],
						pressAdvert: 'press-advert.pdf',
						representationsFromOtherParties: ['representations-from-other-parties-1.pdf'],
						responsesOrAdvice: ['responses-or-advice.pdf'],
						screeningDirection: 'screening-direction.pdf',
						siteNotice: 'site-notice.pdf',
						supplementaryPlanningDocuments: ['supplementary-1.pdf'],
						treePreservationOrder: 'tree-preservation-order.pdf'
					},
					doesAffectAListedBuilding: lpaQuestionnaire.doesAffectAListedBuilding,
					doesAffectAScheduledMonument: lpaQuestionnaire.doesAffectAScheduledMonument,
					doesSiteHaveHealthAndSafetyIssues: lpaQuestionnaire.doesSiteHaveHealthAndSafetyIssues,
					doesSiteRequireInspectorAccess: lpaQuestionnaire.doesSiteRequireInspectorAccess,
					extraConditions: lpaQuestionnaire.extraConditions,
					hasCommunityInfrastructureLevy: lpaQuestionnaire.hasCommunityInfrastructureLevy,
					hasCompletedAnEnvironmentalStatement:
						lpaQuestionnaire.hasCompletedAnEnvironmentalStatement,
					hasEmergingPlan: lpaQuestionnaire.hasEmergingPlan,
					hasExtraConditions: lpaQuestionnaire.hasExtraConditions,
					hasProtectedSpecies: lpaQuestionnaire.hasProtectedSpecies,
					hasRepresentationsFromOtherParties: lpaQuestionnaire.hasRepresentationsFromOtherParties,
					hasResponsesOrStandingAdviceToUpload:
						lpaQuestionnaire.hasResponsesOrStandingAdviceToUpload,
					hasStatementOfCase: lpaQuestionnaire.hasStatementOfCase,
					hasStatutoryConsultees: lpaQuestionnaire.hasStatutoryConsultees,
					hasSupplementaryPlanningDocuments: lpaQuestionnaire.hasSupplementaryPlanningDocuments,
					hasTreePreservationOrder: lpaQuestionnaire.hasTreePreservationOrder,
					inCAOrrelatesToCA: lpaQuestionnaire.inCAOrrelatesToCA,
					includesScreeningOption: lpaQuestionnaire.includesScreeningOption,
					isCommunityInfrastructureLevyFormallyAdopted:
						lpaQuestionnaire.isCommunityInfrastructureLevyFormallyAdopted,
					isEnvironmentalStatementRequired: lpaQuestionnaire.isEnvironmentalStatementRequired,
					isGypsyOrTravellerSite: lpaQuestionnaire.isGypsyOrTravellerSite,
					isListedBuilding: lpaQuestionnaire.isListedBuilding,
					isPublicRightOfWay: lpaQuestionnaire.isPublicRightOfWay,
					isSensitiveArea: lpaQuestionnaire.isSensitiveArea,
					isSiteVisible: lpaQuestionnaire.isSiteVisible,
					isTheSiteWithinAnAONB: lpaQuestionnaire.isTheSiteWithinAnAONB,
					listedBuildingDetails: [
						{
							grade: lpaQuestionnaire.listedBuildingDetails[0].grade,
							description: lpaQuestionnaire.listedBuildingDetails[0].description
						}
					],
					localPlanningDepartment: householdAppeal.localPlanningDepartment,
					lpaNotificationMethods: lpaQuestionnaire.lpaNotificationMethods.map(
						({ lpaNotificationMethod: { name } }) => ({ name })
					),
					lpaQuestionnaireId: lpaQuestionnaire.id,
					meetsOrExceedsThresholdOrCriteriaInColumn2:
						lpaQuestionnaire.meetsOrExceedsThresholdOrCriteriaInColumn2,
					otherAppeals: [
						{
							appealId: 1,
							appealReference: 'APP/Q9999/D/21/725284'
						}
					],
					procedureType: lpaQuestionnaire.procedureType.name,
					scheduleType: lpaQuestionnaire.scheduleType.name,
					siteWithinGreenBelt: lpaQuestionnaire.siteWithinGreenBelt
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.get(
					`/appeals/one/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request.get(
					`/appeals/3/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if lpaQuestionnaireId is not numeric', async () => {
				const response = await request.get(`/appeals/${householdAppeal.id}/lpa-questionnaires/one`);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if lpaQuestionnaireId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.get(`/appeals/${householdAppeal.id}/lpa-questionnaires/3`);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireId: ERROR_NOT_FOUND
					}
				});
			});
		});
	});
});
