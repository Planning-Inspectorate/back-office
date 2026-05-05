/**
 * Applies case metadata to a GeoJSON FeatureCollection as top-level properties.
 *
 * @param {object} geoJson
 * @param {{ caseReference: string, projectName: string, projectDescription: string, fileName: string, receivedDate: Date }} metadata
 * @returns {object}
 */
export const applyGeoJsonMetadata = (geoJson, metadata) => ({
	...geoJson,
	properties: {
		caseReference: metadata.caseReference,
		projectName: metadata.projectName,
		projectDescription: metadata.projectDescription,
		fileName: metadata.fileName,
		receivedDate: metadata.receivedDate?.toISOString() ?? null
	}
});
