import { givenOdwReturnsProjectData } from '../tools/given-odw-returns.js';
import { logger } from '../tools/utils.js';
import { migrateNsipProjectByReference } from '../../common/migrators/nsip-project-migration.js';

describe('this', () => {
	it('is true', async () => {
		givenOdwReturnsProjectData();

		// @ts-ignore
		await migrateNsipProjectByReference(logger, 'test');

		expect(true).toBe(true);
	});
});
