import { databaseConnector } from './src/server/utils/database-connector.js';

beforeEach(() => {
	databaseConnector.$disconnect();
});
