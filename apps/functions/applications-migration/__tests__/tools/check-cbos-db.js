import { QueryTypes } from 'sequelize';
import { getSequelizeInstance } from './sequelize-instance.js';

const validTableNames = ['Case'];
/**
 * @param {string} tableToQuery
 * @param {string} whereClause
 */
export const getFromCbosDb = async (tableToQuery, whereClause) => {
	if (!validTableNames.includes(tableToQuery)) {
		throw Error('Table with that name does not exist');
	}

	const cbosDb = getSequelizeInstance();
	// TODO: make this more reusable (sort use of 'reference' in the query)
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
};
