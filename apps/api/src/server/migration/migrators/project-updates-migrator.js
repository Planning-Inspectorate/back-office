import { QueryTypes, Sequelize } from 'sequelize';
import config from '#config/config.js';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {string[]} caseReferences
 */
export const migrateProjectUpdates = async (caseReferences) => {
	const { username, password, database, host, port, dialect } = config.wordpressDatabase;

	console.info(`Connecting to server ${host}`);

	const sequelize = new Sequelize(database, username, password, {
		host,
		port,
		dialect
	});

	console.info(`Migrating ${caseReferences.length} CASES`);

	for (const caseReference of caseReferences) {
		const subscribers = await sequelize.query(
			'SELECT * FROM ipclive.wp_ipc_subscribers s inner join ipclive.wp_ipc_subscriptions sc on s.user_id = sc.user_id where verified  = 1 and s.case_reference  = ?;',
			{
				replacements: [caseReference],
				type: QueryTypes.SELECT
			}
		);

		console.log('subscribers', JSON.stringify(subscribers));

		const banners = await sequelize.query(
			"SELECT * FROM ipclive.wp_posts p inner join ipclive.wp_term_relationships r on r.object_id = p.id  inner join ipclive.wp_terms t on r.term_taxonomy_id = t.term_id   where p.post_type = 'ipc_project_update' and left(t.name,8) = ? and p.post_status = 'publish' order by post_date  desc;",
			{
				replacements: [caseReference],
				type: QueryTypes.SELECT
			}
		);

		console.log('banners', JSON.stringify(banners));
	}

	throw Error('Not implemented');
};
