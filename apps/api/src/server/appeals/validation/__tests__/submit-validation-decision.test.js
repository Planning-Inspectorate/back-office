import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal1 = appealFactoryForTests({
	appealId: 1,
	statuses: [
		{
			id: 1,
			status: 'received_appeal',
			valid: true
		}
	],
	typeShorthand: 'HAS'
});

const appeal10 = appealFactoryForTests({
	appealId: 10,
	statuses: [
		{
			id: 10,
			status: 'received_appeal',
			valid: true
		}
	],
	typeShorthand: 'FPA'
});

const appeal2 = appealFactoryForTests({
	appealId: 2,
	statuses: [
		{
			id: 2,
			status: 'valid_appeal',
			valid: true
		}
	],
	typeShorthand: 'HAS'
});

const appeal3 = appealFactoryForTests({
	appealId: 3,
	statuses: [
		{
			id: 3,
			status: 'invalid_appeal',
			valid: true
		}
	],
	typeShorthand: 'HAS'
});

const appeal4 = appealFactoryForTests({
	appealId: 3,
	statuses: [
		{
			id: 4,
			status: 'awaiting_validation_info',
			valid: true
		}
	],
	typeShorthand: 'HAS'
});

describe('Submit validation decision', () => {
	test("should be able to submit 'valid' decision for household appeal", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request
			.post('/appeals/validation/1')
			.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'Some Desc' });

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { updatedAt: expect.any(Date), startedAt: expect.any(Date) }
		});
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'awaiting_lpa_questionnaire', appealId: 1 }
		});
		expect(databaseConnector.validationDecision.create).toHaveBeenCalledWith({
			data: {
				appealId: 1,
				decision: 'valid',
				descriptionOfDevelopment: 'Some Desc'
			}
		});
	});

	test("should be able to submit 'valid' decision for full planning appeal", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal10);

		// WHEN
		const resp = await request
			.post('/appeals/validation/10')
			.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'Some Desc' });

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [10] } },
			data: { valid: false }
		});
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 10 },
			data: { updatedAt: expect.any(Date), startedAt: expect.any(Date) }
		});
		expect(databaseConnector.appealStatus.createMany).toHaveBeenCalledWith({
			data: [
				{
					status: 'awaiting_lpa_questionnaire',
					appealId: 10,
					subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
					compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
				},
				{
					status: 'available_for_statements',
					appealId: 10,
					subStateMachineName: 'statementsAndFinalComments',
					compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
				}
			]
		});
		expect(databaseConnector.validationDecision.create).toHaveBeenCalledWith({
			data: {
				appealId: 10,
				decision: 'valid',
				descriptionOfDevelopment: 'Some Desc'
			}
		});
	});

	test("should be able to submit 'invalid' decision", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/1').send({
			AppealStatus: 'invalid',
			Reason: {
				outOfTime: true,
				noRightOfAppeal: true,
				notAppealable: true,
				lPADeemedInvalid: true,
				otherReasons: ''
			}
		});

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'invalid_appeal', appealId: 1 }
		});
		expect(databaseConnector.validationDecision.create).toHaveBeenCalledWith({
			data: {
				appealId: 1,
				decision: 'invalid',
				descriptionOfDevelopment: undefined,
				outOfTime: true,
				noRightOfAppeal: true,
				notAppealable: true,
				lPADeemedInvalid: true,
				otherReasons: ''
			}
		});
	});

	test("should be able to submit 'missing appeal details' decision", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/1').send({
			AppealStatus: 'incomplete',
			Reason: {
				namesDoNotMatch: true,
				sensitiveInfo: true,
				missingApplicationForm: true,
				missingDecisionNotice: true,
				missingGroundsForAppeal: true,
				missingSupportingDocuments: true,
				inflammatoryComments: true,
				openedInError: true,
				wrongAppealTypeUsed: true
			}
		});

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'awaiting_validation_info', appealId: 1 }
		});
		expect(databaseConnector.validationDecision.create).toHaveBeenCalledWith({
			data: {
				appealId: 1,
				decision: 'incomplete',
				descriptionOfDevelopment: undefined,
				namesDoNotMatch: true,
				sensitiveInfo: true,
				missingApplicationForm: true,
				missingDecisionNotice: true,
				missingGroundsForAppeal: true,
				missingSupportingDocuments: true,
				inflammatoryComments: true,
				openedInError: true,
				wrongAppealTypeUsed: true
			}
		});
	});

	test("should be able to mark appeal with missing info as 'valid'", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal4);

		const descriptionOfDevelopment = 'some desc';

		// WHEN
		const resp = await request
			.post('/appeals/validation/4')
			.send({ AppealStatus: 'valid', descriptionOfDevelopment });

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [4] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'awaiting_lpa_questionnaire', appealId: 3 }
		});
		expect(databaseConnector.validationDecision.create).toHaveBeenCalledWith({
			data: {
				appealId: appeal4.id,
				decision: 'valid',
				descriptionOfDevelopment
			}
		});
	});

	test('should not be able to submit nonsensical decision decision', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request
			.post('/appeals/validation/1')
			.send({ AppealStatus: 'some unknown status' });

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit validation decision for appeal that has been marked 'valid'", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal2);

		// WHEN
		const resp = await request
			.post('/appeals/validation/2')
			.send({ AppealStatus: 'invalid', Reason: { outOfTime: true } });

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				appeal: 'Appeal is in an invalid state'
			}
		});
	});

	test("should not be able to submit validation decision for appeal that has been marked 'invalid'", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal3);

		// WHEN
		const resp = await request
			.post('/appeals/validation/3')
			.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'Some desc' });

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				appeal: 'Appeal is in an invalid state'
			}
		});
	});

	test("should not be able to submit decision as 'invalid' if there is no reason marked", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/5').send({
			AppealStatus: 'invalid',
			Reason: {
				outOfTime: false,
				noRightOfAppeal: false,
				notAppealable: false,
				lPADeemedInvalid: false,
				otherReasons: ''
			}
		});

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'invalid' if there is no reason being sent", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/5').send({
			AppealStatus: 'invalid',
			Reason: {}
		});

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'incomplete' if there is no reason marked", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/6').send({
			AppealStatus: 'incomplete',
			Reason: {
				outOfTime: true,
				noRightOfAppeal: false,
				notAppealable: false,
				lPADeemedInvalid: false,
				otherReasons: ''
			}
		});

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'incomplete' if providing invalid reasons", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/6').send({
			AppealStatus: 'incomplete',
			Reason: {
				namesDoNotMatch: false,
				sensitiveInfo: false,
				missingApplicationForm: false,
				missingDecisionNotice: false,
				missingGroundsForAppeal: false,
				missingSupportingDocuments: false,
				inflammatoryComments: false,
				openedInError: false,
				wrongAppealTypeUsed: false,
				otherReasons: ''
			}
		});

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'invalid' if providing incomplete reasons", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/6').send({
			AppealStatus: 'invalid',
			Reason: {
				someFakeReason: true
			}
		});

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'incomplete' if there is no reason being sent", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/5').send({
			AppealStatus: 'incomplete',
			Reason: {}
		});

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test('should not be able to submit an unknown decision string', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request
			.post('/appeals/validation/5')
			.send({ AppealStatus: 'blah blah blah' });

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit 'valid' decision without DescriptionOfDevelopment", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.post('/appeals/validation/5').send({ AppealStatus: 'valid' });

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit 'valid' decision with empty DescriptionOfDevelopment", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request
			.post('/appeals/validation/5')
			.send({ AppealStatus: 'valid', DescriptionOfDevelopment: '' });

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});
});
