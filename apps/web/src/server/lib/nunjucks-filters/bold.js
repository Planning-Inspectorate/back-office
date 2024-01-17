/**
 * Convert a text into html formatted bold text.
 *
 * @param {string} text
 * @returns {string}
 */
export const bold = (text) => (text ? `<strong>${text}</strong>` : '');
