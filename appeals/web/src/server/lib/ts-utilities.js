/**
 * @param {T|undefined} value
 * @return {value is T}
 * @template T
 */
export function isDefined(value) {
	return value !== undefined;
}
