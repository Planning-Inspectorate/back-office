import { SynapseDB } from '../../common/synapse-db.js';
import { makePostRequest } from '../../common/back-office-api-client.js';
import { pick } from 'lodash-es';

const query = 'SELECT * FROM [odw_curated_db].[dbo].[legacy_folder_data] WHERE caseReference = ?';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 */
export const migrateFolder = async (logger, caseReferences) => {
	for (const caseReference of caseReferences) {
		try {
			logger.info(`reading Folders with caseReference ${caseReference}`);

			const [folderRows, count] = await SynapseDB.query(query, {
				replacements: [caseReference]
			});

			const folderEntities = folderRows.map((row) =>
				pick(row, [
					'id',
					'caseReference',
					'displayNameEnglish',
					'displayNameWelsh',
					'parentFolderId',
					'caseStage'
				])
			);

			logger.info(`found ${count} Folders: ${JSON.stringify(folderEntities.map((u) => u.id))}`);

			if (folderEntities.length > 0) {
				await makePostRequest(logger, '/migration/folder', folderEntities);
			}
		} catch (e) {
			logger.error(`Failed to migrate Folder for case ${caseReference}`, e?.response?.body, e);
			throw e;
		}
	}
};
