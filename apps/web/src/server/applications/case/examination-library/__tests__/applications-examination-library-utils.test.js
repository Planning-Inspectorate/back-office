//@ts-nocheck
import { jest } from '@jest/globals';
import {
	getSectionByItemSlug,
	getCategoryCode,
	getDocumentDescriptionHTML
} from '../applications-examination-library-utils.js';
import { categoryCodes, examinationLibrarySections } from '../examination-library.constants.js';
import { fixtureDynamicSections } from '../../../../../../testing/applications/fixtures/examination-library.js';

describe('applications examination library utils', () => {
	describe('#getSectionByItemSlug', () => {
		const staticSections = examinationLibrarySections;
		const dynamicSections = fixtureDynamicSections;

		it('should return static section data if item slug is valid', () => {
			const itemSlug = 'application-documents';
			const result = getSectionByItemSlug(staticSections, dynamicSections, itemSlug);

			expect(result).toEqual({
				index: 1,
				heading: 'Application documents',
				slug: 'application-documents',
				items: [
					{
						title: 'Application documents',
						hint: 'Any amended versions accepted before or at the Preliminary Meeting should be saved as Additional Submissions.',
						href: 'application-documents'
					}
				],
				tableHeaders: ['Reference', 'Document description', 'Status', 'Actions']
			});
		});

		it('should return dynamic section data if item slug is valid', () => {
			const itemSlug = 'deadlines-1';
			const result = getSectionByItemSlug(staticSections, dynamicSections, itemSlug);

			expect(result).toEqual({
				index: 9,
				heading: 'Deadlines',
				slug: 'deadlines',
				items: [
					{
						title: 'Deadlines 1',
						href: 'deadlines-1'
					},
					{
						title: 'Deadlines 2',
						href: 'deadlines-2'
					}
				],
				tableHeaders: ['Reference', 'Document description', 'From', 'Status', 'Actions']
			});
		});

		it('should return null if item slug is NOT valid', () => {
			const itemSlug = 'invalid-slug';
			const result = getSectionByItemSlug(staticSections, dynamicSections, itemSlug);

			expect(result).toEqual(null);
		});
	});

	describe('#getCategoryCode', () => {
		it('should return the category code if a category code has been assigned to the section', () => {
			const section = examinationLibrarySections[0];
			const result = getCategoryCode(section, categoryCodes);

			expect(result).toEqual('APP');
		});

		it('should return an empty string if a category code has NOT been assigned to the section', () => {
			const section = examinationLibrarySections[8];
			const result = getCategoryCode(section, categoryCodes);

			expect(result).toEqual('');
		});
	});

	describe('#getDocumentDescriptionHTML', () => {
		const baseDocument = {
			caseId: 123,
			folderId: 1,
			latestDocumentVersion: {
				documentGuid: 'test-guid',
				fileName: 'doc-1',
				version: 1
			}
		};

		it('should return an empty string if document data is missing', () => {
			const document = {
				caseId: 123,
				folderId: 1,
				latestDocumentVersion: {}
			};

			const result = getDocumentDescriptionHTML(document);

			expect(result).toEqual('');
		});

		it('should return a link if the mime type can be previewed and the publish status is enabled', () => {
			const url = jest
				.fn()
				.mockReturnValueOnce('/documents/123/download/test-guid/version/1/preview');
			const documentPreviewURL = url();

			['application/pdf', 'image/jpeg', 'image/png'].forEach((mime) => {
				const document = {
					...baseDocument,
					latestDocumentVersion: {
						...baseDocument.latestDocumentVersion,
						publishedStatus: 'published',
						mime
					}
				};

				const result = getDocumentDescriptionHTML(document);

				expect(result).toEqual(`<a href="${documentPreviewURL}" class="govuk-link">doc-1</a>`);
			});
		});

		it('should return plain text if the mime type can be previewed and the publish status is NOT enabled', () => {
			['application/pdf', 'image/jpeg', 'image/png'].forEach((mime) => {
				const document = {
					...baseDocument,
					latestDocumentVersion: {
						...baseDocument.latestDocumentVersion,
						publishedStatus: 'awaiting_virus_check',
						mime
					}
				};

				const result = getDocumentDescriptionHTML(document);

				expect(result).toEqual('doc-1');
			});
		});

		it('should return plain text if the mime type CANNOT be previewed and the publish status is enabled', () => {
			['application/msword', 'audio/mpeg', 'application/vnd.ms-excel'].forEach((mime) => {
				const document = {
					...baseDocument,
					latestDocumentVersion: {
						...baseDocument.latestDocumentVersion,
						publishedStatus: 'published',
						mime
					}
				};

				const result = getDocumentDescriptionHTML(document);

				expect(result).toEqual('doc-1');
			});
		});
	});
});
