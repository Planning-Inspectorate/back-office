/**
 * An enum class with key-value pairs.
 *
 * @template {string} T The type of the enum values.
 */
export default class Enum {
	/**
	 * @param {Array<T>} items An array of enum values.
	 */
	constructor(items) {
		this.map = new Map();

		for (const item of items) {
			this.map.set(item, item);
		}

		Object.freeze(this);
	}

	/**
	 * Checks if an item exists in the enum.
	 *
	 * @param {T} item The item to check.
	 * @returns {boolean} True if the item exists, false otherwise.
	 */
	has(item) {
		return this.map.has(item);
	}

	/**
	 * Retrieves the value for a given key.
	 *
	 * @param {T} item The item to retrieve.
	 * @returns {T|undefined} The value for the key, or undefined if it doesn't exist.
	 */
	get(item) {
		return this.map.get(item);
	}

	/**
	 * Returns an iterable of values in the map.
	 *
	 * @returns {Iterable<string>} The value for the key, or undefined if it doesn't exist.
	 */
	values() {
		return this.map.values();
	}

	/**
	 * Retrieves the values for a all keys as an array.
	 *
	 * @returns {string} The value for the key, or undefined if it doesn't exist.
	 */
	valuesAsString() {
		return [...this.map.values()].join(',');
	}
}

export const documentStatusEnum = new Enum(['submitted', 'internal', 'draft']);

export const redactedStatusEnum = new Enum(['not_redacted', 'redacted']);

export const publishedStatusEnum = new Enum([
	'not_checked',
	'checked',
	'ready_to_publish',
	'do_not_publish',
	'publishing',
	'published',
	'archived'
]);

export const caseTypeEnum = new Enum(['nsip', 'has']);

export const securityClassificationEnum = new Enum(['public', 'official', 'secret', 'top_secret']);

export const sourceSystemEnum = new Enum([
	'appeals',
	'back-office',
	'horizon',
	'ni_file',
	'sharepoint'
]);

export const originEnum = new Enum(['pins', 'citizen', 'lpa', 'ogd']);

export const stageEnum = new Enum([
	'draft',
	'pre-application',
	'acceptance',
	'pre-examination',
	'examination',
	'recommendation',
	'decision',
	'post_decision',
	'withdrawn',
	'developers_application'
]);

export const virusCheckStatusEnum = new Enum(['not_scanned', 'scanned', 'affected']);
