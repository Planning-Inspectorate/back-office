//@ts-nocheck
import { getExaminationLibraryPublishViewModel } from '../applications-examination-library-publish.view-model.js';
describe('applications examination library publish view model', () => {
	describe('#getExaminationLibraryPublishViewModel', () => {
		const baseDocument = {
			caseId: 123,
			folderId: 1,
			isDeleted: false,
			latestDocumentVersion: {
				documentGuid: 'test-guid',
				fileName: 'doc-1',
				description: 'Application Form Document',
				version: 1,
				mime: 'document',
				publishedStatus: 'published',
				author: 'Highways England',
				draftExaminationLibraryReference: 'APP-001'
			}
		};

		it('should return null when section cannot be found', () => {
			const result = getExaminationLibraryPublishViewModel({
				sectionDocuments: [baseDocument],
				totalPublishedCount: 1,
				unpublishedCount: 0,
				itemSlug: 'non-existent-section-slug',
				caseId: 123
			});

			expect(result).toBeNull();
		});

		it('should map publish view model for static category with published documents', () => {
			const sectionDocuments = [baseDocument];
			const itemSlug = 'application-documents';

			const result = getExaminationLibraryPublishViewModel({
				sectionDocuments,
				totalPublishedCount: 67,
				unpublishedCount: 5,
				itemSlug,
				caseId: 123
			});

			expect(result).toEqual({
				selectedPageType: 'examination-library',
				sectionHeading: 'Application documents',
				backLink:
					'/applications-service/case/123/examination-library/category/application-documents',
				publishUrl:
					'/applications-service/case/123/examination-library/category/application-documents/publish',
				categoryCode: 'APP',
				totalPublishedCount: 67,
				unpublishedCount: 5,
				totalItemsText:
					'The Application documents category for the examination library will contain references for 67 items.',
				hasUnpublishedItems: true,
				unpublishedInsetText:
					'5 items are not yet published and will not be assigned an examination library reference number. The other references have been adjusted to reflect this.',
				warningText:
					'Once an examination library category has been published, the examination library references are final and cannot be changed.',
				sectionTable: {
					firstCellIsHeader: true,
					rows: [
						[
							{ text: 'APP-001' },
							{
								text: 'Application Form Document',
								href: '/applications-service/case/123/project-documentation/1/document/test-guid/properties'
							},
							{ text: 'Highways England' }
						]
					],
					head: [{ text: 'Reference' }, { text: 'Document' }, { text: 'From' }],
					caption: 'Application documents',
					captionClasses: 'govuk-visually-hidden'
				}
			});
		});

		it('should not display unpublished callout when unpublishedCount is zero', () => {
			const result = getExaminationLibraryPublishViewModel({
				sectionDocuments: [baseDocument],
				totalPublishedCount: 10,
				unpublishedCount: 0,
				itemSlug: 'application-documents',
				caseId: 123
			});

			expect(result.hasUnpublishedItems).toBe(false);
			expect(result.totalPublishedCount).toBe(10);
			expect(result.unpublishedCount).toBe(0);
		});

		it('should map deleted documents to empty cells with deleted text', () => {
			const deletedDoc = {
				...baseDocument,
				isDeleted: true
			};

			const result = getExaminationLibraryPublishViewModel({
				sectionDocuments: [deletedDoc],
				totalPublishedCount: 1,
				unpublishedCount: 0,
				itemSlug: 'application-documents',
				caseId: 123
			});

			expect(result.sectionTable.rows[0]).toEqual([
				{ text: 'APP-001' },
				{ text: 'Document has been deleted' },
				{ text: '' }
			]);
		});
	});
});
