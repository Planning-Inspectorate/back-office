import { databaseConnector } from '#utils/database-connector.js';
import createManyToManyRelationData from '#utils/create-many-to-many-relation-data.js';
import { DATABASE_ORDER_BY_ASC } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.LookupTables} LookupTables */
/** @typedef {import('@pins/appeals.api').Appeals.NotValidReasons} NotValidReasons */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {string} databaseTable
 * @returns {Promise<LookupTables[]>}
 */
const getLookupList = (databaseTable) =>
	// @ts-ignore
	databaseConnector[databaseTable].findMany({
		orderBy: {
			id: DATABASE_ORDER_BY_ASC
		}
	});

/**
 * @param {string} databaseTable
 * @param {string} value
 * @returns {Promise<LookupTables | null>}
 */
const getLookupListValueByName = (databaseTable, value) =>
	// @ts-ignore
	databaseConnector[databaseTable].findUnique({
		where: {
			name: value
		}
	});

/**
 * @param {{
 *  id: number,
 *  data: NotValidReasons,
 *  databaseTable: string,
 *  relationOne: string,
 *  relationTwo: string,
 * }} param0
 * @returns {LookupTables[]}
 */
const updateManyToManyRelationTable = ({ id, data, databaseTable, relationOne, relationTwo }) => [
	// @ts-ignore
	databaseConnector[databaseTable].deleteMany({
		where: { [relationOne]: id }
	}),
	// @ts-ignore
	databaseConnector[databaseTable].createMany({
		data: createManyToManyRelationData({ data, relationOne, relationTwo, relationOneId: id })
	})
];

export default {
	getLookupList,
	getLookupListValueByName,
	updateManyToManyRelationTable
};
