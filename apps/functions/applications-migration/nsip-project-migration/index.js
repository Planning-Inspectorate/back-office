import { migrationNsipProjects } from './src/nsip-project-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 */
export default async function (context) {
	await migrationNsipProjects(context.log);
}
