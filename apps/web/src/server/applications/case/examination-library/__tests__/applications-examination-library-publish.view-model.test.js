//@ts-nocheck
import { getExaminationLibraryPublishViewModel } from '../applications-examination-library-publish.view-model.js';
import { fixtureDynamicSections } from '../../../../../../testing/applications/fixtures/examination-library.js';

describe('applications examination library publish view model', () => {
	describe('#getExaminationLibraryPublishViewModel', () => {
		const dynamicSections = fixtureDynamicSections;
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
				dynamicSections,
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
				dynamicSections,
				sectionDocuments,
				totalPublishedCount: 67,
				unpublishedCount: 5,
				itemSlug,
				caseId: 123,
				projectName: 'Test Project'
			});

			expect(result).toEqual({
				selectedPageType: 'examination-library',
				pageTitle:
					'Check details and publish Application documents to the examination library - Test Project - NSIP applications',
				sectionHeading: 'Application documents',
				backLink:
					'/applications-service/case/123/examination-library/category/application-documents',
				publishUrl:
					'/applications-service/case/123/examination-library/category/application-documents/publish',
				categoryCode: 'APP',
				examinationTimetableItemId: undefined,
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
					firstCellIsHeader: false,
					rows: [
						[
							{ html: '<strong>APP-001</strong>' },
							{
								html: '<a href="/applications-service/case/123/project-documentation/1/document/test-guid/properties" class="govuk-link">Application Form Document</a>'
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
				dynamicSections,
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
				dynamicSections,
				sectionDocuments: [deletedDoc],
				totalPublishedCount: 1,
				unpublishedCount: 0,
				itemSlug: 'application-documents',
				caseId: 123
			});

			expect(result.sectionTable.rows[0]).toEqual([
				{ text: '' },
				{ text: 'Document has been deleted' },
				{ text: '' }
			]);
		});

		it('should support dynamic timetable item category', () => {
			const dynamicDoc = {
				caseId: 123,
				folderId: 2,
				isDeleted: false,
				latestDocumentVersion: {
					documentGuid: 'doc-guid-2',
					fileName: 'deadline-doc',
					description: 'Deadline submission',
					version: 1,
					mime: 'document',
					publishedStatus: 'published',
					author: 'Local Council',
					draftExaminationLibraryReference: 'REP1-001'
				}
			};

			const customDynamicSections = [
				{
					slug: 'deadlines',
					items: [
						{
							title: 'Deadline 1',
							href: 'deadline-1',
							examinationTimetableItemId: 58
						}
					]
				}
			];

			const result = getExaminationLibraryPublishViewModel({
				dynamicSections: customDynamicSections,
				sectionDocuments: [dynamicDoc],
				totalPublishedCount: 1,
				unpublishedCount: 2,
				itemSlug: 'deadline-1',
				caseId: 123
			});

			expect(result.sectionHeading).toBe('Deadline 1');
			expect(result.categoryCode).toBe('');
			expect(result.examinationTimetableItemId).toBe(58);
			expect(result.sectionTable.rows[0][0]).toEqual({ html: '<strong>REP1-001</strong>' });
		});
	});
});
