const { databaseConnector } = await import('../../utils/database-connector.js');

import * as representationRepository from '../representation.repository.js';

const existingRepresentations = [{ id: 1 }, { id: 2 }];

describe('Representation repository', () => {
	it('finds representations by case id', async () => {
		databaseConnector.representation.count.mockResolvedValue(2);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);

		const { count, items } = await representationRepository.getByCaseId(1, {
			page: 1,
			pageSize: 25
		});

		expect(count).toEqual(2);
		expect(items).toEqual(existingRepresentations);
	});
});
