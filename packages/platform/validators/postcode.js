const POSTCODE =
	/^(([Gg][Ii][Rr] *0[Aa]{2})|(([Aa][Ss][Cc][Nn]|[Ss][Tt][Hh][Ll]|[Tt][Dd][Cc][Uu]|[Bb]{2}[Nn][Dd]|[Bb][Ii][Qq]{2}|[Ff][Ii][Qq]{2}|[Pp][Cc][Rr][Nn]|[Ss][Ii][Qq]{2}|[Ti][Kk][Cc][Aa]) *1[Zz]{2})|((([A-PR-UWYZa-pr-uwyz][A-HK-Ya-hk-y]?\d{1,2})|(([A-PR-UWYZa-pr-uwyz]\d[A-HJKS-UWa-hjks-uw])|([A-PR-UWYZa-pr-uwyz][A-HK-Ya-hk-y]\d[ABEHMNPRV-Yabehmnprv-y]))) \d[ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}))$/;

/**
 * Validate a string to determine if matches the UK postcode format.
 *
 * @param {string} value - value to validate
 * @returns {boolean} - the value is in the UK postcode format
 */
export function validatePostcode(value) {
	return POSTCODE.test(value);
}
