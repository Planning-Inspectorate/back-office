import { PrismaClient } from '@prisma/client';
import { softDeleteExtension } from '#utils/prisma-extension.js';

/** @type {PrismaClient} */
let prismaClient;

/**
 * @returns {PrismaClient}
 */
function createPrismaClient() {
	if (!prismaClient) {
		prismaClient = new PrismaClient();
	}

	return prismaClient.$extends(softDeleteExtension);
}

export const databaseConnector = createPrismaClient();
