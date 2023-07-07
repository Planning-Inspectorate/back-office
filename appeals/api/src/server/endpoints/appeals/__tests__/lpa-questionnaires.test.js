// @ts-nocheck
import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import {
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_INCOMPLETE_REASONS_ONLY_FOR_INCOMPLETE_OUTCOME,
	ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME,
	ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED,
	ERROR_MAX_LENGTH_300_CHARACTERS,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_STRING,
	ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS,
	ERROR_NOT_FOUND,
	ERROR_OTHER_NOT_VALID_REASONS_REQUIRED,
	ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS,
	STATE_TARGET_ARRANGE_SITE_VISIT,
	STATE_TARGET_STATEMENT_REVIEW
} from '../../constants.js';
import {
	baseExpectedLPAQuestionnaireResponse,
	fullPlanningAppeal,
	householdAppeal,
	householdAppealWithCompleteLPAQuestionnaire,
	householdAppealWithIncompleteLPAQuestionnaire,
	lpaQuestionnaireIncompleteReasons,
	lpaQuestionnaireValidationOutcomes,
	otherAppeals
} from '../../../tests/data.js';
import { createManyToManyRelationData } from '../appeals.service.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');

describe('lpa questionnaires routes', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('/appeals/:appealId/lpa-questionnaires/:lpaQuestionnaireId', () => {
		describe('GET', () => {
			test('gets a single lpa questionnaire with no outcome', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue(otherAppeals);

				const { lpaQuestionnaire } = householdAppeal;
				const response = await request.get(
					`/appeals/${householdAppeal.id}/lpa-questionnaires/${lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(baseExpectedLPAQuestionnaireResponse(lpaQuestionnaire));
			});

			test('gets a single lpa questionnaire with an outcome of Complete', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(
					householdAppealWithCompleteLPAQuestionnaire
				);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue(otherAppeals);

				const { lpaQuestionnaire } = householdAppealWithCompleteLPAQuestionnaire;
				const response = await request.get(
					`/appeals/${householdAppeal.id}/lpa-questionnaires/${lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...baseExpectedLPAQuestionnaireResponse(lpaQuestionnaire),
					validationOutcome: lpaQuestionnaire.lpaQuestionnaireValidationOutcome.name
				});
			});

			test('gets a single lpa questionnaire with an outcome of Incomplete', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(
					householdAppealWithIncompleteLPAQuestionnaire
				);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue(otherAppeals);

				const { lpaQuestionnaire } = householdAppealWithIncompleteLPAQuestionnaire;
				const response = await request.get(
					`/appeals/${householdAppeal.id}/lpa-questionnaires/${lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...baseExpectedLPAQuestionnaireResponse(lpaQuestionnaire),
					incompleteReasons:
						lpaQuestionnaire.lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire.map(
							({ lpaQuestionnaireIncompleteReason }) => ({
								name: lpaQuestionnaireIncompleteReason.name
							})
						),
					otherNotValidReasons: lpaQuestionnaire.otherNotValidReasons,
					validationOutcome: lpaQuestionnaire.lpaQuestionnaireValidationOutcome.name
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

		describe('PATCH', () => {
			test('updates an lpa questionnaire when the validation outcome is complete for a household appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue({
					...householdAppeal,
					appealStatus: [
						{
							status: 'lpa_questionnaire_due',
							valid: true
						}
					]
				});
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const body = {
					validationOutcome: 'complete'
				};
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[0].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_ARRANGE_SITE_VISIT,
						valid: true
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.update
				).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates an lpa questionnaire when the validation outcome is Complete for a full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue({
					...fullPlanningAppeal,
					appealStatus: [
						{
							status: 'lpa_questionnaire_due',
							valid: true
						}
					]
				});
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const body = {
					validationOutcome: 'Complete'
				};
				const response = await request
					.patch(
						`/appeals/${fullPlanningAppeal.id}/lpa-questionnaires/${fullPlanningAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[0].id
					},
					where: {
						id: fullPlanningAppeal.lpaQuestionnaire.id
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: fullPlanningAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_STATEMENT_REVIEW,
						valid: true
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.update
				).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates an lpa questionnaire when the validation outcome is incomplete and lpaQuestionnaireDueDate is a weekday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const body = {
					incompleteReasons: [1, 2, 3],
					lpaQuestionnaireDueDate: '2023-06-21',
					otherNotValidReasons: 'Another incomplete reason',
					validationOutcome: 'incomplete'
				};
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id,
						otherNotValidReasons: 'Another incomplete reason'
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons,
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2023-06-21T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is incomplete and lpaQuestionnaireDueDate is a weekend day with a bank holiday on the following Monday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const body = {
					incompleteReasons: [1, 2, 3],
					lpaQuestionnaireDueDate: '2023-04-29',
					otherNotValidReasons: 'Another incomplete reason',
					validationOutcome: 'incomplete'
				};
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id,
						otherNotValidReasons: 'Another incomplete reason'
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons,
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2023-05-02T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is incomplete and lpaQuestionnaireDueDate is a bank holiday Friday with a folowing bank holiday Monday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const body = {
					incompleteReasons: [1, 2, 3],
					lpaQuestionnaireDueDate: '2023-04-07',
					otherNotValidReasons: 'Another incomplete reason',
					validationOutcome: 'incomplete'
				};
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id,
						otherNotValidReasons: 'Another incomplete reason'
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons,
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2023-04-11T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is incomplete and lpaQuestionnaireDueDate is a bank holiday with a bank holiday the next day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const body = {
					incompleteReasons: [1, 2, 3],
					lpaQuestionnaireDueDate: '2023-12-25',
					otherNotValidReasons: 'Another incomplete reason',
					validationOutcome: 'incomplete'
				};
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id,
						otherNotValidReasons: 'Another incomplete reason'
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons,
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2023-12-27T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is incomplete with string array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const body = {
					incompleteReasons: ['1', '2', '3'],
					lpaQuestionnaireDueDate: '2023-06-21',
					otherNotValidReasons: 'Another incomplete reason',
					validationOutcome: 'incomplete'
				};
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id,
						otherNotValidReasons: 'Another incomplete reason'
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons,
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2023-06-21T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is Incomplete with numeric array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const body = {
					incompleteReasons: [1, 2, 3],
					lpaQuestionnaireDueDate: '2023-06-21',
					otherNotValidReasons: 'Another incomplete reason',
					validationOutcome: 'Incomplete'
				};
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id,
						otherNotValidReasons: 'Another incomplete reason'
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons,
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2023-06-21T01:00:00.000Z'
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/one/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`)
					.send({
						validationOutcome: 'Complete'
					});

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
					.patch(`/appeals/3/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`)
					.send({
						validationOutcome: 'Complete'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if lpaQuestionnaireId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/lpa-questionnaires/one`)
					.send({
						validationOutcome: 'Complete'
					});

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

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/lpa-questionnaires/3`)
					.send({
						validationOutcome: 'Complete'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if validationOutcome is Complete and incompleteReasons is given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1],
						validationOutcome: 'Complete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_INCOMPLETE_REASONS_ONLY_FOR_INCOMPLETE_OUTCOME
					}
				});
			});

			test('returns an error if otherNotValidReasons is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1, 3],
						otherNotValidReasons: 123,
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if otherNotValidReasons is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1, 3],
						otherNotValidReasons: 'A'.repeat(301),
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_MAX_LENGTH_300_CHARACTERS
					}
				});
			});

			test('returns an error if validationOutcome is Complete and otherNotValidReasons is given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						otherNotValidReasons: 'Another incomplete reason',
						validationOutcome: 'Complete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is not given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is not in the correct format', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1],
						lpaQuestionnaireDueDate: '05/05/2023',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate does not contain leading zeros', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1],
						lpaQuestionnaireDueDate: '2023-5-5',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is not a valid date', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1],
						lpaQuestionnaireDueDate: '2023-02-30',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if validationOutcome is invalid', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(undefined);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						lpaQuestionnaireDueDate: '2023-06-21',
						validationOutcome: 'invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if otherNotValidReasons is not given when validationOutcome is Incomplete and Other is selected', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1, 3],
						lpaQuestionnaireDueDate: '2023-06-21',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_OTHER_NOT_VALID_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if otherNotValidReasons is given when validationOutcome is Incomplete and Other is not selected', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1, 2],
						lpaQuestionnaireDueDate: '2023-06-21',
						otherNotValidReasons: 'Another incomplete reason',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS
					}
				});
			});

			test('returns an error if incompleteReasons contains an invalid value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send({
						incompleteReasons: [1, 10],
						lpaQuestionnaireDueDate: '2023-06-21',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error when unable to save the data', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findUnique.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);
				// @ts-ignore
				databaseConnector.lPAQuestionnaire.update.mockImplementation(() => {
					throw new Error('InternalServer Error');
				});

				const body = {
					validationOutcome: 'complete'
				};
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
					)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[0].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(response.status).toEqual(500);
				expect(response.body).toEqual({
					errors: {
						body: ERROR_FAILED_TO_SAVE_DATA
					}
				});
			});
		});
	});
});
