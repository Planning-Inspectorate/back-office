/**
 *
 * @param {boolean | null | undefined} boolean
 * @returns
 */
export function convertFromBooleanToYesNo(boolean) {
	if (boolean !== undefined && boolean !== null) {
		return boolean ? 'Yes' : 'No';
	}
	return null;
}

/**
 *
 * @param {boolean | null | undefined} boolean
 * @param {string} [optionalDetailsIfYes]
 * @returns {string | string[]}
 */
export function convertFromBooleanToYesNoWithOptionalDetails(boolean, optionalDetailsIfYes = '') {
	const yesOrNo = convertFromBooleanToYesNo(boolean);

	if (yesOrNo === 'Yes') {
		return optionalDetailsIfYes.length > 0 ? [yesOrNo, optionalDetailsIfYes] : yesOrNo;
	} else if (yesOrNo === 'No') {
		return yesOrNo;
	}

	return '';
}
