import { databaseConnector } from '#utils/database-connector.js';
import createManyToManyRelationData from '#utils/create-many-to-many-relation-data.js';
import { DATABASE_ORDER_BY_ASC } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.LookupTables} LookupTables */
/** @typedef {import('@pins/appeals.api').Appeals.IncompleteInvalidReasons} IncompleteInvalidReasons */
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
 *  data: (number | string)[],
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

/**
 *
 * @param {{
 *  id: number;
 *  relationOne: string;
 *  relationTwo: string;
 *  manyToManyRelationTable: string;
 *  incompleteInvalidReasonTextTable: string;
 *  data: IncompleteInvalidReasons;
 * }} param0
 * @returns
 */
const createIncompleteInvalidReasons = ({
	id,
	relationOne,
	relationTwo,
	manyToManyRelationTable,
	incompleteInvalidReasonTextTable,
	data
}) => [
	// @ts-ignore
	databaseConnector[incompleteInvalidReasonTextTable].deleteMany({
		where: { [relationOne]: id }
	}),
	...updateManyToManyRelationTable({
		id,
		data: data.map(({ id: reasonId }) => reasonId),
		databaseTable: manyToManyRelationTable,
		relationOne: relationOne,
		relationTwo: relationTwo
	}),
	// @ts-ignore
	databaseConnector[incompleteInvalidReasonTextTable].createMany({
		data: data
			.map(
				({ id: reasonId, text }) =>
					text &&
					text.map((text) => ({
						[relationOne]: id,
						[relationTwo]: reasonId,
						text
					}))
			)
			.flat()
	})
];

export default {
	createIncompleteInvalidReasons,
	getLookupList,
	getLookupListValueByName,
	updateManyToManyRelationTable
};
