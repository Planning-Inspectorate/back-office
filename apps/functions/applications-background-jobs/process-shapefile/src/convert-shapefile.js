import shpjs from 'shpjs';

/**
 * Converts a shapefile ZIP buffer to a GeoJSON FeatureCollection.
 * shpjs handles ZIP extraction, .shp parsing and .dbf attribute merging internally.
 *
 * @param {Buffer} zipBuffer
 * @returns {Promise<object>} GeoJSON FeatureCollection
 */
export const shpZipToGeoJson = async (zipBuffer) => {
	const result = await shpjs(zipBuffer);
	// shpjs returns either a FeatureCollection or an array of them (for multi-layer ZIPs)
	if (Array.isArray(result)) {
		return { type: 'FeatureCollection', features: result.flatMap((fc) => fc.features) };
	}
	return result;
};
