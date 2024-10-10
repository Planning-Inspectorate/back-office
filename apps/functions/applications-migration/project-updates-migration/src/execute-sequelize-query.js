import { loadWordpressConfig } from '../../common/config.js';
import { QueryTypes, Sequelize } from 'sequelize';

/**
 *
 * @param {string} query
 * @param {string[]} replacements
 */
export const executeSequelizeQuery = async (query, replacements) => {
	const config = loadWordpressConfig();
	const { username, password, database, host, port, dialect } = config.wordpressDatabase;
	const sequelize = new Sequelize(database, username, password, {
		host,
		port: Number(port),
		// @ts-ignore
		dialect
	});
	return await sequelize.query(query, {
		replacements,
		type: QueryTypes.SELECT
	});
};
