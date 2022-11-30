import { fake } from '@pins/platform';
import { createRandomDescription } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types').DocumentationFile} DocumentationFile */

/**
 *
 * @param {Partial<DocumentationFile>} [options={}]
 * @returns {DocumentationFile}
 */
export function createDocumentationFile({
	id = fake.createUniqueId(),
	date = Math.floor(Math.random() * 10_000_000_000),
	size = Math.floor(Math.random() * 10_000_000),
	isChecked = fake.randomBoolean(),
	isRedacted = fake.randomBoolean()
} = {}) {
	const fileName = `${id + 1} ${createRandomDescription({
		wordsNumber: Math.floor(Math.random() * 5) + 2,
		startOffset: Math.floor(Math.random() * 30)
	})}`;
	const url = `url/to/file/${id}`;
	const from = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: Math.floor(Math.random() * 30)
	})} ${createRandomDescription({ wordsNumber: 1, startOffset: Math.floor(Math.random() * 30) })}`;
	const type = ['DOC', 'PDF', 'JPG', 'MP3'][Math.floor(Math.random() * 4)];

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
