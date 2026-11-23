//@ts-nocheck
import { getExaminationLibraryIndexViewModel } from '../applications-examination-library-index.view-model.js';
import { examinationLibrarySections } from '../examination-library.constants.js';

describe('applications examination library index view model', () => {
	const caseId = 100000082;
	const getSection = (viewModel, slug) =>
		viewModel.sections.find((section) => section.slug === slug);

	describe('#getExaminationLibraryIndexViewModel', () => {
		it('should return the existing sections when no categories are provided', () => {
			const result = getExaminationLibraryIndexViewModel({ caseId });

			expect(result.selectedPageType).toEqual('examination-library');
			expect(result.sections).toHaveLength(examinationLibrarySections.length);
			expect(result.sections.map((section) => section.slug)).toEqual(
				examinationLibrarySections.map((section) => section.slug)
			);
		});

		it('should map static categories with their publication statuses', () => {
			const categories = [
				{
					categoryCode: 'APP',
					categoryName: 'Application documents',
					publishedStatus: 'published',
					source: 'SYSTEM'
				}
			];

			const result = getExaminationLibraryIndexViewModel({ caseId, categories });
			const section = getSection(result, 'application-documents');

			expect(section.items[0]).toEqual(
				expect.objectContaining({
					title: { text: 'Application documents' },
					href: expect.stringContaining('/category/application-documents'),
					status: {
						tag: expect.objectContaining({
							text: 'Published'
						})
					}
				})
			);
		});

		it.each([
			['EV1', 'Open Floor Hearing 1', 'events-and-hearings', 'open-floor-hearing-1'],
			['PDA', 'Procedural Deadline 1', 'procedural-deadlines', 'procedural-deadline-1'],
			['REP1', 'Deadline 1', 'deadlines', 'deadline-1']
		])(
			'should add dynamic category %s to the correct section',
			(categoryCode, categoryName, sectionSlug, itemSlug) => {
				const categories = [
					{
						categoryCode,
						categoryName,
						publishedStatus: 'in progress',
						source: 'TIMETABLE'
					}
				];

				const result = getExaminationLibraryIndexViewModel({ caseId, categories });
				const section = getSection(result, sectionSlug);

				expect(section.items).toEqual([
					expect.objectContaining({
						title: { text: categoryName },
						href: expect.stringContaining(`/category/${sectionSlug}/${itemSlug}`),
						status: {
							tag: expect.objectContaining({
								text: 'In progress'
							})
						}
					})
				]);
			}
		);

		it('should add multiple dynamic categories to the same section', () => {
			const categories = [
				{
					categoryCode: 'EV1',
					categoryName: 'Open Floor Hearing 1',
					publishedStatus: 'in progress',
					source: 'TIMETABLE'
				},
				{
					categoryCode: 'EV2',
					categoryName: 'Issue Specific Hearing 1',
					publishedStatus: 'in progress',
					source: 'TIMETABLE'
				}
			];

			const result = getExaminationLibraryIndexViewModel({ caseId, categories });
			const section = getSection(result, 'events-and-hearings');

			expect(section.items).toHaveLength(2);
			expect(section.items.map((item) => item.title.text)).toEqual([
				'Open Floor Hearing 1',
				'Issue Specific Hearing 1'
			]);
		});

		it('should use the default status when a category has no publication status', () => {
			const categories = [
				{
					categoryCode: 'EV1',
					categoryName: 'Open Floor Hearing 1',
					source: 'TIMETABLE'
				}
			];

			const result = getExaminationLibraryIndexViewModel({ caseId, categories });
			const section = getSection(result, 'events-and-hearings');

			expect(section.items[0].status.tag.text).toEqual('In progress');
		});

		it('should not add unsupported timetable categories', () => {
			const categories = [
				{
					categoryCode: 'UNKNOWN',
					categoryName: 'Unknown Category',
					publishedStatus: 'in progress',
					source: 'TIMETABLE'
				}
			];

			const result = getExaminationLibraryIndexViewModel({ caseId, categories });

			expect(getSection(result, 'events-and-hearings').items).toEqual([]);
			expect(getSection(result, 'procedural-deadlines').items).toEqual([]);
			expect(getSection(result, 'deadlines').items).toEqual([]);
		});

		it('should not mutate the original examination library sections', () => {
			const categories = [
				{
					categoryCode: 'EV1',
					categoryName: 'Open Floor Hearing 1',
					publishedStatus: 'in progress',
					source: 'TIMETABLE'
				}
			];

			getExaminationLibraryIndexViewModel({ caseId, categories });
			const originalSection = examinationLibrarySections.find(
				(section) => section.slug === 'events-and-hearings'
			);

			expect(originalSection.items).toEqual([]);
		});

		it('should retain the existing section order when dynamic categories are added', () => {
			const categories = [
				{
					categoryCode: 'EV1',
					categoryName: 'Open Floor Hearing 1',
					publishedStatus: 'in progress',
					source: 'TIMETABLE'
				}
			];

			const result = getExaminationLibraryIndexViewModel({ caseId, categories });

			expect(result.sections.map((section) => section.slug)).toEqual(
				examinationLibrarySections.map((section) => section.slug)
			);
		});
	});
});
