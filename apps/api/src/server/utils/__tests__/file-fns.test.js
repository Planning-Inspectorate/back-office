import { trimDocumentNameKnownSuffix, removeMultipleSpacesAndTrim } from '../file-fns';

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

	describe('removeMultipleSpacesAndTrim', () => {
		it('should remove multiple spaces and trim the string', () => {
			expect(removeMultipleSpacesAndTrim('  hello   world  ')).toBe('hello world');
		});

		it('should handle tabs and newlines as spaces', () => {
			expect(removeMultipleSpacesAndTrim('\thello\t\tworld\n')).toBe('hello world');
		});

		it('should return empty string if input is only spaces', () => {
			expect(removeMultipleSpacesAndTrim('     ')).toBe('');
		});

		it('should return the same string if there are no extra spaces', () => {
			expect(removeMultipleSpacesAndTrim('hello world')).toBe('hello world');
		});

		it('should handle empty string', () => {
			expect(removeMultipleSpacesAndTrim('')).toBe('');
		});

		it('should replace all whitespace characters with single spaces', () => {
			expect(removeMultipleSpacesAndTrim('a\tb\nc\rd')).toBe('a b c d');
		});
		it('should return empty string for null input', () => {
			// @ts-ignore
			expect(removeMultipleSpacesAndTrim(null)).toBe(null);
		});
	});
});
