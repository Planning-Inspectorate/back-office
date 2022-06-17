import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

export const databaseConnector = new PrismaClient();

// export { databaseConnector };
