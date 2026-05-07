import {
	createGisShapefilesFolders,
	deleteGisShapefilesFolders
} from './gis-shapefiles-folder.service.js';
import logger from '#utils/logger.js';

/**
 * Migration controller for GIS Shapefiles folder creation
 * POST /migration/gis-shapefiles-folders
 * @type {import('express').RequestHandler}
 */
export const migrateGisShapefilesFolders = async (req, res) => {
	const { caseIds, dryRun } = req.body || {};
	logger.info('[MIGRATION] Starting GIS Shapefiles folder migration for all cases', {
		caseIds,
		dryRun
	});

	res.writeHead(200, { 'Content-Type': 'text/plain', 'transfer-encoding': 'chunked' });
	res.write(`[MIGRATION] Starting GIS Shapefiles folder creation...\n`);
	if (dryRun) res.write(`[MIGRATION] DRY RUN ACTIVE. No folders will be created.\n`);

	const streamLog = (msg) => {
		res.write(`${msg}\n`);
		if (typeof res.flush === 'function') res.flush();
	};

	const result = await createGisShapefilesFolders({ caseIds, dryRun, streamLog });

	logger.info('[MIGRATION] GIS Shapefiles folder migration complete', result);
	res.write(
		`\n[MIGRATION] Complete${dryRun ? ' (DRY RUN)' : ''}. Summary: ${
			dryRun ? 'Would create' : 'Created'
		}: ${result.created.length}, Skipped: ${result.skipped.length}, Not Found: ${
			result.notFound.length
		}, Failed: ${result.failed.length}\n`
	);
	res.end();
};

/**
 * Migration controller for deleting GIS Shapefiles folders
 * POST /migration/gis-shapefiles-folders/delete
 * Body: { caseIds?: number[], dryRun?: boolean }
 */
export const deleteGisShapefilesFoldersController = async (req, res) => {
	const { caseIds, dryRun } = req.body || {};
	logger.info('[MIGRATION] Starting GIS Shapefiles folder deletion', { caseIds, dryRun });

	res.writeHead(200, { 'Content-Type': 'text/plain', 'transfer-encoding': 'chunked' });
	res.write(`[MIGRATION] Starting GIS Shapefiles folder deletion...\n`);
	if (dryRun) res.write(`[MIGRATION] DRY RUN ACTIVE. No folders will be deleted.\n`);

	const streamLog = (msg) => {
		res.write(`${msg}\n`);
		if (typeof res.flush === 'function') res.flush();
	};

	const result = await deleteGisShapefilesFolders({ caseIds, dryRun, streamLog });

	logger.info('[MIGRATION] GIS Shapefiles folder deletion complete', result);
	res.write(
		`\n[MIGRATION] Complete${dryRun ? ' (DRY RUN)' : ''}. Summary: ${
			dryRun ? 'Would delete' : 'Deleted'
		}: ${result.deleted.length}, Not Found: ${result.notFound.length}, Failed: ${
			result.failed.length
		}\n`
	);
	res.end();
};
