import { DefaultAzureCredential } from '@azure/identity';
import { Sequelize } from 'sequelize';
import * as tedious from 'tedious';
import { loadConfig } from './config.js';

const config = loadConfig();

const credential = new DefaultAzureCredential();

// We need to keep a copy of it in this scope because we only store the token string on the authentication options
// Could do with a double-checked lock for race conditions but we won't be running this concurrently
let { token, expiresOnTimestamp } = await credential.getToken(
	'https://database.windows.net/.default'
);

export const SynapseDB = new Sequelize({
	...config.synapseDatabase,
	port: 1433,
	database: 'odw_curated_db',
	dialect: 'mssql',
	dialectModule: tedious,
	dialectOptions: {
		authentication: {
			type: 'azure-active-directory-access-token',
			options: {
				token: token
			}
		},
		encrypt: true
	}
});

// @ts-ignore
SynapseDB.beforeConnect(async (config) => {
	if (expiresOnTimestamp < Date.now()) {
		({ token, expiresOnTimestamp } = await credential.getToken(
			'https://database.windows.net/.default'
		));

		config.dialectOptions.authentication.options.token = token;
	}
});
