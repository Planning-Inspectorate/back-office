import { DefaultAzureCredential } from '@azure/identity';
import { Sequelize } from 'sequelize';
import * as tedious from 'tedious';
import { loadConfig } from './config.js';

const config = loadConfig();

const credential = new DefaultAzureCredential();

// Get token for Azure SQL Database
const { token } = await credential.getToken('https://database.windows.net/.default');

export const SynapseDB = new Sequelize({
	...config.synapseDatabase,
	port: 1433,
	database: 'odw_curated_db',
	// @ts-ignore
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
