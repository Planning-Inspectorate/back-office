import { givenOdwReturnsProjectData } from '../tools/given-odw-returns.js';
import { logger } from '../tools/utils.js';
import { migrateNsipProjectByReference } from '../../common/migrators/nsip-project-migration.js';
import { TEST_CONSTANTS_GENERIC } from '../tools/test-constants.js';

describe('this', () => {
	it('is true', async () => {
		givenOdwReturnsProjectData();

		// @ts-ignore
		await migrateNsipProjectByReference(logger, TEST_CONSTANTS_GENERIC.caseReference);

		expect(true).toBe(true);
	});
});
