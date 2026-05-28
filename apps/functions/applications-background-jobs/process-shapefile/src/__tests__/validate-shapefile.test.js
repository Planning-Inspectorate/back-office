import { describe, it, expect } from '@jest/globals';
import {
	checkRequiredExtensions,
	getFileNamesFromZipArchive,
	validateShapefileContents
} from '../validate-shapefile.js';

describe('getFileNamesFromZipArchive', () => {
	it('returns lowercased filenames from ZIP archive entries', () => {
		const result = getFileNamesFromZipArchive({
			files: { 'boundary.SHP': { dir: false }, 'boundary.DBF': { dir: false } }
		});
		expect(result).toEqual(['boundary.shp', 'boundary.dbf']);
	});

	it('returns empty array for empty ZIP', () => {
		expect(getFileNamesFromZipArchive({ files: {} })).toEqual([]);
	});

	it('ignores directory entries', () => {
		const result = getFileNamesFromZipArchive({
			files: {
				'folder/': { dir: true },
				'folder/boundary.shp': { dir: false }
			}
		});
		expect(result).toEqual(['folder/boundary.shp']);
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

describe('validateShapefileContents', () => {
	it('treats parseZip errors as validation failure', async () => {
		const result = await validateShapefileContents(Buffer.from('not-a-zip'));

		expect(result.valid).toBe(false);
		expect(result.missingExtensions).toEqual(['.shp', '.shx', '.dbf']);
		expect(result.fileNames).toEqual([]);
		expect(result.parseError).toEqual(expect.any(String));
	});
});
