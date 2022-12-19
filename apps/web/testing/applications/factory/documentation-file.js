import { fake } from '@pins/platform';
import {
	createRandomDescription,
	createUniqueRandomBooleanFromSeed,
	createUniqueRandomNumberFromSeed
} from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types').DocumentationFile} DocumentationFile */

/**
 *
 * @param {Partial<DocumentationFile>} [options={}]
 * @returns {DocumentationFile}
 */
export function createDocumentationFile({
	guid = `${fake.createUniqueId()}`,
	receivedDate = 1_669_916_924
} = {}) {
	const uniqueSeed = Number.parseInt(guid, 10);
	const size = createUniqueRandomNumberFromSeed(100, 10_000_000, uniqueSeed);
	const isRedacted = createUniqueRandomBooleanFromSeed(uniqueSeed);

	const documentName = `${uniqueSeed + 1} ${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(2, 5, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})}`;
	const url = `url/to/file/${uniqueSeed}`;
	const from = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})} ${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(5, 20, uniqueSeed)
	})}`;
	const type = ['DOC', 'PDF', 'JPG', 'MP3'][createUniqueRandomNumberFromSeed(0, 4, uniqueSeed)];
	const status = [
		'user_checked',
		'not_user_checked',
		'ready_to_publish',
		'do_not_publish',
		'unpublished',
		'awaiting_virus_check',
		'failed_virus_check'
	][createUniqueRandomNumberFromSeed(0, 7, uniqueSeed)];

	return {
		guid,
		documentName,
		url,
		from,
		receivedDate,
		size,
		type,
		status,
		isRedacted
	};
}
