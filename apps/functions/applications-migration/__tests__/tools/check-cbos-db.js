import { QueryTypes } from 'sequelize';
import { getSequelizeInstance } from './sequelize-instance.js';

/**
 * @param {string} tableToQuery
 * @param {string} whereClause
 */
export const getFromCbosDb = async (tableToQuery, whereClause) => {
	const cbosDb = getSequelizeInstance();
	try {
		const result = await cbosDb.query(
			`
		SELECT *
		FROM [pins_development].[dbo].[${tableToQuery}]
		WHERE ${whereClause}
		`,
			{
				type: QueryTypes.SELECT
			}
		);
		return result;
	} catch (/** @type {any} */ error) {
		console.dir(error, { depth: null });
		throw Error(error);
	}
};
