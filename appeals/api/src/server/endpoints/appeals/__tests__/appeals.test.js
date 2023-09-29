import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import {
	AUDIT_TRAIL_ASSIGNED_CASE_OFFICER,
	AUDIT_TRAIL_ASSIGNED_INSPECTOR,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_SET_AS_HEADER,
	ERROR_MUST_BE_UUID,
	ERROR_NOT_FOUND,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
} from '../../constants.js';
import {
	azureAdUserId,
	fullPlanningAppeal,
	householdAppeal,
	householdAppealAppellantCaseIncomplete,
	linkedAppeals,
	otherAppeals
} from '#tests/data.js';
import formatAddress from '#utils/format-address.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';

const { databaseConnector } = await import('#utils/database-connector.js');

describe('appeals routes', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('/appeals', () => {
		describe('GET', () => {
			test('gets appeals when not given pagination params or a search term', async () => {
				// @ts-ignore
				databaseConnector.appeal.count.mockResolvedValue(2);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue([householdAppeal, fullPlanningAppeal]);

				const response = await request.get('/appeals').set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith(
					expect.objectContaining({
						skip: 0,
						take: 30
					})
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					itemCount: 2,
					items: [
						{
							appealId: householdAppeal.id,
							appealReference: householdAppeal.reference,
							appealSite: {
								addressLine1: householdAppeal.address.addressLine1,
								addressLine2: householdAppeal.address.addressLine2,
								town: householdAppeal.address.addressTown,
								county: householdAppeal.address.addressCounty,
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
								addressLine2: fullPlanningAppeal.address.addressLine2,
								town: fullPlanningAppeal.address.addressTown,
								county: fullPlanningAppeal.address.addressCounty,
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
				databaseConnector.appeal.count.mockResolvedValue(1);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue([fullPlanningAppeal]);

				const response = await request
					.get('/appeals?pageNumber=2&pageSize=1')
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith(
					expect.objectContaining({
						skip: 1,
						take: 1
					})
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					itemCount: 1,
					items: [
						{
							appealId: fullPlanningAppeal.id,
							appealReference: fullPlanningAppeal.reference,
							appealSite: {
								addressLine1: fullPlanningAppeal.address.addressLine1,
								addressLine2: fullPlanningAppeal.address.addressLine2,
								town: fullPlanningAppeal.address.addressTown,
								county: fullPlanningAppeal.address.addressCounty,
								postCode: fullPlanningAppeal.address.postcode
							},
							appealStatus: fullPlanningAppeal.appealStatus[0].status,
							appealType: fullPlanningAppeal.appealType.type,
							createdAt: fullPlanningAppeal.createdAt.toISOString(),
							localPlanningDepartment: fullPlanningAppeal.localPlanningDepartment
						}
					],
					page: 2,
					pageCount: 1,
					pageSize: 1
				});
			});

			test('gets appeals when given an uppercase search term', async () => {
				// @ts-ignore
				databaseConnector.appeal.count.mockResolvedValue(1);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue([householdAppeal]);

				const response = await request
					.get('/appeals?searchTerm=MD21')
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith(
					expect.objectContaining({
						where: {
							OR: [
								{
									reference: {
										contains: 'MD21'
									}
								},
								{
									address: {
										postcode: {
											contains: 'MD21'
										}
									}
								}
							],
							appealStatus: {
								some: {
									valid: true
								}
							}
						}
					})
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					itemCount: 1,
					items: [
						{
							appealId: householdAppeal.id,
							appealReference: householdAppeal.reference,
							appealSite: {
								addressLine1: householdAppeal.address.addressLine1,
								addressLine2: householdAppeal.address.addressLine2,
								town: householdAppeal.address.addressTown,
								county: householdAppeal.address.addressCounty,
								postCode: householdAppeal.address.postcode
							},
							appealStatus: householdAppeal.appealStatus[0].status,
							appealType: householdAppeal.appealType.type,
							createdAt: householdAppeal.createdAt.toISOString(),
							localPlanningDepartment: householdAppeal.localPlanningDepartment
						}
					],
					page: 1,
					pageCount: 1,
					pageSize: 30
				});
			});

			test('gets appeals when given a lowercase search term', async () => {
				// @ts-ignore
				databaseConnector.appeal.count.mockResolvedValue(1);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue([householdAppeal]);

				const response = await request
					.get('/appeals?searchTerm=md21')
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith(
					expect.objectContaining({
						where: {
							OR: [
								{
									reference: {
										contains: 'md21'
									}
								},
								{
									address: {
										postcode: {
											contains: 'md21'
										}
									}
								}
							],
							appealStatus: {
								some: {
									valid: true
								}
							}
						}
					})
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					itemCount: 1,
					items: [
						{
							appealId: householdAppeal.id,
							appealReference: householdAppeal.reference,
							appealSite: {
								addressLine1: householdAppeal.address.addressLine1,
								addressLine2: householdAppeal.address.addressLine2,
								town: householdAppeal.address.addressTown,
								county: householdAppeal.address.addressCounty,
								postCode: householdAppeal.address.postcode
							},
							appealStatus: householdAppeal.appealStatus[0].status,
							appealType: householdAppeal.appealType.type,
							createdAt: householdAppeal.createdAt.toISOString(),
							localPlanningDepartment: householdAppeal.localPlanningDepartment
						}
					],
					page: 1,
					pageCount: 1,
					pageSize: 30
				});
			});

			test('gets appeals when given a search term with a space', async () => {
				// @ts-ignore
				databaseConnector.appeal.count.mockResolvedValue(1);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue([householdAppeal]);

				const response = await request
					.get('/appeals?searchTerm=MD21 5XY')
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith(
					expect.objectContaining({
						where: {
							OR: [
								{
									reference: {
										contains: 'MD21 5XY'
									}
								},
								{
									address: {
										postcode: {
											contains: 'MD21 5XY'
										}
									}
								}
							],
							appealStatus: {
								some: {
									valid: true
								}
							}
						}
					})
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					itemCount: 1,
					items: [
						{
							appealId: householdAppeal.id,
							appealReference: householdAppeal.reference,
							appealSite: {
								addressLine1: householdAppeal.address.addressLine1,
								addressLine2: householdAppeal.address.addressLine2,
								town: householdAppeal.address.addressTown,
								county: householdAppeal.address.addressCounty,
								postCode: householdAppeal.address.postcode
							},
							appealStatus: householdAppeal.appealStatus[0].status,
							appealType: householdAppeal.appealType.type,
							createdAt: householdAppeal.createdAt.toISOString(),
							localPlanningDepartment: householdAppeal.localPlanningDepartment
						}
					],
					page: 1,
					pageCount: 1,
					pageSize: 30
				});
			});

			test('returns an error if pageNumber is given and pageSize is not given', async () => {
				const response = await request
					.get('/appeals?pageNumber=1')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageNumber: ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
					}
				});
			});

			test('returns an error if pageSize is given and pageNumber is not given', async () => {
				const response = await request
					.get('/appeals?pageSize=1')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageSize: ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
					}
				});
			});

			test('returns an error if pageNumber is not numeric', async () => {
				const response = await request
					.get('/appeals?pageNumber=one&pageSize=1')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageNumber: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if pageNumber is less than 1', async () => {
				const response = await request
					.get('/appeals?pageNumber=-1&pageSize=1')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageNumber: ERROR_MUST_BE_GREATER_THAN_ZERO
					}
				});
			});

			test('returns an error if pageSize is not numeric', async () => {
				const response = await request
					.get('/appeals?pageNumber=1&pageSize=one')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageSize: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if pageSize is less than 1', async () => {
				const response = await request
					.get('/appeals?pageNumber=1&pageSize=-1')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						pageSize: ERROR_MUST_BE_GREATER_THAN_ZERO
					}
				});
			});

			test('returns an error if searchTerm is less than 2 characters', async () => {
				const response = await request
					.get('/appeals?searchTerm=a')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						searchTerm: ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS
					}
				});
			});

			test('returns an error if searchTerm is more than 8 characters', async () => {
				const response = await request
					.get('/appeals?searchTerm=aaaaaaaaa')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						searchTerm: ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS
					}
				});
			});

			test('returns an error if azureAdUserId is not set as a header', async () => {
				const response = await request.get('/appeals');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						azureAdUserId: ERROR_MUST_BE_SET_AS_HEADER
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
					// @ts-ignore
					.mockResolvedValueOnce(linkedAppeals)
					.mockResolvedValueOnce(otherAppeals);

				const response = await request
					.get(`/appeals/${householdAppeal.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					agentName: householdAppeal.appellant.agentName,
					allocationDetails: null,
					appealId: householdAppeal.id,
					appealReference: householdAppeal.reference,
					appealSite: {
						addressLine1: householdAppeal.address.addressLine1,
						addressLine2: householdAppeal.address.addressLine2,
						town: householdAppeal.address.addressTown,
						county: householdAppeal.address.addressCounty,
						postCode: householdAppeal.address.postcode
					},
					appealStatus: householdAppeal.appealStatus[0].status,
					appealTimetable: {
						appealTimetableId: householdAppeal.appealTimetable.id,
						lpaQuestionnaireDueDate: householdAppeal.appealTimetable.lpaQuestionnaireDueDate
					},
					appealType: householdAppeal.appealType.type,
					appellantCaseId: 1,
					appellantName: householdAppeal.appellant.name,
					caseOfficer: householdAppeal.caseOfficer.azureAdUserId,
					decision: householdAppeal.inspectorDecision.outcome,
					documentationSummary: {
						appellantCase: {
							status: 'received',
							dueDate: householdAppeal.dueDate
						},
						lpaQuestionnaire: {
							dueDate: '2023-05-16T01:00:00.000Z',
							status: 'received'
						}
					},
					healthAndSafety: {
						appellantCase: {
							details: householdAppeal.appellantCase.healthAndSafetyIssues,
							hasIssues: householdAppeal.appellantCase.hasHealthAndSafetyIssues
						},
						lpaQuestionnaire: {
							details: householdAppeal.lpaQuestionnaire.healthAndSafetyDetails,
							hasIssues: householdAppeal.lpaQuestionnaire.doesSiteHaveHealthAndSafetyIssues
						}
					},
					inspector: householdAppeal.inspector.azureAdUserId,
					inspectorAccess: {
						appellantCase: {
							details: householdAppeal.appellantCase.visibilityRestrictions,
							isRequired: !householdAppeal.appellantCase.isSiteVisibleFromPublicRoad
						},
						lpaQuestionnaire: {
							details: householdAppeal.lpaQuestionnaire.inspectorAccessDetails,
							isRequired: householdAppeal.lpaQuestionnaire.doesSiteRequireInspectorAccess
						}
					},
					isParentAppeal: true,
					linkedAppeals: [
						{
							appealId: fullPlanningAppeal.id,
							appealReference: fullPlanningAppeal.reference
						}
					],
					localPlanningDepartment: householdAppeal.localPlanningDepartment,
					lpaQuestionnaireId: householdAppeal.lpaQuestionnaire.id,
					neighbouringSite: {
						contacts: householdAppeal.lpaQuestionnaire.neighbouringSiteContact.map((contact) => ({
							address: formatAddress(contact.address),
							firstName: contact.firstName,
							lastName: contact.lastName
						})),
						isAffected: householdAppeal.lpaQuestionnaire.isAffectingNeighbouringSites
					},
					otherAppeals: [
						{
							appealId: householdAppealAppellantCaseIncomplete.id,
							appealReference: householdAppealAppellantCaseIncomplete.reference
						}
					],
					planningApplicationReference: householdAppeal.planningApplicationReference,
					procedureType: householdAppeal.lpaQuestionnaire.procedureType.name,
					siteVisit: {
						siteVisitId: householdAppeal.siteVisit.id,
						visitDate: householdAppeal.siteVisit.visitDate,
						visitStartTime: householdAppeal.siteVisit.visitStartTime,
						visitEndTime: householdAppeal.siteVisit.visitEndTime,
						visitType: householdAppeal.siteVisit.siteVisitType.name
					},
					startedAt: householdAppeal.startedAt.toISOString()
				});
			});

			test('gets a single full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);
				// @ts-ignore
				databaseConnector.appeal.findMany
					// @ts-ignore
					.mockResolvedValueOnce(linkedAppeals)
					.mockResolvedValueOnce([]);

				const response = await request
					.get(`/appeals/${fullPlanningAppeal.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					agentName: fullPlanningAppeal.appellant.agentName,
					allocationDetails: null,
					appealId: fullPlanningAppeal.id,
					appealReference: fullPlanningAppeal.reference,
					appealSite: {
						addressLine1: fullPlanningAppeal.address.addressLine1,
						addressLine2: fullPlanningAppeal.address.addressLine2,
						town: fullPlanningAppeal.address.addressTown,
						county: fullPlanningAppeal.address.addressCounty,
						postCode: fullPlanningAppeal.address.postcode
					},
					appealStatus: fullPlanningAppeal.appealStatus[0].status,
					appealTimetable: {
						appealTimetableId: fullPlanningAppeal.appealTimetable.id,
						finalCommentReviewDate: fullPlanningAppeal.appealTimetable.finalCommentReviewDate,
						lpaQuestionnaireDueDate: fullPlanningAppeal.appealTimetable.lpaQuestionnaireDueDate,
						statementReviewDate: fullPlanningAppeal.appealTimetable.statementReviewDate
					},
					appealType: fullPlanningAppeal.appealType.type,
					appellantCaseId: 1,
					appellantName: fullPlanningAppeal.appellant.name,
					caseOfficer: fullPlanningAppeal.caseOfficer.azureAdUserId,
					decision: fullPlanningAppeal.inspectorDecision.outcome,
					documentationSummary: {
						appellantCase: {
							status: 'received',
							dueDate: fullPlanningAppeal.dueDate
						},
						lpaQuestionnaire: {
							dueDate: '2023-05-16T01:00:00.000Z',
							status: 'received'
						}
					},
					healthAndSafety: {
						appellantCase: {
							details: fullPlanningAppeal.appellantCase.healthAndSafetyIssues,
							hasIssues: fullPlanningAppeal.appellantCase.hasHealthAndSafetyIssues
						},
						lpaQuestionnaire: {
							details: fullPlanningAppeal.lpaQuestionnaire.healthAndSafetyDetails,
							hasIssues: fullPlanningAppeal.lpaQuestionnaire.doesSiteHaveHealthAndSafetyIssues
						}
					},
					inspector: fullPlanningAppeal.inspector.azureAdUserId,
					inspectorAccess: {
						appellantCase: {
							details: fullPlanningAppeal.appellantCase.visibilityRestrictions,
							isRequired: !fullPlanningAppeal.appellantCase.isSiteVisibleFromPublicRoad
						},
						lpaQuestionnaire: {
							details: fullPlanningAppeal.lpaQuestionnaire.inspectorAccessDetails,
							isRequired: fullPlanningAppeal.lpaQuestionnaire.doesSiteRequireInspectorAccess
						}
					},
					isParentAppeal: false,
					linkedAppeals: [
						{
							appealId: householdAppeal.id,
							appealReference: householdAppeal.reference
						}
					],
					localPlanningDepartment: fullPlanningAppeal.localPlanningDepartment,
					lpaQuestionnaireId: fullPlanningAppeal.lpaQuestionnaire.id,
					neighbouringSite: {
						contacts: fullPlanningAppeal.lpaQuestionnaire.neighbouringSiteContact.map(
							(contact) => ({
								address: formatAddress(contact.address),
								firstName: contact.firstName,
								lastName: contact.lastName
							})
						),
						isAffected: fullPlanningAppeal.lpaQuestionnaire.isAffectingNeighbouringSites
					},
					otherAppeals: [],
					planningApplicationReference: fullPlanningAppeal.planningApplicationReference,
					procedureType: fullPlanningAppeal.lpaQuestionnaire.procedureType.name,
					siteVisit: {
						siteVisitId: fullPlanningAppeal.siteVisit.id,
						visitDate: fullPlanningAppeal.siteVisit.visitDate,
						visitStartTime: fullPlanningAppeal.siteVisit.visitStartTime,
						visitEndTime: fullPlanningAppeal.siteVisit.visitEndTime,
						visitType: fullPlanningAppeal.siteVisit.siteVisitType.name
					},
					startedAt: fullPlanningAppeal.startedAt.toISOString()
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.get('/appeals/one').set('azureAdUserId', azureAdUserId);

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

				const response = await request.get('/appeals/3').set('azureAdUserId', azureAdUserId);

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

				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						startedAt: '2023-05-05'
					})
					.set('azureAdUserId', azureAdUserId);

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

			test('assigns a case officer to an appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue(householdAppeal.caseOfficer);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						caseOfficer: householdAppeal.caseOfficer.azureAdUserId
					})
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						caseOfficerUserId: householdAppeal.caseOfficer.id,
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(databaseConnector.auditTrail.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						details: stringTokenReplacement(AUDIT_TRAIL_ASSIGNED_CASE_OFFICER, [
							householdAppeal.caseOfficer.azureAdUserId
						]),
						loggedAt: expect.any(Date),
						userId: householdAppeal.caseOfficer.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					caseOfficer: householdAppeal.caseOfficer.azureAdUserId
				});
			});

			test('removes a case officer from an appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue(householdAppeal.caseOfficer);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						caseOfficer: null
					})
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						caseOfficerUserId: null,
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(databaseConnector.auditTrail.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					caseOfficer: null
				});
			});

			test('assigns an inspector to an appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue(householdAppeal.inspector);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						inspector: householdAppeal.inspector.azureAdUserId
					})
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						inspectorUserId: householdAppeal.inspector.id,
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(databaseConnector.auditTrail.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						details: stringTokenReplacement(AUDIT_TRAIL_ASSIGNED_INSPECTOR, [
							householdAppeal.inspector.azureAdUserId
						]),
						loggedAt: expect.any(Date),
						userId: householdAppeal.inspector.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					inspector: householdAppeal.inspector.azureAdUserId
				});
			});

			test('removes an inspector from an appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue(householdAppeal.inspector);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						inspector: null
					})
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						inspectorUserId: null,
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(databaseConnector.auditTrail.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					inspector: null
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.patch('/appeals/one').set('azureAdUserId', azureAdUserId);

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

				const response = await request
					.get(`/appeals/${householdAppeal.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if startedAt is not in the correct format', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						startedAt: '05/05/2023'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if startedAt does not contain leading zeros', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						startedAt: '2023-5-5'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if startedAt is not a valid date', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						startedAt: '2023-02-30'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if caseOfficer is not a valid uuid', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						caseOfficer: '1'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						caseOfficer: ERROR_MUST_BE_UUID
					}
				});
			});

			test('returns an error if inspector is not a valid uuid', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						inspector: '1'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						inspector: ERROR_MUST_BE_UUID
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

				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({
						startedAtDate: '2023-02-10'
					})
					.set('azureAdUserId', azureAdUserId);

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

				const response = await request
					.patch(`/appeals/${householdAppeal.id}`)
					.send({})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({});
			});
		});
	});
});
