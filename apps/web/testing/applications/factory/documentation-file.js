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
export function createDocumentationFile(options = {}) {
	const guid = options.guid ?? `${fake.createUniqueId()}`;
	const uniqueSeed = Number.parseInt(guid, 10);

	const dateCreated = 1_669_916_924;
	const datePublished = 1_678_192_858;
	const size = createUniqueRandomNumberFromSeed(100, 10_000_000, uniqueSeed);
	const redacted = createUniqueRandomBooleanFromSeed(uniqueSeed);

	const type = [
		{ mime: 'application/msword', ext: 'doc' },
		{ mime: 'application/pdf', ext: 'pdf' },
		{ mime: 'image/jpeg', ext: 'jpeg' },
		{ mime: 'audio/mpeg', ext: 'mpeg' }
	][createUniqueRandomNumberFromSeed(0, 4, uniqueSeed)];

	const documentName = `${uniqueSeed + 1} ${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(2, 5, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})}.${type.ext}`;

	const description = `${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(10, 30, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})}`;

	const filter1 = `${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(1, 2, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(2, 15, uniqueSeed)
	})}`;

	const url = `url/to/file/${uniqueSeed}`;

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

	const documentType = ['Rule 8 letter', 'Exam library', ''][
		createUniqueRandomNumberFromSeed(0, 3, uniqueSeed)
	];

	const stage = [
		'1. Pre-application',
		'2. Acceptance',
		'3. Pre-examination',
		'4. Examination',
		'5. Recommendation',
		'6. Decision',
		'7. Post-decision',
		"8. Developer's application"
	][createUniqueRandomNumberFromSeed(0, 9, uniqueSeed)];

	const status = [
		'user_checked',
		'not_user_checked',
		'ready_to_publish',
		'do_not_publish',
		'unpublished',
		'awaiting_virus_check',
		'failed_virus_check',
		'published'
	][createUniqueRandomNumberFromSeed(0, 8, uniqueSeed)];

	return {
		guid,
		filter1,
		documentName,
		url,
		author,
		representative,
		dateCreated,
		...(status === 'published' ? { datePublished } : {}),
		size,
		description,
		type: type.mime,
		status,
		stage,
		redacted,
		documentType
	};
}
