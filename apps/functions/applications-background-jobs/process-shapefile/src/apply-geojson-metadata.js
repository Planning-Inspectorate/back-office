/**
 * Applies case metadata to a GeoJSON FeatureCollection as top-level properties.
 *
 * @param {object} geoJson - A GeoJSON FeatureCollection object
 * @param {{ caseReference: string, fileName: string, receivedDate: Date | null }} metadata
 * @returns {any} The GeoJSON object decorated with a top-level `properties` block
 */
export const applyGeoJsonMetadata = (geoJson, metadata) => ({
	...geoJson,
	properties: {
		caseReference: metadata.caseReference,
		fileName: metadata.fileName,
		receivedDate: metadata.receivedDate?.toISOString() ?? null
	}
});
