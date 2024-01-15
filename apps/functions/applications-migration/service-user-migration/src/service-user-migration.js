import { SynapseDB } from '../../common/synapse-db.js';
import { loadSchemaValidator, summariseErrors } from '../../common/validation.js';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 */
export const migrateServiceUsers = async (log) => {
	log.info('loading service-user validator');
	const validator = await loadSchemaValidator('service-user');

	log.info('reading 100 Service Users');
	const serviceUsers = await SynapseDB.query(
		'SELECT TOP (100) * FROM [odw_curated_db].[dbo].[service_user]'
	);

	log.info(serviceUsers);
	let validCount = 0;
	for (let i = 0; i < serviceUsers.length; i++) {
		const serviceUser = serviceUsers[i];
		const isValid = validator(serviceUser);
		if (isValid) {
			validCount++;
			continue;
		}
		log.info(`invalid message (index ${i}): ${summariseErrors(validator.errors)}`);
	}
	log.info(`${serviceUsers.length} messages, ${validCount} valid`);
};
