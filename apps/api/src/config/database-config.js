import { loadEnvironment } from 'planning-inspectorate-libs';

loadEnvironment(process.env.NODE_ENV);

export default {
	development: {
		username: process.env.SQL_SERVER_USERNAME,
		password: process.env.SQL_SERVER_PASSWORD,
		database: process.env.SQL_SERVER_DATABASE,
		host: process.env.SQL_SERVER_HOST,
		port: process.env.SQL_SERVER_PORT,
		dialect: 'mssql',
		dialectOptions: {
			bigNumberStrings: true
		}
	},
	test: {
		username: process.env.SQL_SERVER_USERNAME,
		password: process.env.SQL_SERVER_PASSWORD,
		database: process.env.SQL_SERVER_DATABASE,
		host: process.env.SQL_SERVER_HOST,
		port: process.env.SQL_SERVER_PORT,
		dialect: 'mssql',
		dialectOptions: {
			bigNumberStrings: true
		}
	},
	production: {
		username: process.env.SQL_SERVER_USERNAME,
		password: process.env.SQL_SERVER_PASSWORD,
		database: process.env.SQL_SERVER_DATABASE,
		host: process.env.SQL_SERVER_HOST,
		port: process.env.SQL_SERVER_PORT,
		dialect: 'mssql',
		dialectOptions: {
			bigNumberStrings: true,
			// TODO: Once we have a staging env, we will need this
			// ssl: {
			//   ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
			// }
		}
	}
};
