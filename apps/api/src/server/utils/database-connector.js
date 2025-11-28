import { PrismaClient } from '#database-client';
import { softDeleteExtension } from '#utils/prisma-extension.js';
import { PrismaMssql } from '@prisma/adapter-mssql';

/** @type {PrismaClient} */
let prismaClient;

/**
 * @returns {PrismaClient}
 */
function createPrismaClient() {
	if (!prismaClient) {
		prismaClient = new PrismaClient({
			adapter: new PrismaMssql(process.env.DATABASE_URL)
		});
	}

	return prismaClient.$extends(softDeleteExtension);
}

export const databaseConnector = createPrismaClient();
