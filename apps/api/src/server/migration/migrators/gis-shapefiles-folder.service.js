import * as caseRepository from '#repositories/case.repository.js';
import * as folderRepository from '#repositories/folder.repository.js';
import logger from '#utils/logger.js';
import { databaseConnector } from '#utils/database-connector.js';

/**
 * @typedef {{ caseId: number, reason?: string, folderId?: number, dryRun?: boolean }} FolderActionResult
 * @typedef {{ created: FolderActionResult[], skipped: FolderActionResult[], notFound: FolderActionResult[], failed: FolderActionResult[], dryRun: boolean }} CreateFoldersResult
 * @typedef {{ deleted: FolderActionResult[], notFound: FolderActionResult[], failed: FolderActionResult[], dryRun: boolean }} DeleteFoldersResult
 */

const GIS_SHAPEFILES_FOLDER = 'GIS Shapefiles';
const FOLDER_DISPLAY_ORDER = 175;
const FOLDER_STAGE = null;
const BATCH_SIZE = 20;
const IS_CUSTOM_FOLDER = false;
const MIGRATABLE_STATUSES = [
	'pre_application',
	'acceptance',
	'pre_examination',
	'examination',
	'recommendation',
	'decision',
	'post_decision',
	'withdrawn',
	'closed'
];

/**
 * Get all relevant cases (by status) or a specific set of case IDs.
 * @param {number[] | null | undefined} caseIds
 * @returns {Promise<{id: number, checkExists?: boolean}[]>}
 */
async function getTargetCases(caseIds) {
	if (Array.isArray(caseIds) && caseIds.length > 0) {
		return caseIds.map((id) => ({ id, checkExists: true }));
	}
	const cases = await caseRepository.getByStatus(MIGRATABLE_STATUSES);

	return cases.map((caseItem) => ({ id: caseItem.id }));
}

/**
 * Get the root-level GIS Shapefiles folder for a case, if it exists.
 * @param {number} caseId
 * @returns {Promise<any|null>} Folder object or null
 */
async function getShapefilesFolderByCaseId(caseId) {
	return folderRepository.getFolderByNameAndCaseId(caseId, GIS_SHAPEFILES_FOLDER, null);
}

/**
 * Log a message and return the entry object.
 * @template T
 * @param {T} entry
 * @param {string} msg
 * @param {'info'|'warn'|'error'|'debug'} [level='info']
 * @param {Function} [streamLog]
 * @returns {T}
 */
function logAndReturn(entry, msg, level = 'info', streamLog) {
	logger[level](msg);
	if (streamLog) streamLog(msg);
	return entry;
}

/**
 * Generic batch processor for case folders.
 * @param {object} params
 * @param {{id: number, checkExists?: boolean}[]} params.cases
 * @param {Function} [params.streamLog]
 * @param {FolderActionResult[]} params.failed
 * @param {FolderActionResult[]} params.notFound
 * @param {(caseItem: {id: number}, folder: any) => Promise<void>} params.processItem
 */
async function processFolderBatches({ cases, streamLog, failed, notFound, processItem }) {
	for (let i = 0; i < cases.length; i += BATCH_SIZE) {
		const batch = cases.slice(i, i + BATCH_SIZE);

		await Promise.all(
			batch.map(async (caseItem) => {
				try {
					if (caseItem.checkExists) {
						const caseRecord = await databaseConnector.case.findUnique({
							where: { id: caseItem.id }
						});
						if (!caseRecord) {
							notFound.push(
								logAndReturn(
									{ caseId: caseItem.id, reason: 'Case not found' },
									`[NOT-FOUND] Case ${caseItem.id}: Case not found`,
									'warn',
									streamLog
								)
							);
							return;
						}
					}
					const folder = await getShapefilesFolderByCaseId(caseItem.id);
					await processItem(caseItem, folder);
				} catch (err) {
					const reason = err instanceof Error ? err.message : String(err);
					failed.push(
						logAndReturn(
							{ caseId: caseItem.id, reason },
							`[FAIL] Case ${caseItem.id}: ${reason}`,
							'error',
							streamLog
						)
					);
				}
			})
		);
	}
}

/**
 * Creates a root-level 'GIS Shapefiles' folder for all cases (excluding drafts) if missing.
 * Logs actions and errors, safe to rerun. Supports dry-run mode.
 * @param {{ dryRun?: boolean, caseIds?: number[], streamLog?: Function }} [options]
 * @returns {Promise<CreateFoldersResult>}
 */
export async function createGisShapefilesFolders({
	dryRun = false,
	caseIds = undefined,
	streamLog = undefined
} = {}) {
	/** @type {FolderActionResult[]} */
	const created = [];
	/** @type {FolderActionResult[]} */
	const skipped = [];
	/** @type {FolderActionResult[]} */
	const failed = [];
	/** @type {FolderActionResult[]} */
	const notFound = [];

	const cases = await getTargetCases(caseIds);

	await processFolderBatches({
		cases,
		streamLog,
		failed,
		notFound,
		processItem: async (caseItem, folder) => {
			if (folder && typeof folder.id === 'number') {
				skipped.push(
					logAndReturn(
						{ caseId: caseItem.id, reason: 'already exists', folderId: folder.id },
						`[SKIP] Case ${caseItem.id}: ${GIS_SHAPEFILES_FOLDER} folder already exists (folderId=${folder.id})`,
						'info',
						streamLog
					)
				);
				return;
			}

			if (dryRun) {
				created.push(
					logAndReturn(
						{ caseId: caseItem.id, dryRun: true },
						`[CREATE] (DRY-RUN) Would create ${GIS_SHAPEFILES_FOLDER} folder for case ${caseItem.id}`,
						'info',
						streamLog
					)
				);
				return;
			}

			const createdFolder = await folderRepository.createFolder(
				{
					displayNameEn: GIS_SHAPEFILES_FOLDER,
					caseId: caseItem.id,
					parentFolderId: null,
					displayOrder: FOLDER_DISPLAY_ORDER,
					stage: FOLDER_STAGE
				},
				IS_CUSTOM_FOLDER
			);

			if (createdFolder && typeof createdFolder.id === 'number') {
				created.push(
					logAndReturn(
						{ caseId: caseItem.id, folderId: createdFolder.id },
						`[CREATE] Created ${GIS_SHAPEFILES_FOLDER} folder for case ${caseItem.id} (folderId=${createdFolder.id})`,
						'info',
						streamLog
					)
				);
			} else {
				failed.push(
					logAndReturn(
						{ caseId: caseItem.id, reason: 'folder creation returned null' },
						`[FAIL] Case ${caseItem.id}: folder creation returned null`,
						'error',
						streamLog
					)
				);
			}
		}
	});

	logger.info(
		`[SUMMARY] ${dryRun ? '(DRY-RUN) Would create' : 'Created'}: ${created.length}, Skipped: ${
			skipped.length
		}, Not Found: ${notFound.length}, Failed: ${failed.length}`
	);
	if (dryRun) logger.info(`[DRY-RUN] No folders were actually created.`);

	return { created, skipped, notFound, failed, dryRun };
}

/**
 * Deletes the root-level 'GIS Shapefiles' folder for given case IDs (or all cases if none specified).
 * Returns lists of deleted, not found, and failed cases
 * @param {{ caseIds?: number[], dryRun?: boolean, streamLog?: Function }} [options]
 * @returns {Promise<DeleteFoldersResult>}
 */
export async function deleteGisShapefilesFolders({
	caseIds = undefined,
	dryRun = false,
	streamLog = undefined
} = {}) {
	/** @type {FolderActionResult[]} */
	const deleted = [];
	/** @type {FolderActionResult[]} */
	const notFound = [];
	/** @type {FolderActionResult[]} */
	const failed = [];

	const cases = await getTargetCases(caseIds);

	await processFolderBatches({
		cases,
		streamLog,
		failed,
		notFound,
		processItem: async (caseItem, folder) => {
			if (!folder || typeof folder.id !== 'number') {
				notFound.push(
					logAndReturn(
						{ caseId: caseItem.id },
						`[DELETE-SKIP] Case ${caseItem.id}: ${GIS_SHAPEFILES_FOLDER} folder not found`,
						'info',
						streamLog
					)
				);
				return;
			}

			if (dryRun) {
				deleted.push(
					logAndReturn(
						{ caseId: caseItem.id, dryRun: true, folderId: folder.id },
						`[DELETE] (DRY-RUN) Would delete ${GIS_SHAPEFILES_FOLDER} folder for case ${caseItem.id} (folderId=${folder.id})`,
						'info',
						streamLog
					)
				);
				return;
			}

			await folderRepository.deleteById(folder.id);
			deleted.push(
				logAndReturn(
					{ caseId: caseItem.id, folderId: folder.id },
					`[DELETE] Deleted ${GIS_SHAPEFILES_FOLDER} folder for case ${caseItem.id} (folderId=${folder.id})`,
					'info',
					streamLog
				)
			);
		}
	});

	logger.info(
		`[DELETE-SUMMARY] ${dryRun ? '(DRY-RUN) Would delete' : 'Deleted'}: ${
			deleted.length
		}, Not found: ${notFound.length}, Failed: ${failed.length}`
	);
	if (dryRun) logger.info(`[DRY-RUN] No folders were actually deleted.`);

	return { deleted, notFound, failed, dryRun };
}
