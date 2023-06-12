/**
 *
 * @param {boolean | null | undefined} boolean
 * @returns
 */
export function convertFromBooleanToYesNo(boolean) {
	if (boolean !== undefined || boolean !== null) {
		return boolean ? 'Yes' : 'No';
	}
	return null;
}
