import sinon from 'sinon';
import { databaseConnector } from '../../utils/database-connector.js';
import validationDecisionRepository from '../validation-decision.repository.js';

const addNewDecision = sinon.stub();

const newDecision = {
	appealId: 1,
	decision: 'incomplete',
	descriptionOfDevelopment: undefined,
	namesDoNotMatch: true
};

addNewDecision.returns(newDecision);

describe('Validation decision repository', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'validationDecision').get(() => {
			return { create: addNewDecision };
		});
	});

	test('adds new Validation decision', async () => {
		const decision = await validationDecisionRepository.addNewDecision(1, 'incomplete', {
			namesDoNotMatch: true
		});

		expect(decision).toEqual(newDecision);
		sinon.assert.calledWith(addNewDecision, {
			data: {
				appealId: 1,
				decision: 'incomplete',
				descriptionOfDevelopment: undefined,
				namesDoNotMatch: true
			}
		});
	});
});
