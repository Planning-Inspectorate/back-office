import { describe, it, expect } from '@jest/globals';
import { applyGeoJsonMetadata } from '../apply-geojson-metadata.js';

describe('applyGeoJsonMetadata', () => {
	it('adds properties to each feature in the GeoJSON object', () => {
		const geoJson = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: { id: '123', name: 'Test Feature' },
					geometry: { type: 'Polygon', coordinates: [] }
				}
			]
		};
		const receivedDate = new Date('2024-01-15T00:00:00.000Z');
		const result = applyGeoJsonMetadata(geoJson, {
			caseReference: 'EN010001',
			projectName: 'Example Project',
			fileName: 'boundary.geojson',
			receivedDate
		});
		expect(result.type).toBe('FeatureCollection');
		expect(result.features).toHaveLength(1);
		expect(result.features[0].properties).toEqual({
			caseReference: 'EN010001',
			projectName: 'Example Project',
			fileName: 'boundary.geojson',
			receivedDate: '2024-01-15T00:00:00.000Z'
		});
	});

	it('handles null receivedDate gracefully', () => {
		const geoJson = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: { type: 'Polygon', coordinates: [] }
				}
			]
		};
		const result = applyGeoJsonMetadata(geoJson, {
			caseReference: 'EN010001',
			projectName: 'Example Project',
			fileName: 'test.geojson',
			receivedDate: null
		});
		expect(result.features[0].properties.receivedDate).toBeNull();
	});
});
