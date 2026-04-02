import { PrismaClient } from '#database-client';
import { softDeleteExtension } from '#utils/prisma-extension.js';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { loadEnvironment } from '@pins/platform';

/** @type {PrismaClient} */
let prismaClient;

/**
 * @returns {PrismaClient}
 */
function createPrismaClient() {
	if (!prismaClient) {
		// For tests, especially those using dynamic imports, use direct env var
		// For production, load environment properly
		let databaseUrl = process.env.DATABASE_URL;

		// Only attempt loadEnvironment if not in test mode or if DATABASE_URL is not set
		if (process.env.NODE_ENV !== 'test' && !databaseUrl) {
			try {
				const environment = loadEnvironment(process.env.NODE_ENV);
				databaseUrl = environment.DATABASE_URL;
			} catch (error) {
				console.warn('Failed to load environment, using process.env.DATABASE_URL');
			}
		}

		prismaClient = new PrismaClient({
			adapter: new PrismaMssql(databaseUrl)
		});
	}

	return prismaClient.$extends(softDeleteExtension);
}

export const databaseConnector = createPrismaClient();
