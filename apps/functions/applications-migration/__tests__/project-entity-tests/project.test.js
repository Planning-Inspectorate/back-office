import { givenOdwReturnsProjectData } from '../tools/given-odw-returns.js';
import { logger } from '../tools/utils.js';
import { migrateNsipProjectByReference } from '../../common/migrators/nsip-project-migration.js';
import { TEST_CONSTANTS_GENERIC } from '../tools/test-constants.js';
import { getFromBackofficeDb } from '../tools/check-cbos-db.js';
import { expectedCbosProjectData } from '../tools/expect-cbos-returns.js';

describe('project entity', () => {
	it('is seen in the BackOffice DB after successful migration', async () => {
		givenOdwReturnsProjectData();

		// @ts-ignore
		await migrateNsipProjectByReference(logger, TEST_CONSTANTS_GENERIC.caseReference);
		const backofficeDbEntry = await getFromBackofficeDb(
			'Case',
			TEST_CONSTANTS_GENERIC.caseReference
		);

		expect(backofficeDbEntry).toMatchObject(expectedCbosProjectData());
	});
});
