/**
 * Map the appeal site address data to its formatted html representation.
 *
 * @param {import('@pins/validation').Appeal['AppealSite']} addressSite - The appeal site data.
 * @param {string} delimiter – The character(s) which which to join lines of the address. Defaults to <br>.
 * @returns {string} - An html representation of the appeal site.
 */
export function address(addressSite, delimiter = '<br>') {
	return Object.values(addressSite).filter(Boolean).join(delimiter);
}
