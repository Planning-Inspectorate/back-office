import { describe, it, expect } from '@jest/globals';
import { applyGeoJsonMetadata } from '../apply-geojson-metadata.js';

describe('applyGeoJsonMetadata', () => {
	it('adds properties to the GeoJSON object', () => {
		const geoJson = { type: 'FeatureCollection', features: [] };
		const receivedDate = new Date('2024-01-15T00:00:00.000Z');
		const result = applyGeoJsonMetadata(geoJson, {
			caseReference: 'EN010001',
			projectName: 'Test Project',
			projectDescription: 'A test project',
			fileName: 'boundary.geojson',
			receivedDate
		});
		expect(result.properties).toEqual({
			caseReference: 'EN010001',
			projectName: 'Test Project',
			projectDescription: 'A test project',
			fileName: 'boundary.geojson',
			receivedDate: '2024-01-15T00:00:00.000Z'
		});
		expect(result.type).toBe('FeatureCollection');
		expect(result.features).toEqual([]);
	});

	it('handles null receivedDate gracefully', () => {
		const geoJson = { type: 'FeatureCollection', features: [] };
		const result = applyGeoJsonMetadata(geoJson, {
			caseReference: 'EN010001',
			projectName: 'Test',
			projectDescription: '',
			fileName: 'test.geojson',
			receivedDate: null
		});
		expect(result.properties.receivedDate).toBeNull();
	});

	it('preserves existing GeoJSON fields', () => {
		const geoJson = { type: 'FeatureCollection', features: [{ type: 'Feature' }] };
		const result = applyGeoJsonMetadata(geoJson, {
			caseReference: 'EN010001',
			projectName: '',
			projectDescription: '',
			fileName: 'test.geojson',
			receivedDate: new Date()
		});
		expect(result.features).toHaveLength(1);
	});
});
