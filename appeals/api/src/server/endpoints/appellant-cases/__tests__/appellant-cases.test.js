// @ts-nocheck
import { jest } from '@jest/globals';
import { format } from 'date-fns';
import { request } from '../../../app-test.js';
import {
	DEFAULT_DATE_FORMAT_DATABASE,
	DEFAULT_DATE_FORMAT_DISPLAY,
	DEFAULT_TIMESTAMP_TIME,
	ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME,
	ERROR_MUST_BE_ARRAY_OF_IDS,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE,
	ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS,
	ERROR_NOT_FOUND,
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME,
	ERROR_OTHER_NOT_VALID_REASONS_REQUIRED,
	ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS,
	ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED,
	STATE_TARGET_INVALID,
	STATE_TARGET_LPA_QUESTIONNAIRE_DUE
} from '../../constants.js';
import {
	appellantCaseIncompleteReasons,
	appellantCaseInvalidReasons,
	appellantCaseValidationOutcomes,
	baseExpectedAppellantCaseResponse,
	fullPlanningAppeal,
	fullPlanningAppealAppellantCaseIncomplete,
	fullPlanningAppealAppellantCaseInvalid,
	householdAppeal,
	householdAppealAppellantCaseIncomplete,
	householdAppealAppellantCaseInvalid,
	householdAppealAppellantCaseValid
} from '../../../tests/data.js';
import { folder } from '#tests/documents/mocks.js';
import joinDateAndTime from '#utils/join-date-and-time.js';
import { calculateTimetable } from '../../../utils/business-days.js';
import config from '../../../config/config.js';
import { NotifyClient } from 'notifications-node-client';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const startedAt = new Date(joinDateAndTime(format(new Date(), DEFAULT_DATE_FORMAT_DATABASE)));
const notifyClient = new NotifyClient();

describe('appellant cases routes', () => {
	config.govNotify.api.key = 'gov-notify-api-key-123';

	afterEach(() => {
		jest.resetAllMocks();
		jest.useRealTimers();
	});

	describe('/appeals/:appealId/appellant-cases/:appellantCaseId', () => {
		describe('GET', () => {
			test('gets a single appellant case for a household appeal with no validation outcome', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([folder]);
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase } = householdAppeal;
				const response = await request.get(
					`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(baseExpectedAppellantCaseResponse(householdAppeal));
			});

			test('gets a single appellant case for a valid household appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([folder]);
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppealAppellantCaseValid);

				const { appellantCase } = householdAppealAppellantCaseValid;
				const response = await request.get(
					`/appeals/${householdAppealAppellantCaseValid.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(householdAppealAppellantCaseValid)
				);
			});

			test('gets a single appellant case for an incomplete household appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([folder]);
				databaseConnector.appeal.findUnique.mockResolvedValue(
					householdAppealAppellantCaseIncomplete
				);

				const { appellantCase } = householdAppealAppellantCaseIncomplete;
				const response = await request.get(
					`/appeals/${householdAppealAppellantCaseIncomplete.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(householdAppealAppellantCaseIncomplete)
				);
			});

			test('gets a single appellant case for an invalid household appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([folder]);
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppealAppellantCaseInvalid);

				const { appellantCase } = householdAppealAppellantCaseInvalid;
				const response = await request.get(
					`/appeals/${householdAppealAppellantCaseInvalid.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(householdAppealAppellantCaseInvalid)
				);
			});

			test('gets a single appellant case for a valid full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([folder]);
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appellantCase } = fullPlanningAppeal;
				const response = await request.get(
					`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(baseExpectedAppellantCaseResponse(fullPlanningAppeal));
			});

			test('gets a single appellant case for an incomplete full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([folder]);
				databaseConnector.appeal.findUnique.mockResolvedValue(
					fullPlanningAppealAppellantCaseIncomplete
				);

				const { appellantCase } = fullPlanningAppealAppellantCaseIncomplete;
				const response = await request.get(
					`/appeals/${fullPlanningAppealAppellantCaseIncomplete.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(fullPlanningAppealAppellantCaseIncomplete)
				);
			});

			test('gets a single appellant case for an invalid full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.folder.findMany.mockResolvedValue([folder]);
				databaseConnector.appeal.findUnique.mockResolvedValue(
					fullPlanningAppealAppellantCaseInvalid
				);

				const { appellantCase } = fullPlanningAppealAppellantCaseInvalid;
				const response = await request.get(
					`/appeals/${fullPlanningAppealAppellantCaseInvalid.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(
					baseExpectedAppellantCaseResponse(fullPlanningAppealAppellantCaseInvalid)
				);
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.get(
					`/appeals/one/appellant-cases/${householdAppeal.appellantCase.id}`
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
					`/appeals/3/appellant-cases/${householdAppeal.appellantCase.id}`
				);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantCaseId is not numeric', async () => {
				const response = await request.get(`/appeals/${householdAppeal.id}/appellant-cases/one`);

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

				const response = await request.get(`/appeals/${householdAppeal.id}/appellant-cases/3`);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_NOT_FOUND
					}
				});
			});
		});

		describe('PATCH', () => {
			test('updates appellant case when the validation outcome is Incomplete with numeric array and an appeal due date', async () => {
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
					appealDueDate: '2023-07-14',
					incompleteReasons: [1, 2, 3],
					validationOutcome: 'Incomplete',
					otherNotValidReasons: 'Another reason'
				};
				const formattedAppealDueDate = joinDateAndTime(body.appealDueDate);
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 1,
						otherNotValidReasons: 'Another reason'
					}
				});
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.id },
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

			test('updates appellant case when the validation outcome is incomplete with string array and no appeal due date', async () => {
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
					incompleteReasons: ['1', '2', '3'],
					validationOutcome: 'incomplete',
					otherNotValidReasons: 'Another reason'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 1,
						otherNotValidReasons: 'Another reason'
					}
				});
				expect(databaseConnector.appealStatus.create).not.toHaveBeenCalled();
				expect(databaseConnector.appeal.update).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
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

				const body = {
					invalidReasons: [1, 2, 3],
					validationOutcome: 'Invalid',
					otherNotValidReasons: 'Another reason'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 2,
						otherNotValidReasons: 'Another reason'
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_INVALID,
						valid: true
					}
				});
				expect(databaseConnector.appeal.update).not.toHaveBeenCalled();
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is invalid with string array', async () => {
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

				const body = {
					invalidReasons: ['1', '2', '3'],
					validationOutcome: 'invalid',
					otherNotValidReasons: 'Another reason'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 2,
						otherNotValidReasons: 'Another reason'
					}
				});
				expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
					data: {
						appealId: householdAppeal.id,
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

				const expectedTimeTable = await calculateTimetable(
					householdAppeal.appealType.shorthand,
					startedAt
				);
				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

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
						appealId: householdAppeal.id,
						createdAt: expect.any(Date),
						status: STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
						valid: true
					}
				});
				expect(notifyClient.sendEmail).toHaveBeenCalledWith(
					config.govNotify.template.validAppellantCase.id,
					householdAppeal.appellant.email,
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
				expect(databaseConnector.appeal.update).toHaveBeenCalledTimes(1);
				expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
					where: { id: householdAppeal.id },
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
					.send(body);

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
					fullPlanningAppeal.appellant.email,
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

				jest.useFakeTimers().setSystemTime(new Date('2023-12-18'));

				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

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

				jest.useFakeTimers().setSystemTime(new Date('2023-06-05'));

				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

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

				jest.useFakeTimers().setSystemTime(new Date('2023-05-22'));

				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

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
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/one/appellant-cases/${householdAppeal.appellantCase.id}`)
					.send({
						validationOutcome: 'Valid'
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
					.patch(`/appeals/3/appellant-cases/${householdAppeal.appellantCase.id}`)
					.send({
						validationOutcome: 'Valid'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantCaseId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/one`)
					.send({
						validationOutcome: 'Valid'
					});

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

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/3`)
					.send({
						validationOutcome: 'Valid'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appealDueDate is not in the correct format', async () => {
				const response = await request
					.patch(
						`/appeals/${fullPlanningAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						appealDueDate: '05/05/2023',
						incompleteReasons: [1],
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if appealDueDate does not contain leading zeros', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						appealDueDate: '2023-5-5',
						incompleteReasons: [1],
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if appealDueDate is not a valid date', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						appealDueDate: '2023-02-30',
						incompleteReasons: [1],
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is not given', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is not given', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						validationOutcome: 'Invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is not an array', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: 1,
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_BE_ARRAY_OF_IDS
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is not an array', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: 1,
						validationOutcome: 'Invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_MUST_BE_ARRAY_OF_IDS
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is an empty array', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [],
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is an empty array', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [],
						validationOutcome: 'Invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE
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

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [1, 10],
						validationOutcome: 'Incomplete'
					});

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

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [1, 10],
						validationOutcome: 'Invalid'
					});

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

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						validationOutcome: 'Complete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if otherNotValidReasons is not given when validationOutcome is Incomplete and Other is selected', async () => {
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

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [1, 2, 3],
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_OTHER_NOT_VALID_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if otherNotValidReasons is not given when validationOutcome is Invalid and Other is selected', async () => {
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

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [1, 2, 3],
						validationOutcome: 'Invalid'
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
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [1, 2],
						validationOutcome: 'Incomplete',
						otherNotValidReasons: 'Another reason'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS
					}
				});
			});

			test('returns an error if otherNotValidReasons is given when validationOutcome is Invalid and Other is not selected', async () => {
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

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [1, 2],
						validationOutcome: 'Invalid',
						otherNotValidReasons: 'Another reason'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS
					}
				});
			});

			test('returns an error if incompleteReasons is given when validationOutcome is not Incomplete', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [1, 2],
						validationOutcome: 'Valid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if invalidReasons is given when validationOutcome is not Invalid', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [1, 2],
						validationOutcome: 'Valid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if otherNotValidReasons is given when validationOutcome is Valid', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						validationOutcome: 'Valid',
						otherNotValidReasons: 'Another reason'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS
					}
				});
			});
		});
	});
});
