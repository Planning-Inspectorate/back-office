import Prisma from '@prisma/client';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

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

const getAppealByIdStub = sinon.stub();
const updateStub = sinon.stub();

const includingDetailsForResponse = {
	validationDecision: true,
	address: true,
	appellant: true,
	appealStatus: { where: { valid: true } },
	appealType: true
};
const includingDetailsForValidtion = {
	appealStatus: { where: { valid: true } },
	appealType: true
};

getAppealByIdStub
	.withArgs({ where: { id: 1 }, include: includingDetailsForResponse })
	.returns(appeal1);
getAppealByIdStub
	.withArgs({ where: { id: 1 }, include: includingDetailsForValidtion })
	.returns(appeal1);
getAppealByIdStub
	.withArgs({ where: { id: 2 }, include: includingDetailsForResponse })
	.returns(appeal2);
getAppealByIdStub
	.withArgs({ where: { id: 2 }, include: includingDetailsForValidtion })
	.returns(appeal2);
getAppealByIdStub
	.withArgs({ where: { id: 3 }, include: includingDetailsForResponse })
	.returns(appeal3);
getAppealByIdStub
	.withArgs({ where: { id: 3 }, include: includingDetailsForValidtion })
	.returns(appeal3);
getAppealByIdStub
	.withArgs({ where: { id: 4 }, include: includingDetailsForResponse })
	.returns(appeal4);
getAppealByIdStub
	.withArgs({ where: { id: 4 }, include: includingDetailsForValidtion })
	.returns(appeal4);
getAppealByIdStub
	.withArgs({ where: { id: 5 }, include: includingDetailsForValidtion })
	.returns({ status: 'received_appeal' });
getAppealByIdStub
	.withArgs({ where: { id: 6 }, include: includingDetailsForValidtion })
	.returns({ status: 'received_appeal' });
getAppealByIdStub
	.withArgs({ where: { id: 10 }, include: includingDetailsForResponse })
	.returns(appeal10);
getAppealByIdStub
	.withArgs({ where: { id: 10 }, include: includingDetailsForValidtion })
	.returns(appeal10);

updateStub.returns({ ...appeal1 });

const addNewDecisionStub = sinon.stub();

const newDecision = {
	appealId: 1,
	decision: 'incomplete',
	outOfTime: true
};

addNewDecisionStub.returns(newDecision);

const createLpaQuestionnaireStub = sinon.stub();
const updateManyAppealStatusStub = sinon.stub();
const createManyAppealStatusesStub = sinon.stub();
const createAppealStatusStub = sinon.stub();

describe('Submit validation decision', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'appeal').get(() => {
			return { findUnique: getAppealByIdStub, update: updateStub };
		});
		sinon.stub(databaseConnector, 'validationDecision').get(() => {
			return { create: addNewDecisionStub };
		});
		sinon.stub(databaseConnector, 'lPAQuestionnaire').get(() => {
			return { create: createLpaQuestionnaireStub };
		});
		sinon.stub(databaseConnector, 'appealStatus').get(() => {
			return {
				create: createAppealStatusStub,
				updateMany: updateManyAppealStatusStub,
				createMany: createManyAppealStatusesStub
			};
		});
		sinon.stub(Prisma.PrismaClient.prototype, '$transaction');
	});

	test("should be able to submit 'valid' decision for household appeal", async () => {
		const resp = await request
			.post('/appeals/validation/1')
			.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'Some Desc' });

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateStub, {
			where: { id: 1 },
			data: { updatedAt: sinon.match.any, startedAt: sinon.match.any }
		});
		sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		sinon.assert.calledWithExactly(createAppealStatusStub, {
			data: { status: 'awaiting_lpa_questionnaire', appealId: 1 }
		});
		sinon.assert.calledWithExactly(addNewDecisionStub, {
			data: {
				appealId: 1,
				decision: 'valid',
				descriptionOfDevelopment: 'Some Desc'
			}
		});
	});

	test("should be able to submit 'valid' decision for full planning appeal", async () => {
		const resp = await request
			.post('/appeals/validation/10')
			.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'Some Desc' });

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
			where: { id: { in: [10] } },
			data: { valid: false }
		});
		sinon.assert.calledWithExactly(updateStub, {
			where: { id: 10 },
			data: { updatedAt: sinon.match.any, startedAt: sinon.match.any }
		});
		sinon.assert.calledWithExactly(createManyAppealStatusesStub, {
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
		sinon.assert.calledWithExactly(addNewDecisionStub, {
			data: {
				appealId: 10,
				decision: 'valid',
				descriptionOfDevelopment: 'Some Desc'
			}
		});
	});

	test("should be able to submit 'invalid' decision", async () => {
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

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		sinon.assert.calledWithExactly(createAppealStatusStub, {
			data: { status: 'invalid_appeal', appealId: 1 }
		});
		// TODO: calledOneWithExactly throws error
		sinon.assert.calledWithExactly(addNewDecisionStub, {
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

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
			where: { id: { in: [1] } },
			data: { valid: false }
		});
		sinon.assert.calledWithExactly(createAppealStatusStub, {
			data: { status: 'awaiting_validation_info', appealId: 1 }
		});
		sinon.assert.calledWithExactly(addNewDecisionStub, {
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
		const resp = await request
			.post('/appeals/validation/4')
			.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'some desc' });

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
			where: { id: { in: [4] } },
			data: { valid: false }
		});
		sinon.assert.calledWithExactly(createAppealStatusStub, {
			data: { status: 'awaiting_validation_info', appealId: 1 }
		});
		sinon.assert.calledWithExactly(addNewDecisionStub, {
			data: {
				appealId: 1,
				decision: 'valid',
				descriptionOfDevelopment: 'Some Desc'
			}
		});
	});

	test('should not be able to submit nonsensical decision decision', async () => {
		const resp = await request
			.post('/appeals/validation/1')
			.send({ AppealStatus: 'some unknown status' });

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit validation decision for appeal that has been marked 'valid'", async () => {
		const resp = await request
			.post('/appeals/validation/2')
			.send({ AppealStatus: 'invalid', Reason: { outOfTime: true } });

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				appeal: 'Appeal is in an invalid state'
			}
		});
	});

	test("should not be able to submit validation decision for appeal that has been marked 'invalid'", async () => {
		const resp = await request
			.post('/appeals/validation/3')
			.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'Some desc' });

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				appeal: 'Appeal is in an invalid state'
			}
		});
	});

	test("should not be able to submit decision as 'invalid' if there is no reason marked", async () => {
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

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'invalid' if there is no reason being sent", async () => {
		const resp = await request.post('/appeals/validation/5').send({
			AppealStatus: 'invalid',
			Reason: {}
		});

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'incomplete' if there is no reason marked", async () => {
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

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'incomplete' if providing invalid reasons", async () => {
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

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'invalid' if providing incomplete reasons", async () => {
		const resp = await request.post('/appeals/validation/6').send({
			AppealStatus: 'invalid',
			Reason: {
				someFakeReason: true
			}
		});

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit decision as 'incomplete' if there is no reason being sent", async () => {
		const resp = await request.post('/appeals/validation/5').send({
			AppealStatus: 'incomplete',
			Reason: {}
		});

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test('should not be able to submit an unknown decision string', async () => {
		const resp = await request
			.post('/appeals/validation/5')
			.send({ AppealStatus: 'blah blah blah' });

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit 'valid' decision without DescriptionOfDevelopment", async () => {
		const resp = await request.post('/appeals/validation/5').send({ AppealStatus: 'valid' });

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});

	test("should not be able to submit 'valid' decision with empty DescriptionOfDevelopment", async () => {
		const resp = await request
			.post('/appeals/validation/5')
			.send({ AppealStatus: 'valid', DescriptionOfDevelopment: '' });

		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	});
});
