import { validateMigration } from '../common/validate-migration.js';

/**
 * @param {import("@azure/functions").Context} context
 * @param {import("@azure/functions").HttpRequest} req
 */
export default async (context, { body: { caseReferences } }) => {
	context.log(`Starting migration validation for ${JSON.stringify(caseReferences)}`);
	try {
		const diff = await validateMigration(context.log, caseReferences);
		context.log(`Migration validation completed with diff: ${JSON.stringify(diff)}`);
		context.res = {
			status: 200,
			body: diff
		};
	} catch (error) {
		context.res = {
			status: 500,
			body: {
				message: `Failed to run validation for migration with error: ${error.message}`
			}
		};
	}
};
