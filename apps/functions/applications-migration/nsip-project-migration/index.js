import { migrateNsipProjects } from '../common/migrators/nsip-project-migration.js';
import { migrationFunctionWrapper } from '../common/migration-function-wrapper.js';
/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	await migrationFunctionWrapper(
		context,
		caseReferences,
		() => migrateNsipProjects(context.log, caseReferences),
		'project'
	);
}
