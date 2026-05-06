/**
 * Applies case metadata to a GeoJSON FeatureCollection as top-level properties.
 *
 * Note: `projectName` is intentionally omitted here. The nsip-document Service Bus event
 * does not carry a project name field. The API resolves the project name from the case
 * record (Case.title) and populates it on the DocumentVersion at processing time.
 *
 * @param {object} geoJson - A GeoJSON FeatureCollection object
 * @param {{ caseReference: string, projectDescription: string, fileName: string, receivedDate: Date | null }} metadata
 * @returns {any} The GeoJSON object decorated with a top-level `properties` block
 */
export const applyGeoJsonMetadata = (geoJson, metadata) => ({
	...geoJson,
	properties: {
		caseReference: metadata.caseReference,
		projectDescription: metadata.projectDescription,
		fileName: metadata.fileName,
		receivedDate: metadata.receivedDate?.toISOString() ?? null
	}
});
