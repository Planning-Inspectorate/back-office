import { describe, it, expect } from '@jest/globals';
import { checkRequiredExtensions, getFileNamesFromParsedZip } from '../validate-shapefile.js';

describe('getFileNamesFromParsedZip', () => {
	it('returns lowercased filenames from parsed ZIP keys', () => {
		const result = getFileNamesFromParsedZip({ 'boundary.SHP': {}, 'boundary.DBF': {} });
		expect(result).toEqual(['boundary.shp', 'boundary.dbf']);
	});

	it('returns empty array for empty ZIP', () => {
		expect(getFileNamesFromParsedZip({})).toEqual([]);
	});
});

describe('checkRequiredExtensions', () => {
	it('returns valid when all required extensions are present', () => {
		const result = checkRequiredExtensions(['boundary.shp', 'boundary.shx', 'boundary.dbf']);
		expect(result.valid).toBe(true);
		expect(result.missingExtensions).toHaveLength(0);
	});

	it('returns invalid when .shp is missing', () => {
		const result = checkRequiredExtensions(['boundary.shx', 'boundary.dbf']);
		expect(result.valid).toBe(false);
		expect(result.missingExtensions).toContain('.shp');
	});

	it('returns invalid when .shx and .dbf are missing', () => {
		const result = checkRequiredExtensions(['boundary.shp']);
		expect(result.valid).toBe(false);
		expect(result.missingExtensions).toContain('.shx');
		expect(result.missingExtensions).toContain('.dbf');
	});

	it('returns all missing extensions when list is empty', () => {
		const result = checkRequiredExtensions([]);
		expect(result.valid).toBe(false);
		expect(result.missingExtensions).toEqual(['.shp', '.shx', '.dbf']);
	});
});
