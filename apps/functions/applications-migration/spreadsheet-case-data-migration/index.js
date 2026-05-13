import { app } from '@azure/functions';
import XlsxPopulate from 'xlsx-populate';

import { getBackOfficeDB, closeBackOfficeDB } from './database.js';

app.http('spreadsheet-case-data-migration', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		context.log('Received spreadsheet migration request');

		try {
			const buffer = Buffer.from(await request.arrayBuffer());

			if (buffer.length === 0) {
				context.error('No file data received in request body');
				return {
					status: 400,
					jsonBody: { error: 'Request body must contain the Excel spreadsheet file' }
				};
			}

			context.log(`Received ${buffer.length} bytes, parsing spreadsheet`);
			const { tableName, headers, rows } = await parseSpreadsheet(buffer);
			context.log(
				`Table: "${tableName}", Columns: [${headers.join(', ')}], Data rows: ${rows.length}`
			);

			const db = getBackOfficeDB();
			const tableValidation = await validateTable(db, tableName);

			if (!tableValidation.valid) {
				context.error(tableValidation.error);
				return {
					status: 400,
					jsonBody: { error: tableValidation.error }
				};
			}

			const columnValidation = await validateColumns(db, tableName, headers);

			if (!columnValidation.valid) {
				context.error(columnValidation.error);
				return {
					status: 400,
					jsonBody: { error: columnValidation.error }
				};
			}

			const dateColumns = columnValidation.dateColumns || [];
			const results = await processRows(context, db, tableName, headers, rows, dateColumns);

			context.log(
				`Migration complete. Success: ${results.success}, Skipped: ${results.skipped}, Failed: ${results.failed}`
			);

			await closeBackOfficeDB();

			return {
				status: 200,
				jsonBody: {
					message: 'Migration complete',
					tableName,
					totalRows: rows.length,
					success: results.success,
					skipped: results.skipped,
					failed: results.failed,
					failedRows: results.failedRows
				}
			};
		} catch (error) {
			context.error('Migration failed', error);
			await closeBackOfficeDB();
			return {
				status: 500,
				jsonBody: { error: `Migration failed: ${error.message}` }
			};
		}
	}
});

/**
 * @param {Buffer} buffer
 * @returns {Promise<{ tableName: string, headers: string[], rows: Record<string, any>[] }>}
 */
const parseSpreadsheet = async (buffer) => {
	const workbook = await XlsxPopulate.fromDataAsync(buffer);
	const sheet = workbook.sheet(0);

	const tableName = sheet.cell('A1').value()?.toString()?.trim();

	if (!tableName) {
		throw new Error('Cell A1 must contain the target table name');
	}

	const headers = [];
	const usedRange = sheet.usedRange();
	const maxCol = usedRange ? usedRange.endCell().columnNumber() : 1;
	for (let col = 1; col <= maxCol; col++) {
		const value = sheet.cell(2, col).value();
		if (value === undefined || value === null) break;
		headers.push(value.toString().trim());
	}

	if (headers.length === 0) {
		throw new Error(
			'Spreadsheet must contain at least a header row (row 2) and one data row (row 3+)'
		);
	}

	if (!headers.includes('caseReference')) {
		throw new Error('Spreadsheet headers must include a "caseReference" column');
	}

	const rows = [];
	const maxRow = usedRange ? usedRange.endCell().rowNumber() : 2;
	for (let rowNum = 3; rowNum <= maxRow; rowNum++) {
		const firstCell = sheet.cell(rowNum, 1).value();
		if (firstCell === undefined || firstCell === null) {
			const hasData = headers.some((_, i) => {
				const val = sheet.cell(rowNum, i + 1).value();
				return val !== undefined && val !== null;
			});
			if (!hasData) break;
		}

		const row = {};
		for (let i = 0; i < headers.length; i++) {
			const val = sheet.cell(rowNum, i + 1).value();
			row[headers[i]] = val !== undefined ? val : null;
		}
		rows.push(row);
	}

	if (rows.length === 0) {
		throw new Error(
			'Spreadsheet must contain at least a header row (row 2) and one data row (row 3+)'
		);
	}

	const filteredHeaders = headers.filter((h) => h !== 'projectName');

	return { tableName, headers: filteredHeaders, rows };
};

/**
 * @param {import('sequelize').Sequelize} db
 * @param {string} tableName
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
const validateTable = async (db, tableName) => {
	const [results] = await db.query(
		`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = :tableName`,
		{ replacements: { tableName } }
	);

	if (results.length === 0) {
		return {
			valid: false,
			error: `Table "${tableName}" does not exist in the database`
		};
	}

	return { valid: true };
};

/**
 * @param {import('sequelize').Sequelize} db
 * @param {string} tableName
 * @param {string[]} headers
 * @returns {Promise<{valid: boolean, error?: string, dateColumns?: string[]}>}
 */
const validateColumns = async (db, tableName, headers) => {
	const [results] = await db.query(
		`SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = :tableName`,
		{ replacements: { tableName } }
	);

	const validColumns = results.map((/** @type {any} */ r) => r.COLUMN_NAME);
	const dateColumns = results
		.filter((/** @type {any} */ r) =>
			['datetime', 'datetime2', 'date', 'datetimeoffset'].includes(r.DATA_TYPE)
		)
		.map((/** @type {any} */ r) => r.COLUMN_NAME);

	const columnsToWrite = headers.filter((h) => h !== 'caseReference');
	const invalidColumns = columnsToWrite.filter((h) => !validColumns.includes(h));

	if (invalidColumns.length > 0) {
		return {
			valid: false,
			error: `The following columns do not exist on table "${tableName}": ${invalidColumns.join(
				', '
			)}. Valid columns are: ${validColumns.join(', ')}`
		};
	}

	return { valid: true, dateColumns };
};

/**
 * @param {any} value
 * @returns {string}
 */
const parseDateValue = (value) => {
	if (typeof value === 'number') {
		const epoch = new Date(Date.UTC(1899, 11, 30));
		const date = new Date(epoch.getTime() + value * 86400000);
		return date.toISOString();
	}

	const str = value.toString().trim();

	const ddmmyyyy = str.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
	if (ddmmyyyy) {
		const [, day, month, year] = ddmmyyyy;
		const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
		if (isNaN(date.getTime())) {
			throw new Error(`Invalid date: "${str}"`);
		}
		return date.toISOString();
	}

	const date = new Date(str);
	if (isNaN(date.getTime())) {
		throw new Error(`Unable to parse date: "${str}"`);
	}
	return date.toISOString();
};

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {import('sequelize').Sequelize} db
 * @param {string} tableName
 * @param {string[]} headers
 * @param {Record<string, any>[]} rows
 * @param {string[]} dateColumns
 * @returns {Promise<{success: number, skipped: number, failed: number, failedRows: Array<{row: number, caseReference: string, reason: string}>}>}
 */
const processRows = async (context, db, tableName, headers, rows, dateColumns) => {
	const results = { success: 0, skipped: 0, failed: 0, failedRows: [] };
	const columnsToWrite = headers.filter((h) => h !== 'caseReference');

	for (const [index, row] of rows.entries()) {
		const rowNumber = index + 3;
		const caseReference = row.caseReference?.toString()?.trim();

		if (!caseReference) {
			const reason = 'Missing caseReference';
			context.warn(`Row ${rowNumber}: ${reason}, skipping`);
			results.skipped++;
			results.failedRows.push({ row: rowNumber, caseReference: '', reason });
			continue;
		}

		try {
			context.log(`Row ${rowNumber}: Looking up case ${caseReference}`);
			const [caseRows] = await db.query(`SELECT id FROM [Case] WHERE reference = :caseReference`, {
				replacements: { caseReference }
			});

			if (caseRows.length === 0) {
				const reason = `Case "${caseReference}" not found in the database`;
				context.warn(`Row ${rowNumber}: ${reason}`);
				results.failed++;
				results.failedRows.push({ row: rowNumber, caseReference, reason });
				continue;
			}

			const caseId = caseRows[0].id;

			const setClauses = [];
			const replacements = { caseId };

			for (const column of columnsToWrite) {
				const value = row[column];

				if (value === null || value === undefined || value === '') {
					continue;
				}

				setClauses.push(`[${column}] = :${column}`);
				replacements[column] = dateColumns.includes(column) ? parseDateValue(value) : value;
			}

			if (setClauses.length === 0) {
				const reason = 'All cells are empty, nothing to update';
				context.warn(`Row ${rowNumber}: ${reason} for case ${caseReference}`);
				results.skipped++;
				results.failedRows.push({ row: rowNumber, caseReference, reason });
				continue;
			}

			const updateQuery = `UPDATE [${tableName}] SET ${setClauses.join(
				', '
			)} WHERE [caseId] = :caseId`;

			context.log(
				`Row ${rowNumber}: Updating ${setClauses.length} field(s) for case ${caseReference} (id: ${caseId})`
			);

			const [, metadata] = await db.query(updateQuery, { replacements });

			if (metadata === 0) {
				const reason = `No matching row found in table "${tableName}" for caseId ${caseId}`;
				context.warn(`Row ${rowNumber}: ${reason}`);
				results.failed++;
				results.failedRows.push({ row: rowNumber, caseReference, reason });
				continue;
			}

			context.log(`Row ${rowNumber}: Successfully updated case ${caseReference}`);
			results.success++;
		} catch (/** @type {any} */ error) {
			const reason = error.message || 'Unknown error';
			context.error(`Row ${rowNumber}: Failed to update case ${caseReference} — ${reason}`);
			results.failed++;
			results.failedRows.push({ row: rowNumber, caseReference, reason });
		}
	}

	return results;
};
