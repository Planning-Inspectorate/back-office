/**
 * @param {T|undefined} value
 * @return {value is T}
 * @template T
 */
export function isDefined(value) {
	return value !== undefined;
}

/** @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo */

/**
 * @param {FolderInfo|any} value
 * @return {value is FolderInfo}
 */
export function isFolderInfo(value) {
	return (
		value !== null &&
		value !== undefined &&
		typeof value === 'object' &&
		'folderId' in value &&
		'path' in value &&
		'documents' in value
	);
}
