import { QueryTypes } from 'sequelize';
import { getSequelizeInstance } from './sequelize-instance.js';

const validTableNames = ['Case'];
/**
 * @param {string} tableToQuery
 * @param {string} caseReference
 */
export const getFromBackofficeDb = async (tableToQuery, caseReference) => {
	if (!validTableNames.includes(tableToQuery)) {
		throw Error('Table with that name does not exist');
	}

	const cbosDb = getSequelizeInstance();
	// TODO: make this more reusable (sort use of 'reference' in the query)
	const result = await cbosDb.query(
		`
		SELECT *
		FROM [pins_development].[dbo].[${tableToQuery}]
		WHERE reference = ?
		`,
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);
	return result;
};
