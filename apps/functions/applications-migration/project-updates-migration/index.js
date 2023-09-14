import { ProjectUpdatesMigration } from './src/project-updates-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, req) {
	console.info(JSON.stringify(req));

	const handler = new ProjectUpdatesMigration();
	await handler.handleRequest(context, req);
}
