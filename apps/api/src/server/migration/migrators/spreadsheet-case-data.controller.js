import XlsxPopulate from 'xlsx-populate';
import { EventType } from '@pins/event-client';
import { databaseConnector } from '#utils/database-connector.js';
import logger from '#utils/logger.js';
import { broadcastNsipProjectEvent } from '#infrastructure/event-broadcasters.js';
import { getById } from '#repositories/case.repository.js';

/**
 * POST /migration/spreadsheet-case-data
 * Accepts an Excel spreadsheet as the raw request body and applies row-level updates.
 *
 * @type {import('express').RequestHandler}
 */
export const spreadsheetCaseDataMigration = async (req, res) => {
	logger.info('Received spreadsheet migration request');

	try {
		const buffer = req.body;

		if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
			res.status(400).json({ error: 'Request body must contain the Excel spreadsheet file' });
			return;
		}

		logger.info(`Received ${buffer.length} bytes, parsing spreadsheet`);
		const { tableName, headers, rows } = await parseSpreadsheet(buffer);
		logger.info(
			`Table: "${tableName}", Columns: [${headers.join(', ')}], Data rows: ${rows.length}`
		);

		const tableValidation = await validateTable(tableName);

		if (!tableValidation.valid) {
			res.status(400).json({ error: tableValidation.error });
			return;
		}

		const columnValidation = await validateColumns(tableName, headers);

		if (!columnValidation.valid) {
			res.status(400).json({ error: columnValidation.error });
			return;
		}

		const dateColumns = columnValidation.dateColumns || [];
		const results = await processRows(tableName, headers, rows, dateColumns);

		logger.info(
			`Migration complete. Success: ${results.success}, Skipped: ${results.skipped}, Failed: ${results.failed}`
		);

		if (results.successfulCaseIds.length > 0) {
			logger.info(
				`Broadcasting ${results.successfulCaseIds.length} successfully updated case(s) to ODW`
			);
			await broadcastUpdatedCases(results.successfulCaseIds);
		}

		res.status(200).json({
			message: 'Migration complete',
			tableName,
			totalRows: rows.length,
			success: results.success,
			skipped: results.skipped,
			failed: results.failed,
			failedRows: results.failedRows
		});
	} catch (error) {
		logger.error(`Spreadsheet migration failed: ${error.message}`);
		res.status(500).json({ error: `Migration failed: ${error.message}` });
	}
};

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
 * @param {string} tableName
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
const validateTable = async (tableName) => {
	const results = await databaseConnector.$queryRawUnsafe(
		`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}'`
	);

	if (/** @type {any[]} */ (results).length === 0) {
		return {
			valid: false,
			error: `Table "${tableName}" does not exist in the database`
		};
	}

	return { valid: true };
};

/**
 * @param {string} tableName
 * @param {string[]} headers
 * @returns {Promise<{valid: boolean, error?: string, dateColumns?: string[]}>}
 */
const validateColumns = async (tableName, headers) => {
	const results = /** @type {any[]} */ (
		await databaseConnector.$queryRawUnsafe(
			`SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`
		)
	);

	const validColumns = results.map((r) => r.COLUMN_NAME);
	const dateColumns = results
		.filter((r) => ['datetime', 'datetime2', 'date', 'datetimeoffset'].includes(r.DATA_TYPE))
		.map((r) => r.COLUMN_NAME);

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
 * @param {string} tableName
 * @param {string[]} headers
 * @param {Record<string, any>[]} rows
 * @param {string[]} dateColumns
 * @returns {Promise<{success: number, skipped: number, failed: number, failedRows: Array<{row: number, caseReference: string, reason: string}>, successfulCaseIds: number[]}>}
 */
const processRows = async (tableName, headers, rows, dateColumns) => {
	const results = { success: 0, skipped: 0, failed: 0, failedRows: [], successfulCaseIds: [] };
	const columnsToWrite = headers.filter((h) => h !== 'caseReference');

	for (const [index, row] of rows.entries()) {
		const rowNumber = index + 3;
		const caseReference = row.caseReference?.toString()?.trim();

		if (!caseReference) {
			const reason = 'Missing caseReference';
			logger.warn(`Row ${rowNumber}: ${reason}, skipping`);
			results.skipped++;
			results.failedRows.push({ row: rowNumber, caseReference: '', reason });
			continue;
		}

		try {
			logger.info(`Row ${rowNumber}: Looking up case ${caseReference}`);
			const caseRows = /** @type {any[]} */ (
				await databaseConnector.$queryRawUnsafe(
					`SELECT id FROM [Case] WHERE reference = @p1`,
					caseReference
				)
			);

			if (caseRows.length === 0) {
				const reason = `Case "${caseReference}" not found in the database`;
				logger.warn(`Row ${rowNumber}: ${reason}`);
				results.failed++;
				results.failedRows.push({ row: rowNumber, caseReference, reason });
				continue;
			}

			const caseId = caseRows[0].id;

			const setClauses = [];
			const values = [];

			for (const column of columnsToWrite) {
				let value = row[column];

				if (value === null || value === undefined || value === '') {
					continue;
				}

				if (typeof value === 'string') {
					value = value.trim();
					if (value === '') continue;
				}

				setClauses.push(`[${column}] = @p${values.length + 1}`);
				values.push(dateColumns.includes(column) ? parseDateValue(value) : value);
			}

			if (setClauses.length === 0) {
				const reason = 'All cells are empty, nothing to update';
				logger.warn(`Row ${rowNumber}: ${reason} for case ${caseReference}`);
				results.skipped++;
				results.failedRows.push({ row: rowNumber, caseReference, reason });
				continue;
			}

			const updateQuery = `UPDATE [${tableName}] SET ${setClauses.join(', ')} WHERE [caseId] = @p${
				values.length + 1
			}`;
			values.push(caseId);

			logger.info(
				`Row ${rowNumber}: Updating ${setClauses.length} field(s) for case ${caseReference} (id: ${caseId})`
			);

			await databaseConnector.$executeRawUnsafe(updateQuery, ...values);

			logger.info(`Row ${rowNumber}: Successfully updated case ${caseReference}`);
			results.success++;
			results.successfulCaseIds.push(caseId);
		} catch (/** @type {any} */ error) {
			const reason = error.message || 'Unknown error';
			logger.error(`Row ${rowNumber}: Failed to update case ${caseReference} — ${reason}`);
			results.failed++;
			results.failedRows.push({ row: rowNumber, caseReference, reason });
		}
	}

	return results;
};

/**
 * @param {number[]} caseIds
 * @returns {Promise<void>}
 */
const broadcastUpdatedCases = async (caseIds) => {
	for (const caseId of caseIds) {
		try {
			const caseDetails = await getById(caseId, {
				subSector: true,
				sector: true,
				applicationDetails: true,
				zoomLevel: true,
				regions: true,
				caseStatus: true,
				casePublishedState: true,
				applicant: true,
				gridReference: true
			});

			if (!caseDetails) {
				logger.warn(`broadcastUpdatedCases: case with ID ${caseId} not found, skipping broadcast`);
				continue;
			}

			await broadcastNsipProjectEvent(caseDetails, EventType.Update);
			logger.info(`broadcastUpdatedCases: broadcast complete for case ID ${caseId}`);
		} catch (/** @type {any} */ error) {
			logger.error(
				`broadcastUpdatedCases: failed to broadcast case ID ${caseId} — ${error.message}`
			);
		}
	}
};
