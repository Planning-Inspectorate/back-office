import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Schema.AppealType} AppealType */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @returns {PrismaPromise<AppealType[]>}
 */
export const getAllAppealTypes = () => {
	return databaseConnector.appealType.findMany();
};

/**
 * @param { number } typeId
 * @returns {PrismaPromise<AppealType|null>}
 */
export const getAppealTypeByTypeId = (typeId) => {
	return databaseConnector.appealType.findFirst({
		where: { id: typeId }
	});
};
