import shpjs from 'shpjs';
import { SHAPEFILE_REQUIRED_EXTENSIONS } from '../../common/constants.js';

/**
 * Validates that the ZIP contains the required shapefile components (.shp, .shx, .dbf).
 *
 * @param {Buffer} zipBuffer
 * @returns {Promise<{ valid: boolean, missingExtensions: string[] }>}
 */
export const validateShapefileContents = async (zipBuffer) => {
	const fileNames = Object.keys(await shpjs.parseZip(zipBuffer)).map((n) => n.toLowerCase());
	const missingExtensions = SHAPEFILE_REQUIRED_EXTENSIONS.filter(
		(ext) => !fileNames.some((name) => name.endsWith(ext))
	);
	return { valid: missingExtensions.length === 0, missingExtensions };
};
