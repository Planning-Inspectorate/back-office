import { request } from '../../../app-test.js';
import {
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_MUST_BE_BUSINESS_DAY,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_IN_FUTURE,
	ERROR_MUST_NOT_HAVE_TIMETABLE_DATE,
	ERROR_NOT_FOUND
} from '../../constants.js';
import { fullPlanningAppeal, householdAppeal } from '#tests/data.js';
import joinDateAndTime from '#utils/join-date-and-time.js';
import errorMessageReplacement from '#utils/error-message-replacement.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const futureDate = '2099-09-01';
const futureDateAndTime = joinDateAndTime(futureDate);

describe('appeal timetables routes', () => {
	describe('/appeals/:appealId/appeal-timetables/:appealTimetableId', () => {
		describe('PATCH', () => {
			const householdAppealRequestBody = {
				issueDeterminationDate: futureDate,
				lpaQuestionnaireDueDate: futureDate
			};
			const householdAppealResponseBody = {
				issueDeterminationDate: futureDateAndTime,
				lpaQuestionnaireDueDate: futureDateAndTime
			};
			const fullPlanningAppealRequestBody = {
				finalCommentReviewDate: futureDate,
				issueDeterminationDate: futureDate,
				lpaQuestionnaireDueDate: futureDate,
				statementReviewDate: futureDate
			};
			const fullPlanningAppealResponseBody = {
				finalCommentReviewDate: futureDateAndTime,
				issueDeterminationDate: futureDateAndTime,
				lpaQuestionnaireDueDate: futureDateAndTime,
				statementReviewDate: futureDateAndTime
			};

			test('updates a household appeal timetable', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(householdAppealRequestBody);

				expect(databaseConnector.appealTimetable.update).toHaveBeenCalledWith({
					data: householdAppealResponseBody,
					where: {
						id: appealTimetable.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(householdAppealResponseBody);
			});

			test('updates a full planning appeal timetable', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(fullPlanningAppealRequestBody);

				expect(databaseConnector.appealTimetable.update).toHaveBeenCalledWith({
					data: fullPlanningAppealResponseBody,
					where: {
						id: appealTimetable.id
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(fullPlanningAppealResponseBody);
			});

			test('returns an error if appealId is not numeric', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request
					.patch(`/appeals/one/appeal-timetables/${householdAppeal.appealTimetable.id}`)
					.send(householdAppealRequestBody);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const { appealTimetable } = householdAppeal;
				const response = await request
					.patch(`/appeals/3/appeal-timetables/${appealTimetable.id}`)
					.send(householdAppealRequestBody);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appealTimetableId is not numeric', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appeal-timetables/one`)
					.send(householdAppealRequestBody);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealTimetableId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appealTimetableId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/3`)
					.send(householdAppealRequestBody);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealTimetableId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if finalCommentReviewDate is not in the correct format', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						finalCommentReviewDate: '05/05/2023'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						finalCommentReviewDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if finalCommentReviewDate does not contain leading zeros', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						finalCommentReviewDate: '2023-5-5'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						finalCommentReviewDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if finalCommentReviewDate is not in the future', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const body = {
					finalCommentReviewDate: '2023-06-04'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						finalCommentReviewDate: ERROR_MUST_BE_IN_FUTURE
					}
				});
			});

			test('returns an error if finalCommentReviewDate is a weekend day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const body = {
					finalCommentReviewDate: '2099-09-19'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						finalCommentReviewDate: ERROR_MUST_BE_BUSINESS_DAY
					}
				});
			});

			test('returns an error if finalCommentReviewDate is a bank holiday day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const body = {
					finalCommentReviewDate: '2025-12-25'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						finalCommentReviewDate: ERROR_MUST_BE_BUSINESS_DAY
					}
				});
			});

			test('returns an error if finalCommentReviewDate is not a valid date', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						finalCommentReviewDate: '2099-02-30'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						finalCommentReviewDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if finalCommentReviewDate is given for a household appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, appealType, id } = householdAppeal;
				const body = {
					finalCommentReviewDate: futureDate
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						finalCommentReviewDate: errorMessageReplacement(ERROR_MUST_NOT_HAVE_TIMETABLE_DATE, [
							appealType.type
						])
					}
				});
			});

			test('returns an error if issueDeterminationDate is not in the correct format', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						issueDeterminationDate: '05/05/2023'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						issueDeterminationDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if issueDeterminationDate does not contain leading zeros', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						issueDeterminationDate: '2023-5-5'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						issueDeterminationDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if issueDeterminationDate is not in the future', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const body = {
					issueDeterminationDate: '2023-06-04'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						issueDeterminationDate: ERROR_MUST_BE_IN_FUTURE
					}
				});
			});

			test('returns an error if issueDeterminationDate is a weekend day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const body = {
					issueDeterminationDate: '2099-09-19'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						issueDeterminationDate: ERROR_MUST_BE_BUSINESS_DAY
					}
				});
			});

			test('returns an error if issueDeterminationDate is a bank holiday day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const body = {
					issueDeterminationDate: '2025-12-25'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						issueDeterminationDate: ERROR_MUST_BE_BUSINESS_DAY
					}
				});
			});

			test('returns an error if issueDeterminationDate is not a valid date', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						issueDeterminationDate: '2099-02-30'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						issueDeterminationDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is not in the correct format', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						lpaQuestionnaireDueDate: '05/05/2023'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate does not contain leading zeros', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						lpaQuestionnaireDueDate: '2023-5-5'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is not in the future', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const body = {
					lpaQuestionnaireDueDate: '2023-06-04'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_IN_FUTURE
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is a weekend day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const body = {
					lpaQuestionnaireDueDate: '2099-09-19'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_BUSINESS_DAY
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is a bank holiday day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const body = {
					lpaQuestionnaireDueDate: '2025-12-25'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_BUSINESS_DAY
					}
				});
			});

			test('returns an error if lpaQuestionnaireDueDate is not a valid date', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						lpaQuestionnaireDueDate: '2023-02-30'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireDueDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if statementReviewDate is not in the correct format', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						statementReviewDate: '05/05/2023'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						statementReviewDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if statementReviewDate does not contain leading zeros', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						statementReviewDate: '2023-5-5'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						statementReviewDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if statementReviewDate is not in the future', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const body = {
					statementReviewDate: '2023-06-04'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						statementReviewDate: ERROR_MUST_BE_IN_FUTURE
					}
				});
			});

			test('returns an error if statementReviewDate is a weekend day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const body = {
					statementReviewDate: '2099-09-19'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						statementReviewDate: ERROR_MUST_BE_BUSINESS_DAY
					}
				});
			});

			test('returns an error if statementReviewDate is a bank holiday day', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const body = {
					statementReviewDate: '2025-12-25'
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						statementReviewDate: ERROR_MUST_BE_BUSINESS_DAY
					}
				});
			});

			test('returns an error if statementReviewDate is not a valid date', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appealTimetable, id } = fullPlanningAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({
						statementReviewDate: '2023-02-30'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						statementReviewDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
					}
				});
			});

			test('returns an error if statementReviewDate is given for a household appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, appealType, id } = householdAppeal;
				const body = {
					statementReviewDate: futureDate
				};
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(body);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						statementReviewDate: errorMessageReplacement(ERROR_MUST_NOT_HAVE_TIMETABLE_DATE, [
							appealType.type
						])
					}
				});
			});

			test('does not return an error when given an empty body', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send({});

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({});
			});

			test('returns an error when unable to save the data', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appealTimetable.update.mockImplementation(() => {
					throw new Error('Internal Server Error');
				});

				const { appealTimetable, id } = householdAppeal;
				const response = await request
					.patch(`/appeals/${id}/appeal-timetables/${appealTimetable.id}`)
					.send(householdAppealRequestBody);

				expect(databaseConnector.appealTimetable.update).toHaveBeenCalledWith({
					data: householdAppealResponseBody,
					where: {
						id: appealTimetable.id
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
