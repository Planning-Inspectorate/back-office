/**
 *
 * @param {Record<string, any> | undefined} errors
 * @returns {boolean}
 */
export function hasRealErrors(errors) {
	if (!errors || typeof errors !== 'object') return false;

	return Object.values(errors).some((err) => {
		return (
			err && typeof err === 'object' && typeof err.msg === 'string' && err.msg.trim().length > 0
		);
	});
}
