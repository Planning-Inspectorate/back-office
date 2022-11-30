/**
 * Register the fileSize filter
 *
 * @param {number} sizesInBytes
 * @returns {string}
 */
export const fileSize = (sizesInBytes) => {
	const unit = sizesInBytes > 99_999 ? 'MB' : 'KB';
	const power = sizesInBytes > 99_999 ? 1e-5 : 1e-2;

	return `${Math.round(sizesInBytes * power) / 10} ${unit}`;
};
