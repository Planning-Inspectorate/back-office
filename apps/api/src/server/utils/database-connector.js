import { PrismaClient } from '@prisma/client';

/** @type {PrismaClient} */
let prismaClient;

/**
 * @returns {PrismaClient}
 */
function createPrismaClient() {
	if (!prismaClient) {
		prismaClient = new PrismaClient();
	}

	return prismaClient;
}

export const databaseConnector = createPrismaClient();
