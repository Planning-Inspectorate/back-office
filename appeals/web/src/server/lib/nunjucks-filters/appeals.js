/**
 * Take a full appeal referenceerence, in the format
 *
 * `APP/Q9999/D/21/1345264`
 *
 * - `APP` Appeal
 * - `Q9999` LPA Code
 * - `D` Appeal Type
 * - `21` Year
 * - `1345264` Case referenceerence
 *
 * and return the short/case referenceerence, which is the last number part.
 *
 * @param {string|null|undefined} reference
 * @returns {string|null|undefined}
 */
export function appealShortReference(reference) {
	if (typeof reference !== 'string') {
		return reference;
	}

	const referenceParts = reference.split('/');

	if (referenceParts.length !== 5) {
		return reference;
	}
	return referenceParts[referenceParts.length - 1];
}
