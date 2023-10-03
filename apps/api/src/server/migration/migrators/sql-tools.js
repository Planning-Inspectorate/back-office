/**
 * Creates an upsert statement for a JS object, assuming the object properties map to column names.
 *
 * The reason we're manually constructing SQL (rather than using the ORM) is down to our strategy for migrating IDs, which you can read about here:
 * https://pins-ds.atlassian.net/wiki/spaces/BOAS/pages/1281818638/2023-09-25+Migrating+IDs+from+Horizon
 *
 * To migrate IDs in this way, we need to be able to use SET_IDENTITY_INSERT. Unfortunately, there's an outstanding bug with Prisma which doesn't allow us to do this:
 * https://github.com/prisma/prisma/issues/15305
 *
 * This was seen as the most sensible approach.
 *
 * @param {string} tableName
 * @param {object} entity
 * @param {string} keyColumn
 */
export const buildUpsertForEntity = (tableName, entity, keyColumn) => {
	const columns = Object.keys(entity)
		.map((col) => `[${col}]`)
		.join(', ');

	// For null or undefined values, the parameters are ignored by Prisma
	// In this scenario we can't ignore the update because we might legitimately be upserting to a NULL value
	let paramNo = 1;
	const parameterNames = Object.values(entity)
		.map((value) => (isNullOrUndefined(value) ? 'NULL' : `@P${paramNo++}`))
		.join(', ');
	const parameters = Object.values(entity).filter((value) => !isNullOrUndefined(value));

	const updateColumns = Object.keys(entity)
		.filter((col) => col != keyColumn)
		.map((col) => `Target.[${col}] = Source.[${col}]`)
		.join(', ');

	// For some reason, using SET_IDENTITY_INSERT in transactions altogether doesn't work - so we need to use them in a single statement and wrap that in a transaction
	const statement = `SET IDENTITY_INSERT ${tableName} ON;

        MERGE INTO [${tableName}] AS Target
        USING (VALUES (${parameterNames})) AS Source (${columns})
        ON Target.[${keyColumn}] = Source.[${keyColumn}]
        WHEN MATCHED THEN
            UPDATE SET ${updateColumns}
        WHEN NOT MATCHED THEN
            INSERT (${columns})
            VALUES (${parameterNames});

		SET IDENTITY_INSERT ${tableName} OFF
		;
    `;

	return { statement, parameters };
};

/**
 * @param {any} value
 *
 * @return {boolean} isNullOrUndefined
 */
const isNullOrUndefined = (value) => value === null || value === undefined;
