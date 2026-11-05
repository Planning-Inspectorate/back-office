//@ts-nocheck
import { getExaminationLibraryUnpublishViewModel } from '../applications-examination-library-unpublish.view-model.js';

describe('applications examination library unpublish view model', () => {
	describe('#getExaminationLibraryUnpublishViewModel', () => {
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
				examinationRefNo: 'APP-001'
			}
		};

		const section = {
			index: 1,
			heading: 'Application documents',
			slug: 'application-documents',
			items: [
				{
					title: 'Application documents',
					hint: 'Hint text',
					href: 'application-documents'
				}
			],
			tableHeaders: ['Header 1', 'Header 2']
		};

		const caseId = 123;
		const itemSlug = 'application-documents';

		it('should return data mapped to the examination library unpublish view model', () => {
			const categoryDocuments = [baseDocument];

			const result = getExaminationLibraryUnpublishViewModel({
				caseId,
				categoryDocuments,
				itemSlug,
				section
			});

			expect(result).toEqual({
				selectedPageType: 'examination-library',
				sectionHeading: 'Application documents',
				unpublishTable: {
					firstCellIsHeader: false,
					rows: [
						[
							{ text: 'APP-001' },
							{
								html: '<a href="/applications-service/case/123/project-documentation/1/document/test-guid/properties" class="govuk-link">test document description</a>'
							}
						]
					],
					head: [{ text: 'Reference' }, { text: 'Document' }],
					caption: 'Application documents',
					captionClasses: 'govuk-table__caption govuk-table__caption--m'
				},
				backLink:
					'/applications-service/case/123/examination-library/category/application-documents'
			});
		});

		it('should NOT populate a row for a document with missing data', () => {
			const categoryDocuments = [
				{
					...baseDocument,
					latestDocumentVersion: {}
				}
			];

			const result = getExaminationLibraryUnpublishViewModel({
				caseId,
				categoryDocuments,
				itemSlug,
				section
			});

			expect(result.unpublishTable.rows[0]).toEqual([]);
		});

		it('should display correct copy if there is no examination reference number', () => {
			const categoryDocuments = [
				{
					...baseDocument,
					latestDocumentVersion: {
						...baseDocument.latestDocumentVersion,
						examinationRefNo: null
					}
				}
			];

			const result = getExaminationLibraryUnpublishViewModel({
				caseId,
				categoryDocuments,
				itemSlug,
				section
			});

			expect(result.unpublishTable.rows[0]).toEqual([
				{ text: '' },
				{
					html: '<a href="/applications-service/case/123/project-documentation/1/document/test-guid/properties" class="govuk-link">test document description</a>'
				}
			]);
		});

		it('should display correct copy if there is no document description', () => {
			const categoryDocuments = [
				{
					...baseDocument,
					latestDocumentVersion: {
						...baseDocument.latestDocumentVersion,
						description: null
					}
				}
			];

			const result = getExaminationLibraryUnpublishViewModel({
				caseId,
				categoryDocuments,
				itemSlug,
				section
			});

			expect(result.unpublishTable.rows[0]).toEqual([
				{ text: 'APP-001' },
				{
					html: '<a href="/applications-service/case/123/project-documentation/1/document/test-guid/properties" class="govuk-link">Missing property</a>'
				}
			]);
		});

		it('should display correct copy if document is deleted', () => {
			const categoryDocuments = [
				{
					...baseDocument,
					isDeleted: true
				}
			];

			const result = getExaminationLibraryUnpublishViewModel({
				caseId,
				categoryDocuments,
				itemSlug,
				section
			});

			expect(result.unpublishTable.rows[0]).toEqual([
				{ text: 'APP-001' },
				{ text: 'Document has been deleted' }
			]);
		});
	});
});
