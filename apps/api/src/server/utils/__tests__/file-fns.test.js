import { trimDocumentNameKnownSuffix } from '../file-fns';

describe('trimDocumentNameKnownSuffix', () => {
	it('should remove the extension from the document name with lower case suffix', () => {
		const result = trimDocumentNameKnownSuffix('document.txt');
		expect(result).toBe('document');
	});

	it('should return the same name if there is no extension', () => {
		const result = trimDocumentNameKnownSuffix('document');
		expect(result).toBe('document');
	});

	it('should handle multiple dots in the document name', () => {
		const result = trimDocumentNameKnownSuffix('my.document.name.txt');
		expect(result).toBe('my.document.name');
	});

	it('should handle capital letter suffixes in the document name', () => {
		const result = trimDocumentNameKnownSuffix('CAPITALS.TXT');
		expect(result).toBe('CAPITALS');
	});

	it('should handle empty string', () => {
		const result = trimDocumentNameKnownSuffix('');
		expect(result).toBe('');
	});

	it('should not trim document names with unknown extensions', () => {
		const result = trimDocumentNameKnownSuffix('.hiddenfile');
		expect(result).toBe('.hiddenfile');
	});
});
