import { databaseConnector } from '#utils/database-connector.js';
import BackOfficeAppError from '#utils/app-error.js';

// starting from the root folders, create the path for every child folder, stop when leaf node reached

// get all root folders

// for each root folder traverse the tree/folder populating the path column, until leaf reached
/**
 *
 * @param folder
 * @param {string | null} parentsPath
 * @returns {Promise<void>}
 */
async function writePaths(folder, parentsPath) {
	// Is it a root folder?
	if (folder.parentFolderId == null) {
		try {
			const updatedRootFolder = await databaseConnector.folder.update({
				where: { id: folder.id },
				data: { path: `/${folder.id}` }
			});
			// create paths for child folders
			const childFolders = await databaseConnector.folder.findMany({
				where: { parentFolderId: folder.id }
			});
			if (!childFolders || childFolders.length === 0) return;

			for (const childFolder of childFolders) {
				await writePaths(childFolder, updatedRootFolder.path);
			}
		} catch (e) {
			throw new BackOfficeAppError(`Error setting path for ${folder.id}`);
		}
	} else {
		try {
			// for child/non-root folders...
			const updatedFolder = await databaseConnector.folder.update({
				where: { id: folder.id },
				data: { path: `${parentsPath}/${folder.id}` }
			});

			const childFolders = await databaseConnector.folder.findMany({
				where: { parentFolderId: folder.id }
			});

			if (!childFolders || childFolders.length === 0) return;

			for (const childFolder of childFolders) {
				await writePaths(childFolder, updatedFolder.path);
			}
		} catch (e) {
			throw new BackOfficeAppError(`Error setting path for ${folder.id}`);
		}
	}
}

(async () => {
	const rootFolders = await databaseConnector.folder.findMany({
		where: { parentFolderId: null }
	});
	await Promise.all(rootFolders.map((rootFolder) => writePaths(rootFolder, null)));
})();
