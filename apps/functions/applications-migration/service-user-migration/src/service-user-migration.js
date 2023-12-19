import { SynapseDB } from '../../common/synapse-db.js';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 */
export const migrateServiceUsers = async (log) => {
	log.info('Migrating 100 Service Users');

	const serviceUsers = await SynapseDB.query(
		'SELECT TOP (100) * FROM [odw_curated_db].[dbo].[service_user]'
	);

	log.info(serviceUsers);
};
