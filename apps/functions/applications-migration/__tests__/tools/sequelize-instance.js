import { Sequelize } from 'sequelize';

/**
 * @type {Sequelize | null}
 */
let sequelizeInstance = null;

export const getSequelizeInstance = () => {
	if (!sequelizeInstance) {
		const { host, port, username, password } = parseDbString();

		// @ts-ignore
		sequelizeInstance = new Sequelize({
			host,
			port,
			username: username,
			password: password,
			dialect: 'mssql'
		});
	}

	return sequelizeInstance;
};

const parseDbString = () => {
	const dbString = process.env.DATABASE_URL;
	if (!dbString) throw Error('No db string found in env');

	const dbStringSections = dbString.split(';');
	const hostMatch = dbStringSections[0].match(/(?<=:\/\/)[^:]+/);
	const host = hostMatch ? hostMatch[0] : null;

	const portMatch = dbStringSections[0].match(/(?<=:)\d+/);
	const port = portMatch ? portMatch[0] : null;

	const databaseMatch = dbStringSections[1].match(/(?<==).+/);
	const database = databaseMatch ? databaseMatch[0] : null;

	const usernameMatch = dbStringSections[2].match(/(?<==).+/);
	const username = usernameMatch ? usernameMatch[0] : null;

	const passwordMatch = dbStringSections[3].match(/(?<==).+/);
	const password = passwordMatch ? passwordMatch[0] : null;

	return {
		host,
		port,
		database,
		username,
		password
	};
};
