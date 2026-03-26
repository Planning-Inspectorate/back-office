import { PrismaClient } from '../../database/client/client.js';
import { PrismaMssql } from '@prisma/adapter-mssql';

/** @type {PrismaClient} */
let prismaClient;

/**
 * @returns {PrismaClient}
 */
function createPrismaClient() {
	if (!prismaClient) {
		const client = new PrismaClient({
			adapter: new PrismaMssql(process.env.DATABASE_URL)
		});

		prismaClient = client;
	}

	return prismaClient;
}

/** Lazy proxy - creates the real PrismaClient on first property access */
export const databaseConnector = new Proxy(/** @type {PrismaClient} */ ({}), {
	get(_target, prop) {
		const client = /** @type {any} */ (createPrismaClient());
		return client[prop];
	}
});
