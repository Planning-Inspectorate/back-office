// @ts-nocheck
import { jest } from '@jest/globals';
import { format } from 'date-fns';
import { request } from '../../../app-test.js';
import {
	DEFAULT_DATE_FORMAT_DATABASE,
	DEFAULT_DATE_FORMAT_DISPLAY,
	DEFAULT_TIMESTAMP_TIME,
	ERROR_MUST_BE_IN_FUTURE,
	ERROR_CANNOT_BE_EMPTY_STRING,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME,
	ERROR_MAX_LENGTH_CHARACTERS,
	ERROR_MUST_BE_BOOLEAN,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_STRING,
	ERROR_MUST_HAVE_DETAILS,
	ERROR_MUST_NOT_HAVE_DETAILS,
	ERROR_NOT_FOUND,
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME,
	ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED,
	LENGTH_300,
	STATE_TARGET_INVALID,
	STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
	ERROR_MUST_BE_INCOMPLETE_INVALID_REASON,
	LENGTH_10,
	LENGTH_8,
	AUDIT_TRAIL_CASE_TIMELINE_CREATED
} from '../../constants.js';
import {
	appellantCaseIncompleteReasons,
	appellantCaseInvalidReasons,
	appellantCaseValidationOutcomes,
	azureAdUserId,
	baseExpectedAppellantCaseResponse,
	fullPlanningAppeal,
	fullPlanningAppealAppellantCaseIncomplete,
	fullPlanningAppealAppellantCaseInvalid,
	householdAppeal,
	householdAppealAppellantCaseIncomplete,
	householdAppealAppellantCaseInvalid,
	householdAppealAppellantCaseValid
} from '../../../tests/data.js';
import joinDateAndTime from '#utils/join-date-and-time.js';
import { calculateTimetable } from '../../../utils/business-days.js';
import config from '../../../config/config.js';
import { NotifyClient } from 'notifications-node-client';
import stringTokenReplacement from '#utils/string-token-replacement.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const startedAt = new Date(joinDateAndTime(format(new Date(), DEFAULT_DATE_FORMAT_DATABASE)));
const notifyClient = new NotifyClient();

describe('appellant cases routes', () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.useRealTimers();
	});

	describe('/appeals/:appealId/appellant-cases/:appellantCaseId', () => {
		describe('GET', () => {
			test('gets a single appellant case for a household appeal with no validation outcome', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([]);
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.get(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(baseExpectedAppellantCaseResponse(householdAppeal));
			});

			test('gets a single appellant case for a valid household appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([]);
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppealAppellantCaseValid);

				const { appellantCase } = householdAppealAppellantCaseValid;
				const response = await request
					.get(
						`/appeals/${householdAppealAppellantCaseValid.id}/appellant-cases/${appellantCase.id}`
					)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(householdAppealAppellantCaseValid)
				);
			});

			test('gets a single appellant case for an incomplete household appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([]);
				databaseConnector.appeal.findUnique.mockResolvedValue(
					householdAppealAppellantCaseIncomplete
				);

				const { appellantCase } = householdAppealAppellantCaseIncomplete;
				const response = await request
					.get(
						`/appeals/${householdAppealAppellantCaseIncomplete.id}/appellant-cases/${appellantCase.id}`
					)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(householdAppealAppellantCaseIncomplete)
				);
			});

			test('gets a single appellant case for an invalid household appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([]);
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppealAppellantCaseInvalid);

				const { appellantCase } = householdAppealAppellantCaseInvalid;
				const response = await request
					.get(
						`/appeals/${householdAppealAppellantCaseInvalid.id}/appellant-cases/${appellantCase.id}`
					)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(householdAppealAppellantCaseInvalid)
				);
			});

			test('gets a single appellant case for a valid full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([]);
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.get(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(baseExpectedAppellantCaseResponse(fullPlanningAppeal));
			});

			test('gets a single appellant case for an incomplete full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([]);
				databaseConnector.appeal.findUnique.mockResolvedValue(
					fullPlanningAppealAppellantCaseIncomplete
				);

				const { appellantCase } = fullPlanningAppealAppellantCaseIncomplete;
				const response = await request
					.get(
						`/appeals/${fullPlanningAppealAppellantCaseIncomplete.id}/appellant-cases/${appellantCase.id}`
					)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(fullPlanningAppealAppellantCaseIncomplete)
				);
			});

			test('gets a single appellant case for an invalid full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([]);
				databaseConnector.appeal.findUnique.mockResolvedValue(
					fullPlanningAppealAppellantCaseInvalid
				);

				const { appellantCase } = fullPlanningAppealAppellantCaseInvalid;
				const response = await request
					.get(
						`/appeals/${fullPlanningAppealAppellantCaseInvalid.id}/appellant-cases/${appellantCase.id}`
					)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(fullPlanningAppealAppellantCaseInvalid)
				);
			});

			test('returns an error if appealId is not numeric', async () => {
				const { appellantCase } = householdAppeal;
				const response = await request
					.get(`/appeals/one/appellant-cases/${appellantCase.id}`)
					.set('azureAdUserId', azureAdUserId);

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

				const { appellantCase } = householdAppeal;
				const response = await request
					.get(`/appeals/3/appellant-cases/${appellantCase.id}`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantCaseId is not numeric', async () => {
				const { id } = householdAppeal;
				const response = await request
					.get(`/appeals/${id}/appellant-cases/one`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appellantCaseId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id } = householdAppeal;
				const response = await request
					.get(`/appeals/${id}/appellant-cases/3`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_NOT_FOUND
					}
				});
			});
		});

		describe('PATCH', () => {
			test('updates appellant case when the validation outcome is Incomplete without reason text and an appeal due date', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);

				const body = {
					appealDueDate: '2099-07-14',
					incompleteReasons: [{ id: 1 }, { id: 2 }],
					validationOutcome: 'Incomplete'
				};
				const formattedAppealDueDate = joinDateAndTime(body.appealDueDate);
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 1
					}
				});
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					where: { id },
					data: {
						dueDate: formattedAppealDueDate,
						updatedAt: expect.any(Date)
					}
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					...body,
					appealDueDate: formattedAppealDueDate
				});
			});

			test('updates appellant case when the validation outcome is Incomplete with reason text', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany.mockResolvedValue(
					true
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
					validationOutcome: 'Incomplete'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 1
					}
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(databaseConnector.appellantCaseIncompleteReasonText.deleteMany).toHaveBeenCalled();
				expect(databaseConnector.appellantCaseIncompleteReasonText.createMany).toHaveBeenCalledWith(
					{
						data: [
							{
								appellantCaseId: appellantCase.id,
								appellantCaseIncompleteReasonId: 1,
								text: 'Reason 1'
							},
							{
								appellantCaseId: appellantCase.id,
								appellantCaseIncompleteReasonId: 1,
								text: 'Reason 2'
							},
							{
								appellantCaseId: appellantCase.id,
								appellantCaseIncompleteReasonId: 2,
								text: 'Reason 3'
							},
							{
								appellantCaseId: appellantCase.id,
								appellantCaseIncompleteReasonId: 2,
								text: 'Reason 4'
							}
						]
					}
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is Invalid with reason text', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				const body = {
					invalidReasons: [
						{
							id: 1,
							text: ['Reason 1', 'Reason 2']
						},
						{
							id: 2,
							text: ['Reason 3', 'Reason 4']
						}
					],
					validationOutcome: 'Invalid'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 2
					}
				});
				expect(databaseConnector.appellantCaseInvalidReasonText.deleteMany).toHaveBeenCalled();
				expect(databaseConnector.appellantCaseInvalidReasonText.createMany).toHaveBeenCalledWith({
					data: [
						{
							appellantCaseId: appellantCase.id,
							appellantCaseInvalidReasonId: 1,
							text: 'Reason 1'
						},
						{
							appellantCaseId: appellantCase.id,
							appellantCaseInvalidReasonId: 1,
							text: 'Reason 2'
						},
						{
							appellantCaseId: appellantCase.id,
							appellantCaseInvalidReasonId: 2,
							text: 'Reason 3'
						},
						{
							appellantCaseId: appellantCase.id,
							appellantCaseInvalidReasonId: 2,
							text: 'Reason 4'
						}
					]
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is Incomplete with reason text containing blank strings', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany.mockResolvedValue(
					true
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
					validationOutcome: 'Incomplete'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 1
					}
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(databaseConnector.appellantCaseIncompleteReasonText.deleteMany).toHaveBeenCalled();
				expect(databaseConnector.appellantCaseIncompleteReasonText.createMany).toHaveBeenCalledWith(
					{
						data: [
							{
								appellantCaseId: appellantCase.id,
								appellantCaseIncompleteReasonId: 1,
								text: 'Reason 1'
							},
							{
								appellantCaseId: appellantCase.id,
								appellantCaseIncompleteReasonId: 1,
								text: 'Reason 2'
							},
							{
								appellantCaseId: appellantCase.id,
								appellantCaseIncompleteReasonId: 2,
								text: 'Reason 3'
							},
							{
								appellantCaseId: appellantCase.id,
								appellantCaseIncompleteReasonId: 2,
								text: 'Reason 4'
							}
						]
					}
				);
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
					validationOutcome: 'Incomplete'
				});
			});

			test('updates appellant case when the validation outcome is Incomplete with reason text where blank strings takes the text over 10 items', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);

				const eightItemArray = new Array(LENGTH_8).fill('A');
				const body = {
					incompleteReasons: [
						{
							id: 1,
							text: [...eightItemArray, '', '']
						}
					],
					validationOutcome: 'Incomplete'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 1
					}
				});
				expect(databaseConnector.appellantCaseIncompleteReasonText.deleteMany).toHaveBeenCalled();
				expect(databaseConnector.appellantCaseIncompleteReasonText.createMany).toHaveBeenCalledWith(
					{
						data: new Array(LENGTH_8).fill({
							appellantCaseId: appellantCase.id,
							appellantCaseIncompleteReasonId: 1,
							text: 'A'
						})
					}
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					incompleteReasons: [
						{
							id: 1,
							text: eightItemArray
						}
					],
					validationOutcome: 'Incomplete'
				});
			});

			test('updates appellant case when the validation outcome is Invalid with reason text containing blank strings', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				const body = {
					invalidReasons: [
						{
							id: 1,
							text: ['Reason 1', 'Reason 2', '']
						},
						{
							id: 2,
							text: ['Reason 3', 'Reason 4', '']
						}
					],
					validationOutcome: 'Invalid'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 2
					}
				});
				expect(databaseConnector.appellantCaseInvalidReasonText.deleteMany).toHaveBeenCalled();
				expect(databaseConnector.appellantCaseInvalidReasonText.createMany).toHaveBeenCalledWith({
					data: [
						{
							appellantCaseId: appellantCase.id,
							appellantCaseInvalidReasonId: 1,
							text: 'Reason 1'
						},
						{
							appellantCaseId: appellantCase.id,
							appellantCaseInvalidReasonId: 1,
							text: 'Reason 2'
						},
						{
							appellantCaseId: appellantCase.id,
							appellantCaseInvalidReasonId: 2,
							text: 'Reason 3'
						},
						{
							appellantCaseId: appellantCase.id,
							appellantCaseInvalidReasonId: 2,
							text: 'Reason 4'
						}
					]
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					invalidReasons: [
						{
							id: 1,
							text: ['Reason 1', 'Reason 2']
						},
						{
							id: 2,
							text: ['Reason 3', 'Reason 4']
						}
					],
					validationOutcome: 'Invalid'
				});
			});

			test('updates appellant case when the validation outcome is Invalid with reason text where blank strings takes the text over 10 items', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				const eightItemArray = new Array(LENGTH_8).fill('A');
				const body = {
					invalidReasons: [
						{
							id: 1,
							text: [...eightItemArray, '', '']
						}
					],
					validationOutcome: 'Invalid'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 2
					}
				});
				expect(databaseConnector.appellantCaseInvalidReasonText.deleteMany).toHaveBeenCalled();
				expect(databaseConnector.appellantCaseInvalidReasonText.createMany).toHaveBeenCalledWith({
					data: new Array(LENGTH_8).fill({
						appellantCaseId: appellantCase.id,
						appellantCaseInvalidReasonId: 1,
						text: 'A'
					})
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					invalidReasons: [
						{
							id: 1,
							text: eightItemArray
						}
					],
					validationOutcome: 'Invalid'
				});
			});

			test('updates appellant case when the validation outcome is Invalid with numeric array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				const body = {
					invalidReasons: [{ id: 1 }, { id: 2 }],
					validationOutcome: 'Invalid'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 2
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_INVALID,
						valid: true
					}
				});
				expect(databaseConnector.appeal.update).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is valid and sets the timetable and correct status for a household appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				const expectedTimeTable = await calculateTimetable(
					householdAppeal.appealType.shorthand,
					startedAt
				);
				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 3
					}
				});
				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: expectedTimeTable
					})
				);
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
						valid: true
					}
				});
				expect(notifyClient.sendEmail).toHaveBeenCalledWith(
					config.govNotify.template.validAppellantCase.id,
					householdAppeal.appellant.customer.email,
					{
						emailReplyToId: null,
						personalisation: {
							appeal_reference: householdAppeal.reference,
							appeal_type: householdAppeal.appealType.shorthand,
							date_started: format(new Date(), DEFAULT_DATE_FORMAT_DISPLAY)
						},
						reference: null
					}
				);
				expect(databaseConnector.auditTrail.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						details: AUDIT_TRAIL_CASE_TIMELINE_CREATED,
						loggedAt: expect.any(Date),
						userId: householdAppeal.caseOfficer.id
					}
				});
				expect(databaseConnector.appeal.update).toHaveBeenCalledTimes(1);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					where: { id },
					data: {
						startedAt: startedAt.toISOString(),
						updatedAt: expect.any(Date)
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is Valid and sets the timetable for a full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				const expectedTimeTable = await calculateTimetable(
					fullPlanningAppeal.appealType.shorthand,
					startedAt
				);
				const body = {
					validationOutcome: 'Valid'
				};
				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 3
					}
				});
				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: expectedTimeTable
					})
				);
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: fullPlanningAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
						valid: true
					}
				});
				expect(notifyClient.sendEmail).toHaveBeenCalledWith(
					config.govNotify.template.validAppellantCase.id,
					fullPlanningAppeal.appellant.customer.email,
					{
						emailReplyToId: null,
						personalisation: {
							appeal_reference: fullPlanningAppeal.reference,
							appeal_type: fullPlanningAppeal.appealType.shorthand,
							date_started: format(new Date(), DEFAULT_DATE_FORMAT_DISPLAY)
						},
						reference: null
					}
				);
				expect(databaseConnector.auditTrail.create).toHaveBeenCalledWith({
					data: {
						appealId: fullPlanningAppeal.id,
						details: AUDIT_TRAIL_CASE_TIMELINE_CREATED,
						loggedAt: expect.any(Date),
						userId: fullPlanningAppeal.caseOfficer.id
					}
				});
				expect(databaseConnector.appeal.update).toHaveBeenCalledTimes(1);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					where: { id: fullPlanningAppeal.id },
					data: {
						startedAt: startedAt.toISOString(),
						updatedAt: expect.any(Date)
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('sets the timetable deadline to two days after the deadline if the deadline day and the day after are bank holidays', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				jest.useFakeTimers().setSystemTime(new Date('2023-12-18'));

				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 3
					}
				});

				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							lpaQuestionnaireDueDate: new Date(`2023-12-27T${DEFAULT_TIMESTAMP_TIME}Z`)
						}
					})
				);
				expect(databaseConnector.auditTrail.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						details: AUDIT_TRAIL_CASE_TIMELINE_CREATED,
						loggedAt: expect.any(Date),
						userId: householdAppeal.caseOfficer.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('sets the timetable deadline to the Monday after the deadline if the deadline is a Saturday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				jest.useFakeTimers().setSystemTime(new Date('2023-06-05'));

				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 3
					}
				});
				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							lpaQuestionnaireDueDate: new Date(`2023-06-12T${DEFAULT_TIMESTAMP_TIME}Z`)
						}
					})
				);
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('sets the timetable deadline to the Tuesday after the deadline if the deadline is a Saturday and the Monday after is a bank holiday', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);
				// @ts-ignore
				databaseConnector.user.upsert.mockResolvedValue({
					id: 1,
					azureAdUserId
				});

				jest.useFakeTimers().setSystemTime(new Date('2023-05-22'));

				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 3
					}
				});
				expect(databaseConnector.appealTimetable.upsert).toHaveBeenCalledWith(
					expect.objectContaining({
						update: {
							lpaQuestionnaireDueDate: new Date(`2023-05-30T${DEFAULT_TIMESTAMP_TIME}Z`)
						}
					})
				);
				expect(databaseConnector.auditTrail.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						details: AUDIT_TRAIL_CASE_TIMELINE_CREATED,
						loggedAt: expect.any(Date),
						userId: householdAppeal.caseOfficer.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates Appellant Case details when not saving the validation outcome', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					applicantFirstName: 'Fiona',
					applicantSurname: 'Burgess',
					isSiteFullyOwned: true,
					isSitePartiallyOwned: true,
					areAllOwnersKnown: true,
					hasAttemptedToIdentifyOwners: true,
					hasAdvertisedAppeal: true,
					isSiteVisibleFromPublicRoad: false,
					visibilityRestrictions: 'The site is behind a tall hedge',
					hasHealthAndSafetyIssues: true,
					healthAndSafetyIssues: 'There is no mobile reception at the site'
				};
				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('returns an error if appealId is not numeric', async () => {
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/one/appellant-cases/${appellantCase.id}`)
					.send({
						validationOutcome: 'Valid'
					})
					.set('azureAdUserId', azureAdUserId);

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

				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/3/appellant-cases/${appellantCase.id}`)
					.send({
						validationOutcome: 'Valid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantCaseId is not numeric', async () => {
				const { id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/one`)
					.send({
						validationOutcome: 'Valid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appellantCaseId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/3`)
					.send({
						validationOutcome: 'Valid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appealDueDate is not in the correct format', async () => {
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send({
						appealDueDate: '05/05/2023',
						incompleteReasons: [{ id: 1 }],
						validationOutcome: 'Incomplete'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if appealDueDate does not contain leading zeros', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						appealDueDate: '2023-5-5',
						incompleteReasons: [{ id: 1 }],
						validationOutcome: 'Incomplete'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if appealDueDate is in the past', async () => {
				jest.useFakeTimers().setSystemTime(new Date('2023-06-05'));

				const { appellantCase, id } = householdAppeal;
				const body = {
					appealDueDate: '2023-06-04',
					incompleteReasons: [{ id: 1 }],
					validationOutcome: 'Incomplete'
				};
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealDueDate: ERROR_MUST_BE_IN_FUTURE
					}
				});
			});

			test('returns an error if appealDueDate is not a valid date', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						appealDueDate: '2023-02-30',
						incompleteReasons: [{ id: 1 }],
						validationOutcome: 'Incomplete'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is not given', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						validationOutcome: 'Incomplete'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is not given', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						validationOutcome: 'Invalid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is not an array', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						incompleteReasons: 1,
						validationOutcome: 'Incomplete'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is not an array', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						invalidReasons: 1,
						validationOutcome: 'Invalid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is an empty array', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						incompleteReasons: [],
						validationOutcome: 'Incomplete'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is an empty array', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						invalidReasons: [],
						validationOutcome: 'Invalid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons contains an invalid value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						incompleteReasons: [{ id: 1 }, { id: 10 }],
						validationOutcome: 'Incomplete'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons contains an invalid value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						invalidReasons: [{ id: 1 }, { id: 10 }],
						validationOutcome: 'Invalid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if validationOutcome is invalid', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(undefined);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						validationOutcome: 'Complete'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if incompleteReasons is not a numeric array', async () => {
				const body = {
					incompleteReasons: [{ id: '1' }, { id: '2' }],
					validationOutcome: 'incomplete'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

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
					validationOutcome: 'incomplete'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if incompleteReasons is given when validationOutcome is not Incomplete', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						incompleteReasons: [{ id: 1 }, { id: 2 }],
						validationOutcome: 'Valid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if invalidReasons is not a numeric array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore

				const body = {
					invalidReasons: [{ id: '1' }, { id: '2' }],
					validationOutcome: 'invalid'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if invalidReasons text contains more than 10 items', async () => {
				const body = {
					invalidReasons: [
						{
							id: '1',
							text: new Array(LENGTH_10 + 1).fill('A')
						}
					],
					validationOutcome: 'invalid'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_MUST_BE_INCOMPLETE_INVALID_REASON
					}
				});
			});

			test('returns an error if invalidReasons is given when validationOutcome is not Invalid', async () => {
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						invalidReasons: [{ id: 1 }, { id: 2 }],
						validationOutcome: 'Valid'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if applicantFirstName is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						applicantFirstName: ['Fiona']
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						applicantFirstName: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if applicantFirstName is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						applicantFirstName: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						applicantFirstName: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if applicantFirstName is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						applicantFirstName: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						applicantFirstName: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('returns an error if applicantSurname is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						applicantSurname: ['Burgess']
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						applicantSurname: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if applicantSurname is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						applicantSurname: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						applicantSurname: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if applicantSurname is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						applicantSurname: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						applicantSurname: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('returns an error if isSiteFullyOwned is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						isSiteFullyOwned: 'yes'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isSiteFullyOwned: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isSiteFullyOwned when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isSiteFullyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isSiteFullyOwned: true
				});
			});

			test('updates isSiteFullyOwned when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isSiteFullyOwned: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					isSiteFullyOwned: false
				});
			});

			test('updates isSiteFullyOwned when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteFullyOwned: 'true'
				};
				const responseBody = {
					isSiteFullyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteFullyOwned when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteFullyOwned: 'false'
				};
				const responseBody = {
					isSiteFullyOwned: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteFullyOwned when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteFullyOwned: 1
				};
				const responseBody = {
					isSiteFullyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteFullyOwned when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteFullyOwned: 0
				};
				const responseBody = {
					isSiteFullyOwned: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteFullyOwned when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteFullyOwned: '1'
				};
				const responseBody = {
					isSiteFullyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteFullyOwned when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteFullyOwned: '0'
				};
				const responseBody = {
					isSiteFullyOwned: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if isSitePartiallyOwned is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						isSitePartiallyOwned: 'yes'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isSitePartiallyOwned: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isSitePartiallyOwned when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isSitePartiallyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates isSitePartiallyOwned when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isSitePartiallyOwned: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates isSitePartiallyOwned when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSitePartiallyOwned: 'true'
				};
				const responseBody = {
					isSitePartiallyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSitePartiallyOwned when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSitePartiallyOwned: 'false'
				};
				const responseBody = {
					isSitePartiallyOwned: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSitePartiallyOwned when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSitePartiallyOwned: 1
				};
				const responseBody = {
					isSitePartiallyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSitePartiallyOwned when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSitePartiallyOwned: 0
				};
				const responseBody = {
					isSitePartiallyOwned: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSitePartiallyOwned when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSitePartiallyOwned: '1'
				};
				const responseBody = {
					isSitePartiallyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSitePartiallyOwned when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSitePartiallyOwned: '0'
				};
				const responseBody = {
					isSitePartiallyOwned: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if areAllOwnersKnown is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						areAllOwnersKnown: 'yes'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						areAllOwnersKnown: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates areAllOwnersKnown when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					areAllOwnersKnown: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates areAllOwnersKnown when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					areAllOwnersKnown: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates areAllOwnersKnown when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					areAllOwnersKnown: 'true'
				};
				const responseBody = {
					areAllOwnersKnown: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates areAllOwnersKnown when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					areAllOwnersKnown: 'false'
				};
				const responseBody = {
					areAllOwnersKnown: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates areAllOwnersKnown when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					areAllOwnersKnown: 1
				};
				const responseBody = {
					areAllOwnersKnown: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates areAllOwnersKnown when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					areAllOwnersKnown: 0
				};
				const responseBody = {
					areAllOwnersKnown: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates areAllOwnersKnown when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					areAllOwnersKnown: '1'
				};
				const responseBody = {
					areAllOwnersKnown: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates areAllOwnersKnown when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					areAllOwnersKnown: '0'
				};
				const responseBody = {
					areAllOwnersKnown: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if hasAttemptedToIdentifyOwners is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						hasAttemptedToIdentifyOwners: 'yes'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						hasAttemptedToIdentifyOwners: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates hasAttemptedToIdentifyOwners when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasAttemptedToIdentifyOwners: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						hasAttemptedToIdentifyOwners: true
					})
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates hasAttemptedToIdentifyOwners when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasAttemptedToIdentifyOwners: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						hasAttemptedToIdentifyOwners: false
					})
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					hasAttemptedToIdentifyOwners: false
				});
			});

			test('updates hasAttemptedToIdentifyOwners when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAttemptedToIdentifyOwners: 'true'
				};
				const responseBody = {
					hasAttemptedToIdentifyOwners: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAttemptedToIdentifyOwners when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAttemptedToIdentifyOwners: 'false'
				};
				const responseBody = {
					hasAttemptedToIdentifyOwners: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAttemptedToIdentifyOwners when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAttemptedToIdentifyOwners: 1
				};
				const responseBody = {
					hasAttemptedToIdentifyOwners: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAttemptedToIdentifyOwners when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAttemptedToIdentifyOwners: 0
				};
				const responseBody = {
					hasAttemptedToIdentifyOwners: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAttemptedToIdentifyOwners when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAttemptedToIdentifyOwners: '1'
				};
				const responseBody = {
					hasAttemptedToIdentifyOwners: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAttemptedToIdentifyOwners when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAttemptedToIdentifyOwners: '0'
				};
				const responseBody = {
					hasAttemptedToIdentifyOwners: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if hasAdvertisedAppeal is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						hasAdvertisedAppeal: 'yes'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						hasAdvertisedAppeal: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates hasAdvertisedAppeal when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasAdvertisedAppeal: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates hasAdvertisedAppeal when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasAdvertisedAppeal: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates hasAdvertisedAppeal when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAdvertisedAppeal: 'true'
				};
				const responseBody = {
					hasAdvertisedAppeal: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAdvertisedAppeal when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAdvertisedAppeal: 'false'
				};
				const responseBody = {
					hasAdvertisedAppeal: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAdvertisedAppeal when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAdvertisedAppeal: 1
				};
				const responseBody = {
					hasAdvertisedAppeal: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAdvertisedAppeal when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAdvertisedAppeal: 0
				};
				const responseBody = {
					hasAdvertisedAppeal: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAdvertisedAppeal when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAdvertisedAppeal: '1'
				};
				const responseBody = {
					hasAdvertisedAppeal: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasAdvertisedAppeal when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasAdvertisedAppeal: '0'
				};
				const responseBody = {
					hasAdvertisedAppeal: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if isSiteVisibleFromPublicRoad is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						isSiteVisibleFromPublicRoad: 'yes'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isSiteVisibleFromPublicRoad: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates isSiteVisibleFromPublicRoad when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isSiteVisibleFromPublicRoad: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates isSiteVisibleFromPublicRoad when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					isSiteVisibleFromPublicRoad: false,
					visibilityRestrictions: 'The site is behind a tall hedge'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates isSiteVisibleFromPublicRoad when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteVisibleFromPublicRoad: 'true'
				};
				const responseBody = {
					isSiteVisibleFromPublicRoad: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteVisibleFromPublicRoad when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteVisibleFromPublicRoad: 'false',
					visibilityRestrictions: 'The site is behind a tall hedge'
				};
				const responseBody = {
					isSiteVisibleFromPublicRoad: false,
					visibilityRestrictions: 'The site is behind a tall hedge'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteVisibleFromPublicRoad when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteVisibleFromPublicRoad: 1
				};
				const responseBody = {
					isSiteVisibleFromPublicRoad: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteVisibleFromPublicRoad when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteVisibleFromPublicRoad: 0,
					visibilityRestrictions: 'The site is behind a tall hedge'
				};
				const responseBody = {
					isSiteVisibleFromPublicRoad: false,
					visibilityRestrictions: 'The site is behind a tall hedge'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteVisibleFromPublicRoad when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteVisibleFromPublicRoad: '1'
				};
				const responseBody = {
					isSiteVisibleFromPublicRoad: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates isSiteVisibleFromPublicRoad when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					isSiteVisibleFromPublicRoad: '0',
					visibilityRestrictions: 'The site is behind a tall hedge'
				};
				const responseBody = {
					isSiteVisibleFromPublicRoad: false,
					visibilityRestrictions: 'The site is behind a tall hedge'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if visibilityRestrictions is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						visibilityRestrictions: ['The site is behind a tall hedge']
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visibilityRestrictions: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if visibilityRestrictions is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						visibilityRestrictions: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visibilityRestrictions: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if visibilityRestrictions is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						visibilityRestrictions: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						visibilityRestrictions: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [
							LENGTH_300
						])
					}
				});
			});

			test('returns an error if isSiteVisibleFromPublicRoad is false and visibilityRestrictions is not given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						isSiteVisibleFromPublicRoad: false
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isSiteVisibleFromPublicRoad: stringTokenReplacement(ERROR_MUST_HAVE_DETAILS, [
							'visibilityRestrictions',
							'isSiteVisibleFromPublicRoad',
							false
						])
					}
				});
			});

			test('returns an error if isSiteVisibleFromPublicRoad is true and visibilityRestrictions is given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						isSiteVisibleFromPublicRoad: true,
						visibilityRestrictions: 'The site is behind a tall hedge'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						isSiteVisibleFromPublicRoad: stringTokenReplacement(ERROR_MUST_NOT_HAVE_DETAILS, [
							'visibilityRestrictions',
							'isSiteVisibleFromPublicRoad',
							true
						])
					}
				});
			});

			test('returns an error if hasHealthAndSafetyIssues is not a boolean', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						hasHealthAndSafetyIssues: 'yes'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						hasHealthAndSafetyIssues: ERROR_MUST_BE_BOOLEAN
					}
				});
			});

			test('updates hasHealthAndSafetyIssues when given boolean true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasHealthAndSafetyIssues: true,
					healthAndSafetyIssues: 'There is no mobile reception at the site'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates hasHealthAndSafetyIssues when given boolean false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const body = {
					hasHealthAndSafetyIssues: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates hasHealthAndSafetyIssues when given string true', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasHealthAndSafetyIssues: 'true',
					healthAndSafetyIssues: 'There is no mobile reception at the site'
				};
				const responseBody = {
					hasHealthAndSafetyIssues: true,
					healthAndSafetyIssues: 'There is no mobile reception at the site'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasHealthAndSafetyIssues when given string false', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasHealthAndSafetyIssues: 'false'
				};
				const responseBody = {
					hasHealthAndSafetyIssues: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasHealthAndSafetyIssues when given numeric 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasHealthAndSafetyIssues: 1,
					healthAndSafetyIssues: 'There is no mobile reception at the site'
				};
				const responseBody = {
					hasHealthAndSafetyIssues: true,
					healthAndSafetyIssues: 'There is no mobile reception at the site'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasHealthAndSafetyIssues when given numeric 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasHealthAndSafetyIssues: 0
				};
				const responseBody = {
					hasHealthAndSafetyIssues: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasHealthAndSafetyIssues when given string 1', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasHealthAndSafetyIssues: '1',
					healthAndSafetyIssues: 'There is no mobile reception at the site'
				};
				const responseBody = {
					hasHealthAndSafetyIssues: true,
					healthAndSafetyIssues: 'There is no mobile reception at the site'
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('updates hasHealthAndSafetyIssues when given string 0', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const requestBody = {
					hasHealthAndSafetyIssues: '0'
				};
				const responseBody = {
					hasHealthAndSafetyIssues: false
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(requestBody)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: responseBody
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(responseBody);
			});

			test('returns an error if healthAndSafetyIssues is not a string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						healthAndSafetyIssues: ['There is no mobile reception at the site']
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						healthAndSafetyIssues: ERROR_MUST_BE_STRING
					}
				});
			});

			test('returns an error if healthAndSafetyIssues is an empty string', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						healthAndSafetyIssues: ''
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						healthAndSafetyIssues: ERROR_CANNOT_BE_EMPTY_STRING
					}
				});
			});

			test('returns an error if healthAndSafetyIssues is more than 300 characters', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						healthAndSafetyIssues: 'A'.repeat(LENGTH_300 + 1)
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						healthAndSafetyIssues: stringTokenReplacement(ERROR_MAX_LENGTH_CHARACTERS, [LENGTH_300])
					}
				});
			});

			test('returns an error if hasHealthAndSafetyIssues is false and healthAndSafetyIssues is given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						hasHealthAndSafetyIssues: false,
						healthAndSafetyIssues: 'There is no mobile reception at the site'
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						hasHealthAndSafetyIssues: stringTokenReplacement(ERROR_MUST_NOT_HAVE_DETAILS, [
							'healthAndSafetyIssues',
							'hasHealthAndSafetyIssues',
							false
						])
					}
				});
			});

			test('returns an error if hasHealthAndSafetyIssues is true and healthAndSafetyIssues is not given', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({
						hasHealthAndSafetyIssues: true
					})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						hasHealthAndSafetyIssues: stringTokenReplacement(ERROR_MUST_HAVE_DETAILS, [
							'healthAndSafetyIssues',
							'hasHealthAndSafetyIssues',
							true
						])
					}
				});
			});

			test('does not return an error when given an empty body', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send({})
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({});
			});

			test('returns an error when unable to save the data', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCase.update.mockImplementation(() => {
					throw new Error('Internal Server Error');
				});

				const body = {
					isSiteFullyOwned: true
				};
				const { appellantCase, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appellant-cases/${appellantCase.id}`)
					.send(body)
					.set('azureAdUserId', azureAdUserId);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					data: body,
					where: {
						id: appellantCase.id
					}
				});
				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: body
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
