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
	id = fake.createUniqueId(),
	date = 1_669_916_924,
	size = createUniqueRandomNumberFromSeed(100, 10_000_000, id),
	isChecked = createUniqueRandomBooleanFromSeed(id),
	isRedacted = createUniqueRandomBooleanFromSeed(id)
} = {}) {
	const fileName = `${id + 1} ${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(2, 5, id),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, id)
	})}`;
	const url = `url/to/file/${id}`;
	const from = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(0, 30, id)
	})} ${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(5, 20, id)
	})}`;
	const type = ['DOC', 'PDF', 'JPG', 'MP3'][createUniqueRandomNumberFromSeed(0, 4, id)];

	return {
		id,
		fileName,
		url,
		from,
		date,
		size,
		type,
		isChecked,
		isRedacted
	};
}
