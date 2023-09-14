// @ts-nocheck
import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import {
	ERROR_CANNOT_BE_EMPTY_STRING,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME,
	ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED,
	ERROR_MAX_LENGTH_CHARACTERS,
	ERROR_MUST_BE_ARRAY_OF_NUMBERS,
	ERROR_MUST_BE_BOOLEAN,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_INCOMPLETE_INVALID_REASON,
	ERROR_MUST_BE_IN_FUTURE,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_STRING,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE,
	ERROR_MUST_HAVE_DETAILS,
	ERROR_MUST_NOT_HAVE_DETAILS,
	ERROR_NOT_FOUND,
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	LENGTH_10,
	LENGTH_300,
	LENGTH_8,
	STATE_TARGET_ARRANGE_SITE_VISIT,
	STATE_TARGET_STATEMENT_REVIEW
} from '../../constants.js';
import {
	baseExpectedLPAQuestionnaireResponse,
	fullPlanningAppeal,
	householdAppeal,
	householdAppealLPAQuestionnaireComplete,
	householdAppealLPAQuestionnaireIncomplete,
	lpaQuestionnaireIncompleteReasons,
	lpaQuestionnaireValidationOutcomes,
	otherAppeals
} from '../../../tests/data.js';
import createManyToManyRelationData from '#utils/create-many-to-many-relation-data.js';
import errorMessageReplacement from '#utils/error-message-replacement.js';

const { databaseConnector } = await import('#utils/database-connector.js');

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

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request.get(
					`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(baseExpectedLPAQuestionnaireResponse(householdAppeal));
			});

			test('gets a single lpa questionnaire with an outcome of Complete', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(
					householdAppealLPAQuestionnaireComplete
				);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue(otherAppeals);

				const { id, lpaQuestionnaire } = householdAppealLPAQuestionnaireComplete;
				const response = await request.get(
					`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedLPAQuestionnaireResponse(householdAppealLPAQuestionnaireComplete)
				);
			});

			test('gets a single lpa questionnaire with an outcome of Incomplete', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(
					householdAppealLPAQuestionnaireIncomplete
				);
				// @ts-ignore
				databaseConnector.appeal.findMany.mockResolvedValue(otherAppeals);

				const { id, lpaQuestionnaire } = householdAppealLPAQuestionnaireIncomplete;
				const response = await request.get(
					`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedLPAQuestionnaireResponse(householdAppealLPAQuestionnaireIncomplete)
				);
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

				const { lpaQuestionnaire } = householdAppeal;
				const response = await request.get(`/appeals/3/lpa-questionnaires/${lpaQuestionnaire.id}`);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if lpaQuestionnaireId is not numeric', async () => {
				const { id } = householdAppeal;
				const response = await request.get(`/appeals/${id}/lpa-questionnaires/one`);

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

				const { id } = householdAppeal;
				const response = await request.get(`/appeals/${id}/lpa-questionnaires/3`);

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
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
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
				const { id, lpaQuestionnaire } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
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
					incompleteReasons: [{ id: 1 }, { id: 2 }],
					lpaQuestionnaireDueDate: '2099-06-22',
					validationOutcome: 'incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons.map(({ id }) => id),
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2099-06-22T01:00:00.000Z'
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
					incompleteReasons: [{ id: 1 }, { id: 2 }],
					lpaQuestionnaireDueDate: '2025-08-23',
					validationOutcome: 'incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons.map(({ id }) => id),
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2025-08-26T01:00:00.000Z'
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
					incompleteReasons: [{ id: 1 }, { id: 2 }],
					lpaQuestionnaireDueDate: '2025-04-18',
					validationOutcome: 'incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons.map(({ id }) => id),
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2025-04-22T01:00:00.000Z'
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
					incompleteReasons: [{ id: 1 }, { id: 2 }],
					lpaQuestionnaireDueDate: '2024-12-25',
					validationOutcome: 'incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons.map(({ id }) => id),
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2024-12-27T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is Incomplete without reason text', async () => {
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
					incompleteReasons: [{ id: 1 }, { id: 2 }],
					lpaQuestionnaireDueDate: '2099-06-22',
					validationOutcome: 'Incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons.map(({ id }) => id),
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2099-06-22T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is Incomplete with reason text', async () => {
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
					incompleteReasons: [
						{
							id: 1,
							text: ['Reason 1', 'Reason 2']
						},
						{
							id: 2,
							text: ['Reason 3', 'Reason 4']
						}
					],
					lpaQuestionnaireDueDate: '2099-06-22',
					validationOutcome: 'Incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons.map(({ id }) => id),
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonText.deleteMany
				).toHaveBeenCalled();
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonText.createMany
				).toHaveBeenCalledWith({
					data: [
						{
							lpaQuestionnaireId: lpaQuestionnaire.id,
							lpaQuestionnaireIncompleteReasonId: 1,
							text: 'Reason 1'
						},
						{
							lpaQuestionnaireId: lpaQuestionnaire.id,
							lpaQuestionnaireIncompleteReasonId: 1,
							text: 'Reason 2'
						},
						{
							lpaQuestionnaireId: lpaQuestionnaire.id,
							lpaQuestionnaireIncompleteReasonId: 2,
							text: 'Reason 3'
						},
						{
							lpaQuestionnaireId: lpaQuestionnaire.id,
							lpaQuestionnaireIncompleteReasonId: 2,
							text: 'Reason 4'
						}
					]
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					lpaQuestionnaireDueDate: '2099-06-22T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is Incomplete with reason text containing blank strings', async () => {
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
					incompleteReasons: [
						{
							id: 1,
							text: ['Reason 1', 'Reason 2', '']
						},
						{
							id: 2,
							text: ['Reason 3', 'Reason 4', '']
						}
					],
					lpaQuestionnaireDueDate: '2099-06-22',
					validationOutcome: 'Incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons.map(({ id }) => id),
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonText.deleteMany
				).toHaveBeenCalled();
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonText.createMany
				).toHaveBeenCalledWith({
					data: [
						{
							lpaQuestionnaireId: lpaQuestionnaire.id,
							lpaQuestionnaireIncompleteReasonId: 1,
							text: 'Reason 1'
						},
						{
							lpaQuestionnaireId: lpaQuestionnaire.id,
							lpaQuestionnaireIncompleteReasonId: 1,
							text: 'Reason 2'
						},
						{
							lpaQuestionnaireId: lpaQuestionnaire.id,
							lpaQuestionnaireIncompleteReasonId: 2,
							text: 'Reason 3'
						},
						{
							lpaQuestionnaireId: lpaQuestionnaire.id,
							lpaQuestionnaireIncompleteReasonId: 2,
							text: 'Reason 4'
						}
					]
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					incompleteReasons: [
						{
							id: 1,
							text: ['Reason 1', 'Reason 2']
						},
						{
							id: 2,
							text: ['Reason 3', 'Reason 4']
						}
					],
					validationOutcome: 'Incomplete',
					lpaQuestionnaireDueDate: '2099-06-22T01:00:00.000Z'
				});
			});

			test('updates an lpa questionnaire when the validation outcome is Incomplete with reason text where blank strings takes the text over 10 items', async () => {
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

				const eightItemArray = new Array(LENGTH_8).fill('A');
				const body = {
					incompleteReasons: [
						{
							id: 1,
							text: [...eightItemArray, '', '']
						}
					],
					lpaQuestionnaireDueDate: '2099-06-22',
					validationOutcome: 'Incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					data: {
						lpaQuestionnaireValidationOutcomeId: lpaQuestionnaireValidationOutcomes[1].id
					},
					where: {
						id: householdAppeal.lpaQuestionnaire.id
					}
				});
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.createMany
				).toHaveBeenCalledWith({
					data: createManyToManyRelationData({
						data: body.incompleteReasons.map(({ id }) => id),
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId',
						relationOneId: householdAppeal.lpaQuestionnaire.id
					})
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonText.deleteMany
				).toHaveBeenCalled();
				expect(
					databaseConnector.lPAQuestionnaireIncompleteReasonText.createMany
				).toHaveBeenCalledWith({
					data: new Array(LENGTH_8).fill({
						lpaQuestionnaireId: lpaQuestionnaire.id,
						lpaQuestionnaireIncompleteReasonId: 1,
						text: 'A'
					})
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					incompleteReasons: [
						{
							id: 1,
							text: eightItemArray
						}
					],
					validationOutcome: 'Incomplete',
					lpaQuestionnaireDueDate: '2099-06-22T01:00:00.000Z'
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const { lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/one/lpa-questionnaires/${lpaQuestionnaire.id}`)
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

				const { lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/3/lpa-questionnaires/${lpaQuestionnaire.id}`)
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
				const { id } = householdAppeal;
				const response = await request.patch(`/appeals/${id}/lpa-questionnaires/one`).send({
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

				const { id } = householdAppeal;
				const response = await request.patch(`/appeals/${id}/lpa-questionnaires/3`).send({
					validationOutcome: 'Complete'
				});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if incompleteReasons is not a numeric array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					incompleteReasons: [{ id: '1' }, { id: '2' }],
					lpaQuestionnaireDueDate: '2099-06-22',
					validationOutcome: 'incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);
				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if incompleteReasons text contains more than 10 items', async () => {
				const body = {
					incompleteReasons: [
						{
							id: '1',
							text: new Array(LENGTH_10 + 1).fill('A')
						}
					],
					lpaQuestionnaireDueDate: '2099-06-22',
					validationOutcome: 'incomplete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if validationOutcome is Complete and incompleteReasons is given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						incompleteReasons: [{ id: 1 }],
						validationOutcome: 'Complete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if validationOutcome is Complete and lpaQuestionnaireDueDate is given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						lpaQuestionnaireDueDate: '2099-06-22',
						validationOutcome: 'Complete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is not given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
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
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						incompleteReasons: [{ id: 1 }],
						lpaQuestionnaireDueDate: '05/05/2099',
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
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						incompleteReasons: [{ id: 1 }],
						lpaQuestionnaireDueDate: '2099-5-5',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is in the past', async () => {
				jest.useFakeTimers().setSystemTime(new Date('2023-06-05'));

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						incompleteReasons: [{ id: 1 }],
						lpaQuestionnaireDueDate: '2023-06-04',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_IN_FUTURE
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is not a valid date', async () => {
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						incompleteReasons: [{ id: 1 }],
						lpaQuestionnaireDueDate: '2099-02-30',
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

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						validationOutcome: 'invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
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

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						incompleteReasons: [{ id: 1 }, { id: 10 }],
						lpaQuestionnaireDueDate: '2099-06-22',
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if isListedBuilding is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isListedBuilding: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isListedBuilding: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isListedBuilding when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isListedBuilding: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isListedBuilding: true
				});
			});

			test('updates isListedBuilding when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isListedBuilding: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isListedBuilding: false
				});
			});

			test('updates isListedBuilding when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isListedBuilding: 'true'
				};
				const responseBody = {
					isListedBuilding: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isListedBuilding when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isListedBuilding: 'false'
				};
				const responseBody = {
					isListedBuilding: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isListedBuilding when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isListedBuilding: 1
				};
				const responseBody = {
					isListedBuilding: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isListedBuilding when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isListedBuilding: 0
				};
				const responseBody = {
					isListedBuilding: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isListedBuilding when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isListedBuilding: '1'
				};
				const responseBody = {
					isListedBuilding: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isListedBuilding when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isListedBuilding: '0'
				};
				const responseBody = {
					isListedBuilding: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if doesAffectAListedBuilding is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						doesAffectAListedBuilding: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						doesAffectAListedBuilding: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates doesAffectAListedBuilding when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					doesAffectAListedBuilding: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					doesAffectAListedBuilding: true
				});
			});

			test('updates doesAffectAListedBuilding when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					doesAffectAListedBuilding: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					doesAffectAListedBuilding: false
				});
			});

			test('updates doesAffectAListedBuilding when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAListedBuilding: 'true'
				};
				const responseBody = {
					doesAffectAListedBuilding: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAListedBuilding when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAListedBuilding: 'false'
				};
				const responseBody = {
					doesAffectAListedBuilding: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAListedBuilding when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAListedBuilding: 1
				};
				const responseBody = {
					doesAffectAListedBuilding: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAListedBuilding when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAListedBuilding: 0
				};
				const responseBody = {
					doesAffectAListedBuilding: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAListedBuilding when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAListedBuilding: '1'
				};
				const responseBody = {
					doesAffectAListedBuilding: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAListedBuilding when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAListedBuilding: '0'
				};
				const responseBody = {
					doesAffectAListedBuilding: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if doesAffectAScheduledMonument is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						doesAffectAScheduledMonument: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						doesAffectAScheduledMonument: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates doesAffectAScheduledMonument when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					doesAffectAScheduledMonument: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					doesAffectAScheduledMonument: true
				});
			});

			test('updates doesAffectAScheduledMonument when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					doesAffectAScheduledMonument: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					doesAffectAScheduledMonument: false
				});
			});

			test('updates doesAffectAScheduledMonument when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAScheduledMonument: 'true'
				};
				const responseBody = {
					doesAffectAScheduledMonument: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAScheduledMonument when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAScheduledMonument: 'false'
				};
				const responseBody = {
					doesAffectAScheduledMonument: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAScheduledMonument when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAScheduledMonument: 1
				};
				const responseBody = {
					doesAffectAScheduledMonument: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAScheduledMonument when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAScheduledMonument: 0
				};
				const responseBody = {
					doesAffectAScheduledMonument: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAScheduledMonument when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAScheduledMonument: '1'
				};
				const responseBody = {
					doesAffectAScheduledMonument: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates doesAffectAScheduledMonument when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					doesAffectAScheduledMonument: '0'
				};
				const responseBody = {
					doesAffectAScheduledMonument: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if isConservationArea is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isConservationArea: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isConservationArea: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isConservationArea when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isConservationArea: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isConservationArea: true
				});
			});

			test('updates isConservationArea when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isConservationArea: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isConservationArea: false
				});
			});

			test('updates isConservationArea when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isConservationArea: 'true'
				};
				const responseBody = {
					isConservationArea: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isConservationArea when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isConservationArea: 'false'
				};
				const responseBody = {
					isConservationArea: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isConservationArea when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isConservationArea: 1
				};
				const responseBody = {
					isConservationArea: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isConservationArea when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isConservationArea: 0
				};
				const responseBody = {
					isConservationArea: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isConservationArea when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isConservationArea: '1'
				};
				const responseBody = {
					isConservationArea: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isConservationArea when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isConservationArea: '0'
				};
				const responseBody = {
					isConservationArea: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if hasProtectedSpecies is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						hasProtectedSpecies: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						hasProtectedSpecies: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates hasProtectedSpecies when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasProtectedSpecies: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					hasProtectedSpecies: true
				});
			});

			test('updates hasProtectedSpecies when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasProtectedSpecies: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					hasProtectedSpecies: false
				});
			});

			test('updates hasProtectedSpecies when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasProtectedSpecies: 'true'
				};
				const responseBody = {
					hasProtectedSpecies: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasProtectedSpecies when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasProtectedSpecies: 'false'
				};
				const responseBody = {
					hasProtectedSpecies: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasProtectedSpecies when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasProtectedSpecies: 1
				};
				const responseBody = {
					hasProtectedSpecies: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasProtectedSpecies when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasProtectedSpecies: 0
				};
				const responseBody = {
					hasProtectedSpecies: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasProtectedSpecies when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasProtectedSpecies: '1'
				};
				const responseBody = {
					hasProtectedSpecies: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasProtectedSpecies when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasProtectedSpecies: '0'
				};
				const responseBody = {
					hasProtectedSpecies: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if isTheSiteWithinAnAONB is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isTheSiteWithinAnAONB: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isTheSiteWithinAnAONB: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isTheSiteWithinAnAONB when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isTheSiteWithinAnAONB: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isTheSiteWithinAnAONB: true
				});
			});

			test('updates isTheSiteWithinAnAONB when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isTheSiteWithinAnAONB: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isTheSiteWithinAnAONB: false
				});
			});

			test('updates isTheSiteWithinAnAONB when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isTheSiteWithinAnAONB: 'true'
				};
				const responseBody = {
					isTheSiteWithinAnAONB: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isTheSiteWithinAnAONB when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isTheSiteWithinAnAONB: 'false'
				};
				const responseBody = {
					isTheSiteWithinAnAONB: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isTheSiteWithinAnAONB when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isTheSiteWithinAnAONB: 1
				};
				const responseBody = {
					isTheSiteWithinAnAONB: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isTheSiteWithinAnAONB when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isTheSiteWithinAnAONB: 0
				};
				const responseBody = {
					isTheSiteWithinAnAONB: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isTheSiteWithinAnAONB when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isTheSiteWithinAnAONB: '1'
				};
				const responseBody = {
					isTheSiteWithinAnAONB: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isTheSiteWithinAnAONB when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isTheSiteWithinAnAONB: '0'
				};
				const responseBody = {
					isTheSiteWithinAnAONB: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if hasTreePreservationOrder is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						hasTreePreservationOrder: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						hasTreePreservationOrder: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates hasTreePreservationOrder when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasTreePreservationOrder: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					hasTreePreservationOrder: true
				});
			});

			test('updates hasTreePreservationOrder when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasTreePreservationOrder: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					hasTreePreservationOrder: false
				});
			});

			test('updates hasTreePreservationOrder when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasTreePreservationOrder: 'true'
				};
				const responseBody = {
					hasTreePreservationOrder: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasTreePreservationOrder when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasTreePreservationOrder: 'false'
				};
				const responseBody = {
					hasTreePreservationOrder: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasTreePreservationOrder when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasTreePreservationOrder: 1
				};
				const responseBody = {
					hasTreePreservationOrder: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasTreePreservationOrder when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasTreePreservationOrder: 0
				};
				const responseBody = {
					hasTreePreservationOrder: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasTreePreservationOrder when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasTreePreservationOrder: '1'
				};
				const responseBody = {
					hasTreePreservationOrder: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasTreePreservationOrder when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasTreePreservationOrder: '0'
				};
				const responseBody = {
					hasTreePreservationOrder: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if isGypsyOrTravellerSite is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isGypsyOrTravellerSite: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isGypsyOrTravellerSite: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isGypsyOrTravellerSite when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isGypsyOrTravellerSite: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isGypsyOrTravellerSite: true
				});
			});

			test('updates isGypsyOrTravellerSite when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isGypsyOrTravellerSite: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isGypsyOrTravellerSite: false
				});
			});

			test('updates isGypsyOrTravellerSite when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isGypsyOrTravellerSite: 'true'
				};
				const responseBody = {
					isGypsyOrTravellerSite: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isGypsyOrTravellerSite when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isGypsyOrTravellerSite: 'false'
				};
				const responseBody = {
					isGypsyOrTravellerSite: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isGypsyOrTravellerSite when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isGypsyOrTravellerSite: 1
				};
				const responseBody = {
					isGypsyOrTravellerSite: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isGypsyOrTravellerSite when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isGypsyOrTravellerSite: 0
				};
				const responseBody = {
					isGypsyOrTravellerSite: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isGypsyOrTravellerSite when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isGypsyOrTravellerSite: '1'
				};
				const responseBody = {
					isGypsyOrTravellerSite: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isGypsyOrTravellerSite when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isGypsyOrTravellerSite: '0'
				};
				const responseBody = {
					isGypsyOrTravellerSite: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if isPublicRightOfWay is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isPublicRightOfWay: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isPublicRightOfWay: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isPublicRightOfWay when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isPublicRightOfWay: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isPublicRightOfWay: true
				});
			});

			test('updates isPublicRightOfWay when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isPublicRightOfWay: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isPublicRightOfWay: false
				});
			});

			test('updates isPublicRightOfWay when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isPublicRightOfWay: 'true'
				};
				const responseBody = {
					isPublicRightOfWay: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isPublicRightOfWay when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isPublicRightOfWay: 'false'
				};
				const responseBody = {
					isPublicRightOfWay: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isPublicRightOfWay when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isPublicRightOfWay: 1
				};
				const responseBody = {
					isPublicRightOfWay: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isPublicRightOfWay when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isPublicRightOfWay: 0
				};
				const responseBody = {
					isPublicRightOfWay: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isPublicRightOfWay when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isPublicRightOfWay: '1'
				};
				const responseBody = {
					isPublicRightOfWay: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isPublicRightOfWay when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isPublicRightOfWay: '0'
				};
				const responseBody = {
					isPublicRightOfWay: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if isEnvironmentalStatementRequired is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isEnvironmentalStatementRequired: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isEnvironmentalStatementRequired: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isEnvironmentalStatementRequired when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isEnvironmentalStatementRequired: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isEnvironmentalStatementRequired: true
				});
			});

			test('updates isEnvironmentalStatementRequired when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isEnvironmentalStatementRequired: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isEnvironmentalStatementRequired: false
				});
			});

			test('updates isEnvironmentalStatementRequired when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isEnvironmentalStatementRequired: 'true'
				};
				const responseBody = {
					isEnvironmentalStatementRequired: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isEnvironmentalStatementRequired when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isEnvironmentalStatementRequired: 'false'
				};
				const responseBody = {
					isEnvironmentalStatementRequired: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isEnvironmentalStatementRequired when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isEnvironmentalStatementRequired: 1
				};
				const responseBody = {
					isEnvironmentalStatementRequired: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isEnvironmentalStatementRequired when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isEnvironmentalStatementRequired: 0
				};
				const responseBody = {
					isEnvironmentalStatementRequired: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isEnvironmentalStatementRequired when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isEnvironmentalStatementRequired: '1'
				};
				const responseBody = {
					isEnvironmentalStatementRequired: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isEnvironmentalStatementRequired when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isEnvironmentalStatementRequired: '0'
				};
				const responseBody = {
					isEnvironmentalStatementRequired: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if hasCompletedAnEnvironmentalStatement is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						hasCompletedAnEnvironmentalStatement: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						hasCompletedAnEnvironmentalStatement: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates hasCompletedAnEnvironmentalStatement when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasCompletedAnEnvironmentalStatement: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					hasCompletedAnEnvironmentalStatement: true
				});
			});

			test('updates hasCompletedAnEnvironmentalStatement when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasCompletedAnEnvironmentalStatement: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					hasCompletedAnEnvironmentalStatement: false
				});
			});

			test('updates hasCompletedAnEnvironmentalStatement when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasCompletedAnEnvironmentalStatement: 'true'
				};
				const responseBody = {
					hasCompletedAnEnvironmentalStatement: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasCompletedAnEnvironmentalStatement when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasCompletedAnEnvironmentalStatement: 'false'
				};
				const responseBody = {
					hasCompletedAnEnvironmentalStatement: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasCompletedAnEnvironmentalStatement when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasCompletedAnEnvironmentalStatement: 1
				};
				const responseBody = {
					hasCompletedAnEnvironmentalStatement: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasCompletedAnEnvironmentalStatement when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasCompletedAnEnvironmentalStatement: 0
				};
				const responseBody = {
					hasCompletedAnEnvironmentalStatement: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasCompletedAnEnvironmentalStatement when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasCompletedAnEnvironmentalStatement: '1'
				};
				const responseBody = {
					hasCompletedAnEnvironmentalStatement: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasCompletedAnEnvironmentalStatement when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasCompletedAnEnvironmentalStatement: '0'
				};
				const responseBody = {
					hasCompletedAnEnvironmentalStatement: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if includesScreeningOption is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						includesScreeningOption: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						includesScreeningOption: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates includesScreeningOption when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					includesScreeningOption: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					includesScreeningOption: true
				});
			});

			test('updates includesScreeningOption when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					includesScreeningOption: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					includesScreeningOption: false
				});
			});

			test('updates includesScreeningOption when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					includesScreeningOption: 'true'
				};
				const responseBody = {
					includesScreeningOption: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates includesScreeningOption when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					includesScreeningOption: 'false'
				};
				const responseBody = {
					includesScreeningOption: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates includesScreeningOption when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					includesScreeningOption: 1
				};
				const responseBody = {
					includesScreeningOption: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates includesScreeningOption when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					includesScreeningOption: 0
				};
				const responseBody = {
					includesScreeningOption: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates includesScreeningOption when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					includesScreeningOption: '1'
				};
				const responseBody = {
					includesScreeningOption: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates includesScreeningOption when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					includesScreeningOption: '0'
				};
				const responseBody = {
					includesScreeningOption: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if meetsOrExceedsThresholdOrCriteriaInColumn2 is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						meetsOrExceedsThresholdOrCriteriaInColumn2: 'yes'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						meetsOrExceedsThresholdOrCriteriaInColumn2: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates meetsOrExceedsThresholdOrCriteriaInColumn2 when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					meetsOrExceedsThresholdOrCriteriaInColumn2: true
				});
			});

			test('updates meetsOrExceedsThresholdOrCriteriaInColumn2 when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					meetsOrExceedsThresholdOrCriteriaInColumn2: false
				});
			});

			test('updates meetsOrExceedsThresholdOrCriteriaInColumn2 when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: 'true'
				};
				const responseBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates meetsOrExceedsThresholdOrCriteriaInColumn2 when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: 'false'
				};
				const responseBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates meetsOrExceedsThresholdOrCriteriaInColumn2 when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: 1
				};
				const responseBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates meetsOrExceedsThresholdOrCriteriaInColumn2 when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: 0
				};
				const responseBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates meetsOrExceedsThresholdOrCriteriaInColumn2 when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: '1'
				};
				const responseBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: true
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates meetsOrExceedsThresholdOrCriteriaInColumn2 when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: '0'
				};
				const responseBody = {
					meetsOrExceedsThresholdOrCriteriaInColumn2: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates designatedSites when given a numeric array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.designatedSite.findMany.mockResolvedValue([
					{ id: 1 },
					{ id: 2 },
					{ id: 3 }
				]);

				const body = {
					designatedSites: [1, 2, 3]
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(
					databaseConnector.designatedSitesOnLPAQuestionnaires.createMany
				).toHaveBeenCalledWith({
					data: [
						{ designatedSiteId: 1, lpaQuestionnaireId: 1 },
						{ designatedSiteId: 2, lpaQuestionnaireId: 1 },
						{ designatedSiteId: 3, lpaQuestionnaireId: 1 }
					]
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates designatedSites and deduplicates when given an array with duplicates', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.designatedSite.findMany.mockResolvedValue([
					{ id: 1 },
					{ id: 2 },
					{ id: 3 }
				]);

				const body = {
					designatedSites: [1, 2, 2, 3, 3, 3]
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(
					databaseConnector.designatedSitesOnLPAQuestionnaires.createMany
				).toHaveBeenCalledWith({
					data: [
						{ designatedSiteId: 1, lpaQuestionnaireId: 1 },
						{ designatedSiteId: 2, lpaQuestionnaireId: 1 },
						{ designatedSiteId: 3, lpaQuestionnaireId: 1 }
					]
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({ designatedSites: [1, 2, 3] });
			});

			test('returns an error if designatedSites is not an array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						designatedSites: 1
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						designatedSites: ERROR_MUST_BE_ARRAY_OF_NUMBERS
					}
				});
			});

			test('returns an error if designatedSites is not a numeric array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					designatedSites: ['1', '2', '3']
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						designatedSites: ERROR_MUST_BE_ARRAY_OF_NUMBERS
					}
				});
			});

			test('returns an error if designatedSites is a empty array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						designatedSites: []
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						designatedSites: ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE
					}
				});
			});

			test('returns an error if designatedSites contains an invalid value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.designatedSite.findMany.mockResolvedValue([
					{ id: 1 },
					{ id: 2 },
					{ id: 3 }
				]);

				const body = {
					designatedSites: [1, 2, 4]
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						designatedSites: ERROR_NOT_FOUND
					}
				});
			});

			test('updates scheduleType when given a numeric number', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.scheduleType.findMany.mockResolvedValue([
					{ id: 1 },
					{ id: 2 },
					{ id: 3 }
				]);

				const body = {
					scheduleType: 1
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: {
						scheduleTypeId: 1
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates scheduleType when given a string number', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.scheduleType.findMany.mockResolvedValue([
					{ id: 1 },
					{ id: 2 },
					{ id: 3 }
				]);

				const body = {
					scheduleType: '1'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.lpaQuestionnaire.id },
					data: {
						scheduleTypeId: 1
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					scheduleType: 1
				});
			});

			test('returns an error if scheduleType is not a number', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					scheduleType: 'one'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						scheduleType: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if scheduleType is not valid', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.scheduleType.findMany.mockResolvedValue([
					{ id: 1 },
					{ id: 2 },
					{ id: 3 }
				]);

				const body = {
					scheduleType: 4
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						scheduleType: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if isSensitiveArea is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isSensitiveArea: 'yes'
					});

				// expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isSensitiveArea: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isSensitiveArea when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isSensitiveArea: true,
					sensitiveAreaDetails: 'The area is liable to flooding'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates isSensitiveArea when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isSensitiveArea: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(body);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: lpaQuestionnaire.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates isSensitiveArea when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSensitiveArea: 'true',
					sensitiveAreaDetails: 'The area is liable to flooding'
				};
				const responseBody = {
					isSensitiveArea: true,
					sensitiveAreaDetails: 'The area is liable to flooding'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSensitiveArea when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSensitiveArea: 'false'
				};
				const responseBody = {
					isSensitiveArea: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSensitiveArea when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSensitiveArea: 1,
					sensitiveAreaDetails: 'The area is liable to flooding'
				};
				const responseBody = {
					isSensitiveArea: true,
					sensitiveAreaDetails: 'The area is liable to flooding'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSensitiveArea when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSensitiveArea: 0
				};
				const responseBody = {
					isSensitiveArea: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSensitiveArea when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSensitiveArea: '1',
					sensitiveAreaDetails: 'The area is liable to flooding'
				};
				const responseBody = {
					isSensitiveArea: true,
					sensitiveAreaDetails: 'The area is liable to flooding'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSensitiveArea when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSensitiveArea: '0'
				};
				const responseBody = {
					isSensitiveArea: false
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send(requestBody);

				expect(databaseConnector.lPAQuestionnaire.update).toHaveBeenCalledWith({
					where: { id: lpaQuestionnaire.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if sensitiveAreaDetails is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						sensitiveAreaDetails: ['The area is liable to flooding']
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						sensitiveAreaDetails: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if sensitiveAreaDetails is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						sensitiveAreaDetails: ''
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						sensitiveAreaDetails: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if sensitiveAreaDetails is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						sensitiveAreaDetails: 'A'.repeat(LENGTH_300 + 1)
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						sensitiveAreaDetails: errorMessageReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('returns an error if isSensitiveArea is false and sensitiveAreaDetails is given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isSensitiveArea: false,
						sensitiveAreaDetails: 'The area is liable to flooding'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isSensitiveArea: errorMessageReplacement(ERROR_MUST_NOT_HAVE_DETAILS, [
							'sensitiveAreaDetails',
							'isSensitiveArea',
							false
						])
					}
				});
			});

			test('returns an error if isSensitiveArea is true and sensitiveAreaDetails is not given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({
						isSensitiveArea: true
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isSensitiveArea: errorMessageReplacement(ERROR_MUST_HAVE_DETAILS, [
							'sensitiveAreaDetails',
							'isSensitiveArea',
							true
						])
					}
				});
			});

			test('does not return an error when given an empty body', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { lpaQuestionnaire, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
					.send({});

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({});
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
					throw new Error('Internal Server Error');
				});

				const body = {
					validationOutcome: 'complete'
				};
				const { id, lpaQuestionnaire } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/lpa-questionnaires/${lpaQuestionnaire.id}`)
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
