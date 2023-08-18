import { Sequelize } from 'sequelize';
import config from './config.js';
/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, employee) => {
	context.log('Received employee update', employee?.EmployeeId);

	const client = new Sequelize(config.database, config.username, config.password, {
		host: config.host,
		port: 3306,
		dialect: 'mysql',
		logging: true
	});

	await client.authenticate();

	context.log('Authenticated!', client);
};
