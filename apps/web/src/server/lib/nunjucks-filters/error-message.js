/**
 * Map an express validator message to a human readable string.
 *
 * @param {string | { msg: string }} error
 * @returns {{ text: string } | null}
 */
export function errorMessage(error) {
	let message = null;

	if (typeof error === 'string') {
		message = { text: error };
	} else if (error?.msg) {
		message = { text: error.msg };
	}

	return message;
}
