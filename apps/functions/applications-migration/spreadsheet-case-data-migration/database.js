import { DefaultAzureCredential } from '@azure/identity';
import { Sequelize } from 'sequelize';
import * as tedious from 'tedious';
import { loadEnvironment } from '@pins/platform';

const environment = loadEnvironment(process.env.NODE_ENV);

let backOfficeDB;

/**
 * Get a Sequelize connection to the back-office database.
 * Reuses the connection if already established.
 *
 * @returns {import('sequelize').Sequelize}
 */
export const getBackOfficeDB = () => {
	if (backOfficeDB) {
		return backOfficeDB;
	}

	const host = environment.BO_DB_HOST;
	const database = environment.BO_DB_NAME;

	if (!host || !database) {
		throw new Error('BO_DB_HOST and BO_DB_NAME environment variables are required');
	}

	// Local development: use SQL auth via DATABASE_URL-style connection
	// Azure: use Azure AD token-based auth
	const useAzureAuth = environment.BO_DB_USE_AZURE_AUTH === 'true';

	if (useAzureAuth) {
		const credential = new DefaultAzureCredential();

		backOfficeDB = new Sequelize({
			host,
			port: 1433,
			database,
			dialect: 'mssql',
			dialectModule: tedious,
			dialectOptions: {
				authentication: {
					type: 'azure-active-directory-access-token',
					options: {
						token: ''
					}
				},
				encrypt: true
			}
		});

		// Refresh Azure AD token before each connection
		// @ts-ignore
		backOfficeDB.beforeConnect(async (config) => {
			const { token } = await credential.getToken('https://database.windows.net/.default');
			config.dialectOptions.authentication.options.token = token;
		});
	} else {
		const username = environment.BO_DB_USERNAME;
		const password = environment.BO_DB_PASSWORD;

		backOfficeDB = new Sequelize({
			host,
			port: Number(environment.BO_DB_PORT || 1433),
			database,
			username,
			password,
			dialect: 'mssql',
			dialectModule: tedious,
			dialectOptions: {
				encrypt: true,
				trustServerCertificate: true
			}
		});
	}

	return backOfficeDB;
};

/**
 * Close the back-office database connection
 *
 * @returns {Promise<void>}
 */
export const closeBackOfficeDB = async () => {
	if (backOfficeDB) {
		await backOfficeDB.close();
		backOfficeDB = null;
	}
};
