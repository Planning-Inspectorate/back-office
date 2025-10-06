import { databaseConnector } from '#utils/database-connector.js';
import assert from 'assert';

const randomFolderForACaseId = await databaseConnector.folder.findFirst({
	where: {
		caseId: {
			not: null
		}
	}
});
let caseId = randomFolderForACaseId.caseId;
let rootFolders = await databaseConnector.folder.findMany({
	where: {
		caseId,
		parentFolderId: null
	}
});

for (const folder of rootFolders) {
	await checkPaths(folder, folder.path);
}

async function checkPaths(folder, parentPath) {
	const expectedPath = folder.parentFolderId ? `${parentPath}/${folder.id}` : `/${folder.id}`;
	assert.strictEqual(folder.path, expectedPath);
	const childFolders = await databaseConnector.folder.findMany({
		where: {
			parentFolderId: folder.id
		}
	});
	if (!childFolders || childFolders.length === 0) return;
	for (const child of childFolders) await checkPaths(child, expectedPath);
}
