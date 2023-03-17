import { fake } from '@pins/platform';
import { createRandomDescription, createUniqueRandomNumberFromSeed } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types').DocumentationFile} DocumentationFile */

/**
 *
 * @param {Partial<DocumentationFile>} [options={}]
 * @returns {DocumentationFile}
 */
export function createDocumentationFile(options = {}) {
	const documentGuid = options.documentGuid ?? `${fake.createUniqueId()}`;
	const uniqueSeed = Number.parseInt(documentGuid, 10);

	const dateCreated = 1_669_916_924;
	const datePublished = 1_678_192_858;
	const size = createUniqueRandomNumberFromSeed(100, 10_000_000, uniqueSeed);
	const redactedStatus = ['redacted', 'not_redacted'][
		createUniqueRandomNumberFromSeed(0, 2, uniqueSeed)
	];

	const mime = ['application/msword', 'application/pdf', 'image/jpeg', 'audio/mpeg'][
		createUniqueRandomNumberFromSeed(0, 4, uniqueSeed)
	];

	const fileName = `${uniqueSeed + 1} ${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(2, 5, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})}`;

	const description = `${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(10, 30, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})}`;

	const filter1 = `${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(1, 2, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(2, 15, uniqueSeed)
	})}`;

	const stage = [
		'pre-application',
		'acceptance',
		'pre-examination',
		'examination',
		'recommendation',
		'decision',
		'post_decision',
		'withdrawn'
	][createUniqueRandomNumberFromSeed(0, 8, uniqueSeed)];

	const representative = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})} ${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(5, 20, uniqueSeed)
	})}`;

	const author = `${createRandomDescription({
		wordsNumber: 2,
		startOffset: createUniqueRandomNumberFromSeed(3, 12, uniqueSeed)
	})}`;

	const publishedStatus = [
		'user_checked',
		'not_user_checked',
		'ready_to_publish',
		'do_not_publish',
		'unpublished',
		'awaiting_virus_check',
		'failed_virus_check',
		'published'
	][createUniqueRandomNumberFromSeed(0, 8, uniqueSeed)];

	const documentType = ['Rule 8 letter', 'Exam library'][
		createUniqueRandomNumberFromSeed(0, 3, uniqueSeed)
	];

	return {
		folderId: 11,
		documentGuid,
		filter1,
		fileName,
		author,
		representative,
		dateCreated,
		...(publishedStatus === 'published' ? { datePublished } : {}),
		size,
		description,
		mime,
		publishedStatus,
		redactedStatus,
		stage,
		documentType
	};
}
