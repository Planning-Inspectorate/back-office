import {
	migrateGeneralS51Advice,
	migrateSelectGeneralS51Advice
} from '../common/migrators/general-s51-advice-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (
	context,
	{ body: { migrationType, adviceIdList = [], offset = 0 } }
) {
	if (migrationType === 'select' && adviceIdList.length > 0) {
		context.log('Migrating select General S51 Advice: ', adviceIdList);
		await migrateSelectGeneralS51Advice(context.log, adviceIdList);
	} else if (migrationType === 'all') {
		context.log('Migrating all General S51 Advice: ');
		await migrateGeneralS51Advice(context.log, offset);
	} else {
		throw Error('Request body did not contain expected parameters');
	}
}
