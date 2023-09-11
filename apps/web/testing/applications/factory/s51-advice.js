import { createRandomDescription, createUniqueRandomNumberFromSeed } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types.js').S51Advice} S51Advice */
/** @typedef {import('../../../src/server/applications/applications.types.js').S51Attachment} S51Attachment */

/**
 *
 * @param {number} uniqueSeed
 * @returns {S51Attachment[]}
 */
export function createS51Attachments(uniqueSeed) {
	let attachments = [];

	for (let i = 0; i < 20; i++) {
		const documentName = `${createRandomDescription({
			wordsNumber: createUniqueRandomNumberFromSeed(2, 5, uniqueSeed + i),
			startOffset: createUniqueRandomNumberFromSeed(0, 30, uniqueSeed + i)
		})}`;

		const documentType = ['application/msword', 'application/pdf', 'image/jpeg', 'audio/mpeg'][
			createUniqueRandomNumberFromSeed(0, 4, uniqueSeed + i)
		];

		const status = ['failed_virus_check', 'awaiting_upload', 'awaiting_virus_check'][
			createUniqueRandomNumberFromSeed(0, 3, uniqueSeed + i)
		];

		attachments.push({
			documentName,
			documentType,
			documentSize: createUniqueRandomNumberFromSeed(1000, 10000, uniqueSeed),
			dateAdded: 1_678_199_858,
			status,
			documentGuid: `${uniqueSeed}`,
			version: 1
		});
	}

	return attachments;
}

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

	const title = `${createRandomDescription({
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

	const referenceNumber = id.padStart(5, '0');
	const referenceCode = `BC0110001-Advice-${referenceNumber}`;

	return {
		caseId: 11,
		id: +id,
		title,
		referenceNumber,
		referenceCode,
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
		dateUpdated,
		attachments: createS51Attachments(uniqueSeed)
	};
}
