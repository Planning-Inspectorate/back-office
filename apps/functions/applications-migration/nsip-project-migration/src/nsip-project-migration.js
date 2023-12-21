import { loadSchemaValidator, summariseErrors } from '../../common/validation.js';
import { SynapseDB } from '../../common/synapse-db.js';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 */
export const migrationNsipProjects = async (log) => {
	log.info('loading nsip-project validator');
	const validator = await loadSchemaValidator('nsip-project');

	log.info('reading 100 NSIP Projects');

	const nsipProjects = await SynapseDB.query(
		'SELECT TOP (100) * FROM [odw_curated_db].[dbo].[nsip_data]'
	);

	log.info(nsipProjects);
	let validCount = 0;
	for (let i = 0; i < nsipProjects.length; i++) {
		const nsipProject = nsipProjects[i];
		const isValid = validator(nsipProject);
		if (isValid) {
			validCount++;
			continue;
		}
		log.info(`invalid message (index ${i}): ${summariseErrors(validator.errors)}`);
	}
	log.info(`${nsipProjects.length} messages, ${validCount} valid`);
};
