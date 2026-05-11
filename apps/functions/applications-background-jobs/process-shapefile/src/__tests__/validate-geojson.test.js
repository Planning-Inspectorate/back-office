import { describe, it, expect } from '@jest/globals';
import { validateConvertedGeoJson } from '../validate-geojson.js';

describe('validateConvertedGeoJson', () => {
	it('returns valid for a FeatureCollection with features array', () => {
		const result = validateConvertedGeoJson({
			type: 'FeatureCollection',
			features: []
		});

		expect(result).toEqual({ valid: true, reason: null });
	});

	it('returns invalid when value is not an object', () => {
		const result = validateConvertedGeoJson(null);
		expect(result.valid).toBe(false);
		expect(result.reason).toBe('value is not an object');
	});

	it('returns invalid when type is missing', () => {
		const result = validateConvertedGeoJson({ features: [] });
		expect(result.valid).toBe(false);
		expect(result.reason).toBe('invalid or missing GeoJSON type');
	});

	it('returns invalid for FeatureCollection without features array', () => {
		const result = validateConvertedGeoJson({ type: 'FeatureCollection' });
		expect(result.valid).toBe(false);
		expect(result.reason).toBe('FeatureCollection is missing features array');
	});

	it('returns invalid for Feature without geometry', () => {
		const result = validateConvertedGeoJson({ type: 'Feature' });
		expect(result.valid).toBe(false);
		expect(result.reason).toBe('Feature is missing geometry');
	});

	it('returns valid for Point geometry object', () => {
		const result = validateConvertedGeoJson({
			type: 'Point',
			coordinates: [0, 0]
		});
		expect(result).toEqual({ valid: true, reason: null });
	});
});
