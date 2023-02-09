const { databaseConnector } = await import('../../utils/database-connector.js');

import validationDecisionRepository from '../validation-decision.repository.js';

const newDecision = {
	appealId: 1,
	decision: 'incomplete',
	descriptionOfDevelopment: undefined,
	namesDoNotMatch: true
};

describe('Validation decision repository', () => {
	test('adds new Validation decision', async () => {
		// GIVEN
		databaseConnector.validationDecision.create.mockResolvedValue(newDecision);

		// WHEN
		const decision = await validationDecisionRepository.addNewDecision(1, 'incomplete', {
			namesDoNotMatch: true
		});

		// THEN
		expect(decision).toEqual(newDecision);
		expect(databaseConnector.validationDecision.create).toHaveBeenCalledWith({
			data: {
				appealId: 1,
				decision: 'incomplete',
				descriptionOfDevelopment: undefined,
				namesDoNotMatch: true
			}
		});
	});
});
