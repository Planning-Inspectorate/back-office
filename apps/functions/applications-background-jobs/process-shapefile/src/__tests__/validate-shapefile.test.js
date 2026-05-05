import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('shpjs', () => {
	const mock = jest.fn();
	mock.parseZip = jest.fn();
	return { default: mock };
});

import shpjs from 'shpjs';
import { validateShapefileContents } from '../validate-shapefile.js';

describe('validateShapefileContents', () => {
	beforeEach(() => jest.clearAllMocks());

	it('returns valid when all required extensions are present', async () => {
		shpjs.parseZip.mockResolvedValue({
			'boundary.shp': {},
			'boundary.shx': {},
			'boundary.dbf': {}
		});
		const result = await validateShapefileContents(Buffer.alloc(0));
		expect(result.valid).toBe(true);
		expect(result.missingExtensions).toHaveLength(0);
	});

	it('returns invalid when .shp is missing', async () => {
		shpjs.parseZip.mockResolvedValue({ 'boundary.shx': {}, 'boundary.dbf': {} });
		const result = await validateShapefileContents(Buffer.alloc(0));
		expect(result.valid).toBe(false);
		expect(result.missingExtensions).toContain('.shp');
	});

	it('returns invalid when .shx and .dbf are missing', async () => {
		shpjs.parseZip.mockResolvedValue({ 'boundary.shp': {} });
		const result = await validateShapefileContents(Buffer.alloc(0));
		expect(result.valid).toBe(false);
		expect(result.missingExtensions).toContain('.shx');
		expect(result.missingExtensions).toContain('.dbf');
	});

	it('is case-insensitive for extensions', async () => {
		shpjs.parseZip.mockResolvedValue({
			'boundary.SHP': {},
			'boundary.SHX': {},
			'boundary.DBF': {}
		});
		const result = await validateShapefileContents(Buffer.alloc(0));
		expect(result.valid).toBe(true);
	});

	it('returns all missing extensions when ZIP is empty', async () => {
		shpjs.parseZip.mockResolvedValue({});
		const result = await validateShapefileContents(Buffer.alloc(0));
		expect(result.valid).toBe(false);
		expect(result.missingExtensions).toEqual(['.shp', '.shx', '.dbf']);
	});
});
