// @ts-nocheck
import { request } from '#tests/../app-test.js';
import {
	ERROR_NOT_FOUND,
	ERROR_INVALID_APPELLANT_CASE_DATA,
	ERROR_INVALID_LPAQ_DATA
} from '#endpoints/constants.js';
import { validAppellantCase, validLpaQuestionnaire } from '#tests/integrations/mocks.js';

const { databaseConnector } = await import('#utils/database-connector.js');

describe('/appeals/case-submission', () => {
	describe('POST invalid appellant case submission', () => {
		test('invalid appellant case payload: no appeal', async () => {
			const { appeal, ...invalidPayload } = validAppellantCase;
			const response = await request.post('/appeals/case-submission').send(invalidPayload);

			expect(appeal).not.toBeUndefined();
			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					details: ["/: must have required property 'appeal'"],
					integration: ERROR_INVALID_APPELLANT_CASE_DATA
				}
			});
		});

		test('invalid appellant case payload: no LPA', async () => {
			const { LPACode, ...invalidPayload } = validAppellantCase.appeal;
			const payload = { appeal: { ...invalidPayload } };
			const response = await request.post('/appeals/case-submission').send(payload);

			expect(LPACode).not.toBeUndefined();
			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					details: ["/appeal: must have required property 'LPACode'"],
					integration: ERROR_INVALID_APPELLANT_CASE_DATA
				}
			});
		});

		test('invalid appellant case payload: no appeal type', async () => {
			const { appealType, ...invalidPayload } = validAppellantCase.appeal;
			const payload = { appeal: { ...invalidPayload } };
			const response = await request.post('/appeals/case-submission').send(payload);

			expect(appealType).not.toBeUndefined();
			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					details: ["/appeal: must have required property 'appealType'"],
					integration: ERROR_INVALID_APPELLANT_CASE_DATA
				}
			});
		});

		test('invalid appellant case payload: no appellant', async () => {
			const { appellant, ...invalidPayload } = validAppellantCase.appeal;
			const payload = { appeal: { ...invalidPayload } };
			const response = await request.post('/appeals/case-submission').send(payload);

			expect(appellant).not.toBeUndefined();
			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					details: ["/appeal: must have required property 'appellant'"],
					integration: ERROR_INVALID_APPELLANT_CASE_DATA
				}
			});
		});
	});
});

describe('/appeals/lpaq-submission', () => {
	describe('POST invalid questionnaire submission', () => {
		test('invalid lpaq payload: no questionnaire', async () => {
			const { questionnaire, ...invalidPayload } = validLpaQuestionnaire;
			const response = await request.post('/appeals/lpaq-submission').send(invalidPayload);

			expect(questionnaire).not.toBeUndefined();
			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					details: ["/: must have required property 'questionnaire'"],
					integration: ERROR_INVALID_LPAQ_DATA
				}
			});
		});

		test('invalid lpaq payload: no LPA', async () => {
			const { LPACode, ...invalidPayload } = validLpaQuestionnaire.questionnaire;
			const payload = { questionnaire: { ...invalidPayload } };
			const response = await request.post('/appeals/lpaq-submission').send(payload);

			expect(LPACode).not.toBeUndefined();
			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					details: ["/questionnaire: must have required property 'LPACode'"],
					integration: ERROR_INVALID_LPAQ_DATA
				}
			});
		});

		test('invalid lpaq payload: no case reference', async () => {
			const { caseReference, ...invalidPayload } = validLpaQuestionnaire.questionnaire;
			const payload = { questionnaire: { ...invalidPayload } };
			const response = await request.post('/appeals/lpaq-submission').send(payload);

			expect(caseReference).not.toBeUndefined();
			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					details: ["/questionnaire: must have required property 'caseReference'"],
					integration: ERROR_INVALID_LPAQ_DATA
				}
			});
		});

		test('valid lpaq payload: case reference not found', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(null);
			const response = await request.post('/appeals/lpaq-submission').send(validLpaQuestionnaire);

			expect(response.body).toEqual({
				errors: {
					appeal: ERROR_NOT_FOUND
				}
			});
			expect(response.status).toEqual(404);
		});
	});
});
