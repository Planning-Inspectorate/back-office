import { PrismaClient } from '@prisma/client';
import { modifyPrismaDocumentQueryMiddleware } from './prisma-middleware.js';

/** @type {PrismaClient} */
let prismaClient;

/**
 *@returns {PrismaClient} */
// @ts-ignore
function createPrismaClient() {
	// @ts-ignore
	if (!prismaClient) {
		prismaClient = new PrismaClient();
	}


	prismaClient.$use(modifyPrismaDocumentQueryMiddleware);

	return prismaClient;
}

export const databaseConnector = createPrismaClient();
