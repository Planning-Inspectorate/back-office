/**
 * Map an express validator message to a human readable string.
 *
 * @param {{ msg: string }=} error
 * @returns {{ text: string }=}
 */
export function errorMessage(error) {
	return error?.msg ? { text: error.msg } : undefined;
}
