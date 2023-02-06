import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClientDocumentMiddleWare } from './prisma-middleware.js';

/** @type {PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>} */
let prisma;

/**
 *@returns {PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>}
 */
function createPrismaClient() {
	if (!prisma) {
		prisma = new PrismaClient();
	}

	prisma.$use(prismaClientDocumentMiddleWare);

	return prisma;
}

export const databaseConnector = createPrismaClient();
