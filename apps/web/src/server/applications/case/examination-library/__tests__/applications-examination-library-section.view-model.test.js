//@ts-nocheck
import { getExaminationLibrarySectionViewModel } from '../applications-examination-library-section.view-model.js';
import { examinationLibrarySections } from '../examination-library.constants.js';

describe('applications examination library section view model', () => {
	describe('#getExaminationLibrarySectionViewModel', () => {
		const inProgressSectionStatus = 'in progress';
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

		const getSection = (itemSlug) =>
			examinationLibrarySections.find((section) =>
				section.items.some((item) => item.href === itemSlug)
			);

		it('should return data mapped to the examination library section view model', () => {
			const sectionDocuments = [baseDocument];
			const itemSlug = 'application-documents';

			const result = getExaminationLibrarySectionViewModel({
				section: getSection(itemSlug),
				sectionDocuments,
				sectionStatus: inProgressSectionStatus,
				itemSlug,
				query,
				sectionUrl
			});

			expect(result).toEqual(
				expect.objectContaining({
					selectedPageType: 'examination-library',
					sectionHeading: 'Application documents',
					sectionStatus: 'In progress',
					sectionTable: {
						firstCellIsHeader: false,
						rows: [
							[
								{ text: 'APP-001' },
								{ html: 'test document description' },
								{ text: 'Not checked' },
								{
									text: 'Review',
									href: '/applications-service/case/123/project-documentation/1/document/test-guid/properties'
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
				section: getSection(itemSlug),
				sectionDocuments,
				sectionStatus: inProgressSectionStatus,
				itemSlug,
				query,
				sectionUrl
			});

			expect(result).toEqual(
				expect.objectContaining({
					selectedPageType: 'examination-library',
					sectionHeading: 'Additional submissions',
					sectionStatus: 'In progress',
					sectionTable: {
						firstCellIsHeader: false,
						rows: [
							[
								{ text: 'APP-001' },
								{ html: 'test document description' },
								{ text: 'Test Person' },
								{ text: 'Not checked' },
								{
									text: 'Review',
									href: '/applications-service/case/123/project-documentation/1/document/test-guid/properties'
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
				section: getSection(itemSlug),
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
								{ text: 'APP-001' },
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
				section: getSection(itemSlug),
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
				section: getSection(itemSlug),
				sectionDocuments,
				sectionStatus: inProgressSectionStatus,
				itemSlug
			});

			expect(result).toEqual(null);
		});

		it('should include the active sort in the view model', () => {
			const result = getExaminationLibrarySectionViewModel({
				section: getSection('application-documents'),
				sectionDocuments: [baseDocument],
				sectionStatus: inProgressSectionStatus,
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
				section: getSection('application-documents'),
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
				section: getSection('application-documents'),
				sectionDocuments: [baseDocument],
				sectionStatus: inProgressSectionStatus,
				itemSlug: 'application-documents',
				query,
				sectionUrl
			});

			expect(result?.sectionTable.head[0]).toEqual({
				text: 'Draft reference'
			});
		});

		it('should display the persisted examination library reference when one exists', () => {
			const sectionDocuments = [
				{
					...baseDocument,
					latestDocumentVersion: {
						...baseDocument.latestDocumentVersion,
						draftExaminationLibraryReference: undefined,
						examinationRefNo: 'APP-001a'
					}
				}
			];

			const result = getExaminationLibrarySectionViewModel({
				section: getSection('application-documents'),
				sectionDocuments,
				sectionStatus: inProgressSectionStatus,
				itemSlug: 'application-documents',
				query,
				sectionUrl
			});

			expect(result?.sectionTable.rows[0][0]).toEqual({
				text: 'APP-001a'
			});
		});

		describe('dynamic categories', () => {
			const itemSlug = 'open-floor-hearing-1';
			const sectionUrl =
				'/applications-service/case/123/examination-library/category/events-and-hearings/open-floor-hearing-1';
			const section = {
				...examinationLibrarySections.find((section) => section.slug === 'events-and-hearings'),
				items: [
					{
						title: 'Open Floor Hearing 1',
						href: itemSlug
					}
				]
			};
			it('should display the dynamic category heading and status', () => {
				const result = getExaminationLibrarySectionViewModel({
					section,
					sectionDocuments: [],
					sectionStatus: inProgressSectionStatus,
					itemSlug,
					query,
					sectionUrl
				});
				expect(result).toEqual(
					expect.objectContaining({
						selectedPageType: 'examination-library',
						sectionHeading: 'Open Floor Hearing 1',
						sectionStatus: 'In progress'
					})
				);
			});
			it('should use the parent section table headers', () => {
				const result = getExaminationLibrarySectionViewModel({
					section,
					sectionDocuments: [baseDocument],
					sectionStatus: inProgressSectionStatus,
					itemSlug,
					query,
					sectionUrl
				});
				expect(result.sectionTable.head).toEqual([
					{ text: 'Draft reference' },
					{ text: 'Document description' },
					{ text: 'Status' },
					{ text: 'Actions' }
				]);
			});
			it('should display Reference instead of Draft reference when published', () => {
				const result = getExaminationLibrarySectionViewModel({
					section,
					sectionDocuments: [],
					sectionStatus: publishedSectionStatus,
					itemSlug,
					query,
					sectionUrl
				});
				expect(result.sectionTable.head[0]).toEqual({
					text: 'Reference'
				});
				expect(result.sectionStatus).toEqual('Published');
			});
			it('should return null if the item slug does not match the resolved section', () => {
				const result = getExaminationLibrarySectionViewModel({
					section,
					sectionDocuments: [],
					sectionStatus: inProgressSectionStatus,
					itemSlug: 'unknown-hearing',
					query,
					sectionUrl
				});
				expect(result).toEqual(null);
			});

			it.each([
				['events-and-hearings', 'Open Floor Hearing 1', 'open-floor-hearing-1', false],
				['procedural-deadlines', 'Procedural Deadline 1', 'procedural-deadline-1', true],
				['deadlines', 'Deadline 1', 'deadline-1', true]
			])(
				'should use the configured table headers for %s',
				(sectionSlug, title, itemSlug, hasAuthor) => {
					const parentSection = examinationLibrarySections.find(
						(section) => section.slug === sectionSlug
					);
					const section = {
						...parentSection,
						items: [{ title, href: itemSlug }]
					};
					const result = getExaminationLibrarySectionViewModel({
						section,
						sectionDocuments: [],
						sectionStatus: inProgressSectionStatus,
						itemSlug,
						query,
						sectionUrl
					});
					expect(result.sectionTable.head.some((header) => header.text === 'From')).toBe(hasAuthor);
				}
			);
		});
	});
});
