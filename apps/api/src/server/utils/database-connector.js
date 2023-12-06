import { PrismaClient } from '@prisma/client';
import { modifyPrismaDocumentQueryMiddleware } from './prisma-middleware.js';
import { initialisePrismaInstrumentation } from './prisma-instrumentation.js';

/** @type {PrismaClient} */
let prismaClient;

/**
 * @returns {PrismaClient}
 */
function createPrismaClient() {
	if (!prismaClient) {
		prismaClient = new PrismaClient();
	}

	initialisePrismaInstrumentation();
	prismaClient.$use(modifyPrismaDocumentQueryMiddleware);

	return prismaClient;
}

export const databaseConnector = createPrismaClient();
