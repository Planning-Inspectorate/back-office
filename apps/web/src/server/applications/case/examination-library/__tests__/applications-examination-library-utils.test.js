//@ts-nocheck
import { jest } from '@jest/globals';
import {
	getSectionByItemSlug,
	getCategoryCode,
	getDocumentDescriptionHTML,
	getDynamicSectionsFromTimetable,
	tableSortLinks
} from '../applications-examination-library-utils.js';
import { categoryCodes, examinationLibrarySections } from '../examination-library.constants.js';
import { fixtureDynamicSections } from '../../../../../../testing/applications/fixtures/examination-library.js';

describe('applications examination library utils', () => {
	describe('#getDynamicSectionsFromTimetable', () => {
		it('groups every supported timetable type and preserves the timetable item ID', () => {
			const timetableItems = [
				'accompanied-site-inspection',
				'compulsory-acquisition-hearing',
				'issue-specific-hearing',
				'open-floor-hearing',
				'other-meeting',
				'preliminary-meeting',
				'unaccompanied-site-inspection',
				'procedural-deadline',
				'deadline',
				'deadline-for-close-of-examination',
				'other'
			].map((templateType, index) => ({
				id: index + 20,
				name: `Item ${index + 1}'s name`,
				ExaminationTimetableType: { templateType }
			}));

			const result = getDynamicSectionsFromTimetable(timetableItems);

			expect(result.map(({ slug, items }) => [slug, items.length])).toEqual([
				['events-and-hearings', 7],
				['procedural-deadlines', 1],
				['deadlines', 2]
			]);
			expect(result[1].items[0]).toEqual({
				title: "Item 8's name",
				href: 'item-8s-name',
				examinationTimetableItemId: 27
			});
			expect(result.flatMap(({ items }) => items)).toHaveLength(10);
		});

		it('returns empty dynamic sections when there are no timetable items', () => {
			expect(getDynamicSectionsFromTimetable()).toEqual([
				{ slug: 'events-and-hearings', items: [] },
				{ slug: 'procedural-deadlines', items: [] },
				{ slug: 'deadlines', items: [] }
			]);
		});
	});

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
				description: 'doc-1',
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

	describe('#tableSortLinks', () => {
		const sectionUrl = '/applications-service/case/123/examination-library/application-documents';

		it('should create the correct sort links for a published section', () => {
			const headers = ['Reference', 'Document description', 'From', 'Status', 'Actions'];

			const result = tableSortLinks({}, headers, sectionUrl, true);

			expect(result).toEqual([
				expect.objectContaining({
					text: 'Reference',
					value: 'examinationRefNo'
				}),
				expect.objectContaining({
					text: 'Document description',
					value: 'description'
				}),
				expect.objectContaining({
					text: 'From',
					value: 'author'
				}),
				expect.objectContaining({
					text: 'Status',
					value: 'publishedStatus'
				}),
				expect.objectContaining({
					text: 'Actions',
					value: ''
				})
			]);
		});

		it('should not make the reference sortable if the section is not published', () => {
			const headers = ['Reference', 'Document description', 'Status', 'Actions'];

			const result = tableSortLinks({}, headers, sectionUrl, false);

			expect(result[0]).toEqual(
				expect.objectContaining({
					text: 'Reference',
					value: ''
				})
			);
		});

		it('should only include headers configured for the section', () => {
			const headers = ['Reference', 'Document description', 'Status', 'Actions'];

			const result = tableSortLinks({}, headers, sectionUrl, true);

			expect(result.map(({ text }) => text)).toEqual([
				'Reference',
				'Document description',
				'Status',
				'Actions'
			]);
		});

		it('should toggle the active sort to descending and reset the page', () => {
			const query = {
				sortBy: 'description',
				page: '3',
				pageSize: '50'
			};

			const result = tableSortLinks(query, ['Document description'], sectionUrl, true);

			expect(result[0]).toEqual(
				expect.objectContaining({
					text: 'Document description',
					value: 'description',
					active: true,
					isDescending: false
				})
			);

			expect(result[0].link).toContain('sortBy=-description');
			expect(result[0].link).toContain('page=1');
			expect(result[0].link).toContain('pageSize=50');
		});
	});
});
