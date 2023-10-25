/**
 * Take a full appeal reference, in the format
 *
 * `APP/Q9999/D/21/1345264`
 *
 * - `APP` Appeal
 * - `Q9999` LPA Code
 * - `D` Appeal Type
 * - `21` Year
 * - `1345264` Case reference
 *
 * and return the short/case reference, which is the last number part.
 * It's compatible with the new appeal references, which will be in numeric only format.
 *
 * @param {string|null|undefined} reference
 * @returns {string|null|undefined}
 */
export function appealShortReference(reference) {
	if (typeof reference !== 'string') {
		return reference;
	}

	const referenceParts = reference.split('/');

	if (referenceParts.length === 1) {
		return reference;
	}
	return referenceParts[referenceParts.length - 1];
}
