import { migrateServiceUsers } from './src/service-user-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 */
export default async function (context) {
	await migrateServiceUsers(context.log);
}
