import { getUploadConfigForFolder } from '../applications-documentation.config.js';

describe('getUploadConfigForFolder', () => {
	describe('gis-shapefiles folder', () => {
		it('should return shapefile-specific config', () => {
			const result = getUploadConfigForFolder('gis-shapefiles');

			expect(result).toEqual({
				isGisShapefilesFolder: true,
				allowedTypes: ['zip'],
				multiple: false,
				showUploadLabel: false,
				fileTypeText:
					'Your file must be a ZIP file containing exactly one geospatial SHP file, with any supporting files included',
				sizeText: 'The total size of your uploaded files must be smaller than 1GB',
				disclaimerText:
					'Saved shapefiles will be processed into a GeoJSON file with a document status of ‘not checked’'
			});
		});

		it('should only allow zip files', () => {
			const result = getUploadConfigForFolder('gis-shapefiles');

			expect(result.allowedTypes).toEqual(['zip']);
		});

		it('should disable multiple uploads', () => {
			const result = getUploadConfigForFolder('gis-shapefiles');

			expect(result.multiple).toBe(false);
		});
	});

	describe('default folders', () => {
		it('should return default config for unknown folder', () => {
			const result = getUploadConfigForFolder('some-other-folder');

			expect(result.isGisShapefilesFolder).toBe(false);
			expect(result.multiple).toBe(true);
			expect(result.allowedTypes).toContain('pdf');
			expect(result.allowedTypes).toContain('docx');
		});

		it('should include full default allowed types list', () => {
			const result = getUploadConfigForFolder('anything');

			expect(result.allowedTypes).toEqual(
				expect.arrayContaining(['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx'])
			);
		});

		it('should not allow zip files in default config', () => {
			const result = getUploadConfigForFolder('anything');

			expect(result.allowedTypes).not.toContain('zip');
		});

		it('should include default disclaimer text', () => {
			const result = getUploadConfigForFolder('anything');

			expect(result.disclaimerText).toBe(
				'Saving files will default them to ‘Unredacted’ and ‘Not checked’'
			);
		});

		it('should not include GIS-specific fields', () => {
			const result = getUploadConfigForFolder('anything');

			expect(result.fileTypeText).toBeUndefined();
			expect(result.sizeText).toBeUndefined();
			expect(result.showUploadLabel).toBeUndefined();
		});
	});
});
