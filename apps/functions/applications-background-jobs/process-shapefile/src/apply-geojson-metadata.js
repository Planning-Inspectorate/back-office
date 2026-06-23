/**
 * Applies case metadata to each feature in a GeoJSON FeatureCollection.
 *
 * @param {{ type: 'FeatureCollection', features: Array<{ type: 'Feature', properties?: Record<string, unknown>, geometry: unknown }> }} geoJson - A GeoJSON FeatureCollection object
 * @param {{ caseReference: string, projectName: string, fileName: string, receivedDate: Date | null }} metadata
 * @returns {any} The GeoJSON object with metadata stored on each feature's properties
 */
export const applyGeoJsonMetadata = (geoJson, metadata) => ({
	...geoJson,
	features: geoJson.features.map((feature) => ({
		...feature,
		properties: {
			caseReference: metadata.caseReference,
			projectName: metadata.projectName,
			fileName: metadata.fileName,
			receivedDate: metadata.receivedDate?.toISOString() ?? null
		}
	}))
});
