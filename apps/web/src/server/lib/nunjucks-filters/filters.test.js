import { documentName } from './document-name.js';

// TODO: add tests for other filters

describe('Nunjucks filters', () => {
	describe('documentName', () => {
		it('should remove extension', () => {
			const documentName1 = 'file_normal.png';
			const documentName2 = 'file.with.many.dots.png';
			const documentName3 = 'file_with_no_dots';

			const filteredDocumentName1 = documentName(documentName1);
			const filteredDocumentName2 = documentName(documentName2);
			const filteredDocumentName3 = documentName(documentName3);

			expect(filteredDocumentName1).toBe('file_normal');
			expect(filteredDocumentName2).toBe('file.with.many.dots');
			expect(filteredDocumentName3).toBe('file_with_no_dots');
		});
	});
});
