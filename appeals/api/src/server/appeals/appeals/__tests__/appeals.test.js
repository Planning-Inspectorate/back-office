import { request } from '../../../app-test.js';
import {
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_NOT_FOUND,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
} from '../../constants.js';
import {
	fullPlanningAppeal,
	householdAppeal,
	householdAppealTwo,
	linkedAppeals,
	otherAppeals
} from '../../tests/data.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');

describe('appeals routes', () => {
	describe('/appeals', () => {
		describe('GET', () => {
			test('gets appeals when not given pagination params or a search term', async () => {
				// @ts-ignore
				databaseConnector.appeal.count.mockResolvedValue(2);
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
					itemCount: 2,
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
				databaseConnector.appeal.count.mockResolvedValue(1);
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
					itemCount: 1,
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
					pageCount: 1,
					pageSize: 1
				});
			});

			test('gets appeals when given an uppercase search term', async () => {
				// @ts-ignore
				databaseConnector.appeal.count.mockResolvedValue(1);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue([householdAppeal]);

				const response = await request.get('/appeals?searchTerm=MD21');

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
								town: householdAppeal.address.town,
								county: householdAppeal.address.county,
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

				const response = await request.get('/appeals?searchTerm=md21');

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
								town: householdAppeal.address.town,
								county: householdAppeal.address.county,
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

				const response = await request.get('/appeals?searchTerm=MD21 5XY');

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
								town: householdAppeal.address.town,
								county: householdAppeal.address.county,
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

			test('returns an error if searchTerm is less than 2 characters', async () => {
				const response = await request.get('/appeals?searchTerm=a');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						searchTerm: ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS
					}
				});
			});

			test('returns an error if searchTerm is more than 8 characters', async () => {
				const response = await request.get('/appeals?searchTerm=aaaaaaaaa');

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						searchTerm: ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS
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
						lpaQuestionnaireDueDate: householdAppeal.appealTimetable.lpaQuestionnaireDueDate
					},
					appealType: householdAppeal.appealType.type,
					appellantCaseId: 1,
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
							dueDate: '2023-05-16T01:00:00.000Z',
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
					// @ts-ignore
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
						finalCommentReviewDate: fullPlanningAppeal.appealTimetable.finalCommentReviewDate,
						lpaQuestionnaireDueDate: fullPlanningAppeal.appealTimetable.lpaQuestionnaireDueDate,
						statementReviewDate: fullPlanningAppeal.appealTimetable.statementReviewDate
					},
					appealType: fullPlanningAppeal.appealType.type,
					appellantCaseId: 1,
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
							dueDate: '2023-05-16T01:00:00.000Z',
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
					startedAt: '2023-05-09'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							lpaQuestionnaireDueDate: new Date('2023-05-16T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-05-09T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-05-09T01:00:00.000Z'
				});
			});

			test('sets the timetable for a full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const response = await request.patch(`/appeals/${fullPlanningAppeal.id}`).send({
					startedAt: '2023-05-09'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							finalCommentReviewDate: new Date('2023-06-28T01:00:00.000Z'),
							lpaQuestionnaireDueDate: new Date('2023-05-16T01:00:00.000Z'),
							statementReviewDate: new Date('2023-06-14T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-05-09T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: fullPlanningAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-05-09T01:00:00.000Z'
				});
			});

			test('sets the deadline to two days after the deadline if the deadline day and the day after are bank holidays', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-12-18'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							lpaQuestionnaireDueDate: new Date('2023-12-27T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-12-18T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-12-18T01:00:00.000Z'
				});
			});

			test('sets the deadline to the Monday after the deadline if the deadline is a Saturday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-06-05'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							lpaQuestionnaireDueDate: new Date('2023-06-12T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-06-05T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-06-05T01:00:00.000Z'
				});
			});

			test('sets the deadline to the Tuesday after the deadline if the deadline is a Saturday and the Monday after is a bank holiday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.patch(`/appeals/${householdAppeal.id}`).send({
					startedAt: '2023-05-22'
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							lpaQuestionnaireDueDate: new Date('2023-05-30T01:00:00.000Z')
						}
					})
				);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					data: {
						startedAt: '2023-05-22T01:00:00.000Z',
						updatedAt: expect.any(Date)
					},
					where: {
						id: householdAppeal.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					startedAt: '2023-05-22T01:00:00.000Z'
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
});
