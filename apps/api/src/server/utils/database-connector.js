import { PrismaClient } from '@prisma/client';
import { prismaClientDocumentMiddleWare } from './prisma-middleware.js';

/**
 * @type {PrismaClient}
 */
let prismaClient;

/**
 * Creates a new instance of PrismaClient, if one doesn't already exist.
 * Adds `prismaClientDocumentMiddleWare` to the instance and returns it.
 *
 * @returns {PrismaClient}
 */
function createPrismaClient() {
	if (!prismaClient) {
		prismaClient = new PrismaClient();
	}

	prismaClient.$use(prismaClientDocumentMiddleWare);

	return prismaClient;
}

export const databaseConnector = createPrismaClient();
