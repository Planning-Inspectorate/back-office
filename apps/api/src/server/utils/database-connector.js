import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClientDocumentMiddleWare } from './prisma-middleware.js';

/** @type {PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>} */
let prismaClient;

/**
 *@returns {PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>}
 */
function createPrismaClient() {
	if (!prismaClient) {
		prismaClient = new PrismaClient();
	}

	prismaClient.$use(prismaClientDocumentMiddleWare);

	return prismaClient;
}

export const databaseConnector = createPrismaClient();
