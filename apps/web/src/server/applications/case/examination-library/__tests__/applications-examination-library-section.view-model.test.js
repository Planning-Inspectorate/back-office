//@ts-nocheck
import { getExaminationLibrarySectionViewModel } from '../applications-examination-library-section.view-model.js';
import { fixtureDynamicSections } from '../../../../../../testing/applications/fixtures/examination-library.js';

describe('applications examination library section view model', () => {
	describe('#getExaminationLibrarySectionViewModel', () => {
		const dynamicSections = fixtureDynamicSections;
		const draftSectionStatus = 'draft';
		const publishedSectionStatus = 'published';
		const baseDocument = {
			caseId: 123,
			folderId: 1,
			isDeleted: false,
			latestDocumentVersion: {
				documentGuid: 'test-guid',
				fileName: 'doc-1',
				description: 'test document description',
				version: 1,
				mime: 'document',
				publishedStatus: 'not_checked',
				author: 'Test Person',
				draftExaminationLibraryReference: 'APP-001'
			}
		};
		const query = {};
		const sectionUrl =
			'/applications-service/case/123/examination-library/category/application-documents';

		it('should return data mapped to the examination library section view model', () => {
			const sectionDocuments = [baseDocument];
			const itemSlug = 'application-documents';

			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments,
				sectionStatus: draftSectionStatus,
				itemSlug,
				query,
				sectionUrl
			});

			expect(result).toEqual(
				expect.objectContaining({
					selectedPageType: 'examination-library',
					sectionHeading: 'Application documents',
					sectionStatus: 'Draft',
					sectionTable: {
						firstCellIsHeader: false,
						rows: [
							[
								{ text: 'APP-001' },
								{ html: 'test document description' },
								{ text: 'Not checked' },
								{
									html: `<a href="/applications-service/case/123/project-documentation/1/document/test-guid/properties" class="govuk-link">Review</a>`
								}
							]
						],
						head: [
							{ text: 'Draft reference' },
							{ text: 'Document description' },
							{ text: 'Status' },
							{ text: 'Actions' }
						],
						caption: 'Items in the examination library',
						captionClasses: 'govuk-table__caption govuk-table__caption--m'
					}
				})
			);
		});

		it('should display author data if table headers include From', () => {
			const sectionDocuments = [baseDocument];
			const itemSlug = 'additional-submissions';

			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments,
				sectionStatus: draftSectionStatus,
				itemSlug,
				query,
				sectionUrl
			});

			expect(result).toEqual(
				expect.objectContaining({
					selectedPageType: 'examination-library',
					sectionHeading: 'Additional submissions',
					sectionStatus: 'Draft',
					sectionTable: {
						firstCellIsHeader: false,
						rows: [
							[
								{ text: 'APP-001' },
								{ html: 'test document description' },
								{ text: 'Test Person' },
								{ text: 'Not checked' },
								{
									html: `<a href="/applications-service/case/123/project-documentation/1/document/test-guid/properties" class="govuk-link">Review</a>`
								}
							]
						],
						head: [
							{ text: 'Draft reference' },
							{ text: 'Document description' },
							{ text: 'From' },
							{ text: 'Status' },
							{ text: 'Actions' }
						],
						caption: 'Items in the examination library',
						captionClasses: 'govuk-table__caption govuk-table__caption--m'
					}
				})
			);
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
				sectionStatus: publishedSectionStatus,
				itemSlug,
				query,
				sectionUrl
			});

			expect(result).toEqual(
				expect.objectContaining({
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
				})
			);
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
				sectionStatus: publishedSectionStatus,
				itemSlug,
				query,
				sectionUrl
			});

			expect(result).toEqual(
				expect.objectContaining({
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
				})
			);
		});

		it('should return null if the item slug is NOT valid', () => {
			const sectionDocuments = [baseDocument];
			const itemSlug = 'invalid-slug';

			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments,
				sectionStatus: draftSectionStatus,
				itemSlug
			});

			expect(result).toEqual(null);
		});

		it('should include the active sort in the view model', () => {
			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments: [baseDocument],
				sectionStatus: draftSectionStatus,
				itemSlug: 'application-documents',
				query: {
					sortBy: 'description'
				},
				sectionUrl
			});

			const descriptionSort = result?.sortLinks.find(
				(sortLink) => sortLink.value === 'description'
			);

			expect(descriptionSort).toEqual(
				expect.objectContaining({
					text: 'Document description',
					value: 'description',
					active: true,
					isDescending: false
				})
			);

			expect(descriptionSort.link).toContain('sortBy=-description');
		});

		it('should display Reference heading when the section is published', () => {
			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments: [baseDocument],
				sectionStatus: publishedSectionStatus,
				itemSlug: 'application-documents',
				query,
				sectionUrl
			});

			expect(result?.sectionTable.head[0]).toEqual({
				text: 'Reference'
			});
		});

		it('should display Draft reference heading when the section is in progress', () => {
			const result = getExaminationLibrarySectionViewModel({
				dynamicSections,
				sectionDocuments: [baseDocument],
				sectionStatus: draftSectionStatus,
				itemSlug: 'application-documents',
				query,
				sectionUrl
			});

			expect(result?.sectionTable.head[0]).toEqual({
				text: 'Draft reference'
			});
		});
	});
});
