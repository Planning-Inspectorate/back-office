import JSZip from 'jszip';
import { SHAPEFILE_REQUIRED_EXTENSIONS } from '../../common/constants.js';

/**
 * Returns the list of file names from ZIP archive entries.
 * Pure function — no external dependencies.
 *
 * @param {{ files: Record<string, { dir?: boolean }> }} zipArchive
 * @returns {string[]}
 */
export const getFileNamesFromZipArchive = (zipArchive) =>
	Object.entries(zipArchive.files)
		.filter(([, entry]) => !entry?.dir)
		.map(([name]) => name.toLowerCase());

/**
 * Checks whether all required shapefile extensions are present in a list of filenames.
 * Pure function — no external dependencies.
 *
 * @param {string[]} fileNames
 * @returns {{ valid: boolean, missingExtensions: string[] }}
 */
export const checkRequiredExtensions = (fileNames) => {
	const missingExtensions = SHAPEFILE_REQUIRED_EXTENSIONS.filter(
		(ext) => !fileNames.some((name) => name.endsWith(ext))
	);
	return { valid: missingExtensions.length === 0, missingExtensions };
};

/**
 * Validates that a ZIP buffer contains the required shapefile components (.shp, .shx, .dbf).
 *
 * @param {Buffer} zipBuffer
 * @returns {Promise<{
 *   valid: boolean,
 *   missingExtensions: string[],
 *   fileNames: string[],
 *   parseError: string | null
 * }>}
 */
export const validateShapefileContents = async (zipBuffer) => {
	try {
		const zipArchive = await JSZip.loadAsync(zipBuffer);
		const fileNames = getFileNamesFromZipArchive(zipArchive);
		const { valid, missingExtensions } = checkRequiredExtensions(fileNames);

		return {
			valid,
			missingExtensions,
			fileNames,
			parseError: null
		};
	} catch (error) {
		return {
			valid: false,
			missingExtensions: SHAPEFILE_REQUIRED_EXTENSIONS,
			fileNames: [],
			parseError: error instanceof Error ? error.message : 'Unknown parse error'
		};
	}
};
