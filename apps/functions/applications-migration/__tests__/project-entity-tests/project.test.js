// @ts-nocheck
import { givenOdwReturnsProjectData } from '../tools/given-odw-returns.js';
import { logger } from '../tools/utils.js';
import { migrateNsipProjectByReference } from '../../common/migrators/nsip-project-migration.js';
import { TEST_CONSTANTS_GENERIC } from '../tools/test-constants.js';
import { getFromCbosDb } from '../tools/check-cbos-db.js';
import {
	expectedCbosApplicationDetailsTableData,
	expectedCbosCaseTableData
} from '../tools/expect-cbos-returns.js';
import { clearNonStaticDataTables } from '../tear-down/clear-tables.js';
import { TableNames } from '../tools/table-names.js';

describe('project entity', () => {
	it('is seen in the CBOS DB after successful migration', async () => {
		const caseId = givenOdwReturnsProjectData();

		await migrateNsipProjectByReference(logger, TEST_CONSTANTS_GENERIC.caseReference);

		const cbosCaseTableEntry = await getFromCbosDb(TableNames.CASE, `id = ${caseId}`);
		const cbosApplicationDetailsTableEntry = await getFromCbosDb(
			TableNames.APPLICATION_DETAILS,
			`caseId = ${caseId}`
		);
		const cbosRegionsTableEntry = await getFromCbosDb(
			TableNames.REGIONS_ON_APPLICATION_DETAILS,
			`applicationDetailsId = ${cbosApplicationDetailsTableEntry[0].id}`
		);
		const cbosCaseStatusEntry = await getFromCbosDb(TableNames.CASE_STATUS, `caseId = ${caseId}`);
		const cbosCasePublishedStateEntry = await getFromCbosDb(
			TableNames.CASE_PUBLISHED_STATE,
			`caseId = ${caseId}`
		);
		const cbosGridReferenceEntry = await getFromCbosDb(
			TableNames.GRID_REFERENCE,
			`caseId = ${caseId}`
		);
		console.log({
			cbosApplicationDetailsTableEntry,
			cbosRegionsTableEntry,
			cbosCaseStatusEntry,
			cbosCasePublishedStateEntry,
			cbosGridReferenceEntry
		});
		expect(cbosCaseTableEntry).toMatchObject([expectedCbosCaseTableData({ add: { id: caseId } })]);
		expect(cbosApplicationDetailsTableEntry).toMatchObject([
			expectedCbosApplicationDetailsTableData({ add: { caseId } })
		]);
	});

	afterAll(async () => {
		await clearNonStaticDataTables();
	});
});
