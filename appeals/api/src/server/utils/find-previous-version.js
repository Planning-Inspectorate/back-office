/**
 * @param {number[]} versions
 * @param {number} latestVersion
 */
export const findPreviousVersion = (versions, latestVersion) => {
	for (const version of versions.sort((a, b) => a - b).reverse()) {
		if (version < latestVersion) {
			return version;
		}
	}
	return null;
};
