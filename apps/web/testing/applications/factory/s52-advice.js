import { createRandomDescription, createUniqueRandomNumberFromSeed } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types.js').S51Advice} S51Advice */

/**
 *
 * @param {Partial<S51Advice>} [options={}]
 * @returns {S51Advice}
 */
export function createS51Advice(options = {}) {
	const id = `${options.id}`;
	const uniqueSeed = Number.parseInt(id, 10);

	const dateCreated = 1_669_916_924;
	const dateUpdated = 1_678_192_858;

	const redactedStatus = ['redacted', 'not_redacted'][
		createUniqueRandomNumberFromSeed(0, 2, uniqueSeed)
	];

	const title = `${uniqueSeed + 1} ${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(2, 5, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})}`;

	const enquiryDetails = `${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(10, 30, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})}`;

	const enquirer = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(3, 12, uniqueSeed)
	})}`;

	const firstName = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(3, 12, uniqueSeed)
	})}`;

	const lastName = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(4, 12, uniqueSeed)
	})}`;

	const enquiryDate = 1_678_199_858;

	const adviser = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(3, 12, uniqueSeed)
	})}`;

	const adviceDetails = `${createRandomDescription({
		wordsNumber: createUniqueRandomNumberFromSeed(10, 30, uniqueSeed),
		startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed)
	})}`;

	const adviceDate = 1_678_200_858;

	const publishedStatus = [
		'checked',
		'not_checked',
		'ready_to_publish',
		'do_not_publish',
		'unpublished',
		'published'
	][createUniqueRandomNumberFromSeed(0, 5, uniqueSeed)];

	/** @type {Array<'phone' | 'email' | 'meeting' | 'post'>} */
	const methods = ['meeting', 'phone', 'post', 'email'];
	const enquiryMethod = methods[createUniqueRandomNumberFromSeed(0, 3, uniqueSeed)];

	const referenceNumber = 'BC0110001-Advice-00001';

	return {
		caseId: 11,
		id: +id,
		title,
		referenceNumber,
		enquirer,
		firstName,
		lastName,
		enquiryMethod,
		enquiryDetails,
		enquiryDate,
		adviser,
		adviceDetails,
		adviceDate,
		publishedStatus,
		redactedStatus,
		dateCreated,
		dateUpdated
	};
}
