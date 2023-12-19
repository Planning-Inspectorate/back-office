import { migrateServiceUsers } from './src/nsip-project-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 */
export default async function (context) {
	await migrateServiceUsers(context.log);
}
