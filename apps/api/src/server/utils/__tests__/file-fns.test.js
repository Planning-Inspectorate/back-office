import { trimDocumentNameSuffix } from '../file-fns';

describe('trimDocumentNameSuffix', () => {
	it('should remove the extension from the document name', () => {
		const result = trimDocumentNameSuffix('document.txt');
		expect(result).toBe('document');
	});

	it('should return the same name if there is no extension', () => {
		const result = trimDocumentNameSuffix('document');
		expect(result).toBe('document');
	});

	it('should handle multiple dots in the document name', () => {
		const result = trimDocumentNameSuffix('my.document.name.txt');
		expect(result).toBe('my.document.name');
	});

	it('should handle empty string', () => {
		const result = trimDocumentNameSuffix('');
		expect(result).toBe('');
	});

	it('should handle document names with only an extension', () => {
		const result = trimDocumentNameSuffix('.hiddenfile');
		expect(result).toBe('');
	});
});
