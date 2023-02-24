import { Prisma, PrismaClient } from '@prisma/client';
import { modifyPrismaDocumentQueryMiddleware } from './prisma-middleware.js';

/** @type {PrismaClient} */
let prismaClient;

/**
 *@returns {PrismaClient}
 */
function createPrismaClient() {
	if (!prismaClient) {
		prismaClient = new PrismaClient();
	}

	prismaClient.$use(modifyPrismaDocumentQueryMiddleware);

	return prismaClient;
}

export const databaseConnector = createPrismaClient();
