import { ProjectUpdatesMigration } from './src/project-updates-migration.js';
import { PrismaClient } from '#db-client';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, req) {
	const dbClient = new PrismaClient();
	const handler = new ProjectUpdatesMigration({ dbClient });
	await handler.handleRequest(context, req);
}
