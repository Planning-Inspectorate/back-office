const VALID_GEOJSON_TYPES = new Set([
	'FeatureCollection',
	'Feature',
	'Point',
	'MultiPoint',
	'LineString',
	'MultiLineString',
	'Polygon',
	'MultiPolygon',
	'GeometryCollection'
]);

/**
 * Performs a lightweight sanity check on converted GeoJSON.
 * This is intentionally not a full schema validator; it catches clearly invalid outputs.
 *
 * @param {unknown} geoJson
 * @returns {{ valid: boolean, reason: string | null }}
 */
export const validateConvertedGeoJson = (geoJson) => {
	if (!geoJson || typeof geoJson !== 'object') {
		return { valid: false, reason: 'value is not an object' };
	}

	const typedGeoJson = /** @type {{ type?: string, features?: unknown[], geometry?: object }} */ (
		geoJson
	);

	if (!typedGeoJson.type || !VALID_GEOJSON_TYPES.has(typedGeoJson.type)) {
		return { valid: false, reason: 'invalid or missing GeoJSON type' };
	}

	if (typedGeoJson.type === 'FeatureCollection' && !Array.isArray(typedGeoJson.features)) {
		return { valid: false, reason: 'FeatureCollection is missing features array' };
	}

	if (typedGeoJson.type === 'Feature' && !typedGeoJson.geometry) {
		return { valid: false, reason: 'Feature is missing geometry' };
	}

	return { valid: true, reason: null };
};
