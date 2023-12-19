import { SynapseDB } from '../../common/synapse-db.js';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 */
export const migrationNsipProjects = async (log) => {
	log.info('Migrating 100 NSIP Projects');

	const nsipProjects = await SynapseDB.query(
		'SELECT TOP (100) * FROM [odw_curated_db].[dbo].[nsip_data]'
	);

	log.info(nsipProjects);
};
