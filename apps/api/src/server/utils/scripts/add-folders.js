import { createFolders } from '#repositories/folder.repository.js';
import { getCaseByRef } from '../../applications/application/application.service.js';

/**
 * Small script to add folders to a case, first looking up the case by reference
 */
async function run() {
	const ref = process.argv[2];
	if (!ref) {
		throw new Error('provide a case reference');
	}
	console.log('Looking up by ref:', ref);
	const project = await getCaseByRef(ref);
	if (!project) {
		throw new Error('not found');
	}
	console.log('Found project with id:', project.id);
	await Promise.all(createFolders(project.id));
	console.log('Folders created');
}

run().catch(console.error);
