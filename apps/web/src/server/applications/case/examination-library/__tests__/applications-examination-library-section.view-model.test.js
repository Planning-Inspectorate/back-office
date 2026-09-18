import { getExaminationLibrarySectionViewModel } from '../applications-examination-library-section.view-model.js';
import { fixtureDynamicSections } from '../../../../../../testing/applications/fixtures/examination-library.js';

describe('applications examination library section view model', () => {
	describe('#getExaminationLibrarySectionViewModel', () => {
		const dynamicSections = fixtureDynamicSections;
		const sectionStatus = 'published';
		const baseDocument = {
			caseId: 123,
			folderId: 1,
			isDeleted: false,
			latestDocumentVersion: {
				documentGuid: 'test-guid',
				fileName: 'doc-1',
				version: 1,
				mime: 'document',
				publishedStatus: 'not_checked',
				author: 'Test Person'
			}
		};

		it('should return data mapped to the examination library section view model', () => {
			const sectionDocuments = [baseDocument];
			const itemSlug = 'application-documents';

			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments,
				sectionStatus,
				itemSlug
			});

			expect(result).toEqual({
				selectedPageType: 'examination-library',
				sectionHeading: 'Application documents',
				sectionStatus: 'Published',
				sectionTable: {
					firstCellIsHeader: false,
					rows: [
						[
							{ text: '' },
							{ html: 'doc-1' },
							{ text: 'Not checked' },
							{
								html: `<a href="/applications-service/case/123/project-documentation/1/document/test-guid/properties" class="govuk-link">Review</a>`
							}
						]
					],
					head: [
						{ text: 'Reference' },
						{ text: 'Document description' },
						{ text: 'Status' },
						{ text: 'Actions' }
					],
					caption: 'Items in the examination library',
					captionClasses: 'govuk-table__caption govuk-table__caption--m'
				}
			});
		});

		it('should display author data if table headers include From', () => {
			const sectionDocuments = [baseDocument];
			const itemSlug = 'additional-submissions';

			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments,
				sectionStatus,
				itemSlug
			});

			expect(result).toEqual({
				selectedPageType: 'examination-library',
				sectionHeading: 'Additional submissions',
				sectionStatus: 'Published',
				sectionTable: {
					firstCellIsHeader: false,
					rows: [
						[
							{ text: '' },
							{ html: 'doc-1' },
							{ text: 'Test Person' },
							{ text: 'Not checked' },
							{
								html: `<a href="/applications-service/case/123/project-documentation/1/document/test-guid/properties" class="govuk-link">Review</a>`
							}
						]
					],
					head: [
						{ text: 'Reference' },
						{ text: 'Document description' },
						{ text: 'From' },
						{ text: 'Status' },
						{ text: 'Actions' }
					],
					caption: 'Items in the examination library',
					captionClasses: 'govuk-table__caption govuk-table__caption--m'
				}
			});
		});

		it('should display correct copy if document is deleted', () => {
			const sectionDocuments = [
				{
					...baseDocument,
					isDeleted: true
				}
			];
			const itemSlug = 'additional-submissions';

			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments,
				sectionStatus,
				itemSlug
			});

			expect(result).toEqual({
				selectedPageType: 'examination-library',
				sectionHeading: 'Additional submissions',
				sectionStatus: 'Published',
				sectionTable: {
					firstCellIsHeader: false,
					rows: [
						[
							{ text: '' },
							{ text: 'Document has been deleted' },
							{ text: '' },
							{ text: '' },
							{ text: '' }
						]
					],
					head: [
						{ text: 'Reference' },
						{ text: 'Document description' },
						{ text: 'From' },
						{ text: 'Status' },
						{ text: 'Actions' }
					],
					caption: 'Items in the examination library',
					captionClasses: 'govuk-table__caption govuk-table__caption--m'
				}
			});
		});

		it('should NOT populate a row for a document with missing data', () => {
			const sectionDocuments = [
				{
					...baseDocument,
					latestDocumentVersion: {}
				}
			];
			const itemSlug = 'additional-submissions';

			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments,
				sectionStatus,
				itemSlug
			});

			expect(result).toEqual({
				selectedPageType: 'examination-library',
				sectionHeading: 'Additional submissions',
				sectionStatus: 'Published',
				sectionTable: {
					firstCellIsHeader: false,
					rows: [[]],
					head: [
						{ text: 'Reference' },
						{ text: 'Document description' },
						{ text: 'From' },
						{ text: 'Status' },
						{ text: 'Actions' }
					],
					caption: 'Items in the examination library',
					captionClasses: 'govuk-table__caption govuk-table__caption--m'
				}
			});
		});

		it('should return null if the item slug is NOT valid', () => {
			const sectionDocuments = [baseDocument];
			const itemSlug = 'invalid-slug';

			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments,
				sectionStatus,
				itemSlug
			});

			expect(result).toEqual(null);
		});
	});
});
